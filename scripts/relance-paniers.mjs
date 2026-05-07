#!/usr/bin/env node
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORE = "conserverie-jean-de-luz.myshopify.com";
const SHOP_URL = "https://www.jeandeluz.com";
const TERRINE_URL = `${SHOP_URL}/products/terrine-offerte-votre-choix`;
const SEUIL_FRANCO = 100;
const FRANCO_A = 50;

const DATA_DIR = join(__dirname, "..", "data");
const REPORT_PATH = join(DATA_DIR, "relance-paniers.json");
const SENT_LOG_PATH = join(DATA_DIR, "relances-envoyees.json");

const QUERY = `query {
  abandonedCheckouts(first:50) {
    edges {
      node {
        id
        createdAt
        totalPriceSet { shopMoney { amount currencyCode } }
        abandonedCheckoutUrl
        customer { email firstName lastName }
        lineItems(first:10) {
          edges {
            node {
              product { id title }
              quantity
              variant { price image { url } }
              title
            }
          }
        }
      }
    }
  }
}`;

function shopifyGraphQL(query) {
  const result = execSync(
    `shopify store execute --store ${STORE} --query '${query.replace(/'/g, "'\\''")}' --json 2>&1`,
    { maxBuffer: 50 * 1024 * 1024, encoding: "utf-8" },
  );
  const clean = result.replace(/\x1b\[\d+[A-Za-z]/g, "").replace(/\x1b\[\d+;\d+[A-Za-z]/g, "");
  const jsonStart = clean.indexOf("{");
  if (jsonStart === -1) throw new Error("No JSON in response:\n" + result);
  return JSON.parse(clean.slice(jsonStart));
}

function formatMontant(amount) {
  return Number(amount).toFixed(2).replace(".", ",") + "€";
}

function loadSentLog() {
  if (!existsSync(SENT_LOG_PATH)) return {};
  try {
    return JSON.parse(readFileSync(SENT_LOG_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function saveSentLog(log) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(SENT_LOG_PATH, JSON.stringify(log, null, 2));
}

// ----------------------------- Templates email -----------------------------

const COLOR_BG = "#fdfbf6";
const COLOR_PRIMARY = "#1c3d2a";
const COLOR_ACCENT = "#c9a96e";
const COLOR_CTA = "#fb7400";
const COLOR_TEXT = "#2b2b2b";
const COLOR_MUTED = "#7a7a7a";
const LOGO_URL = "https://cdn.shopify.com/s/files/1/0489/8684/9433/email_settings/JDL_jpeg.jpeg?v=2287";

function emailLayout({ titre, preheader, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titre}</title>
</head>
<body style="margin:0;padding:0;background:${COLOR_BG};font-family:Georgia,'Times New Roman',serif;color:${COLOR_TEXT};">
<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR_BG};padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #ece6d8;">
      <tr><td style="padding:32px 40px 16px;text-align:center;border-bottom:1px solid #ece6d8;">
        <img src="${LOGO_URL}" alt="Conserverie Jean de Luz" style="max-width:180px;height:auto;">
      </td></tr>
      <tr><td style="padding:32px 40px;font-size:16px;line-height:1.6;">
        ${bodyHtml}
      </td></tr>
      <tr><td style="padding:24px 40px;background:#f5f0e3;font-size:12px;color:${COLOR_MUTED};text-align:center;border-top:1px solid #ece6d8;">
        Conserverie Jean de Luz &middot; <a href="${SHOP_URL}" style="color:${COLOR_PRIMARY};">jeandeluz.com</a><br>
        Vous recevez cet email parce que vous avez commencé une commande sur notre boutique.
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function ctaButton(label, url) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
    <tr><td style="background:${COLOR_CTA};border-radius:2px;">
      <a href="${url}" style="display:inline-block;padding:14px 32px;color:#fff;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;letter-spacing:1px;text-transform:uppercase;">${label}</a>
    </td></tr>
  </table>`;
}

function listeProduits(produits) {
  if (!produits.length) return "";
  return `<ul style="padding-left:20px;margin:16px 0;color:${COLOR_TEXT};">
    ${produits.map((p) => `<li style="margin:6px 0;">${p}</li>`).join("")}
  </ul>`;
}

function templateFranco({ prenom, total, produits, recoverUrl }) {
  const manque = FRANCO_A - total;
  const subject = manque > 0
    ? `Plus que ${formatMontant(manque)} pour la livraison offerte`
    : `Votre panier vous attend — livraison offerte`;
  const greeting = prenom ? `Bonjour ${prenom},` : `Bonjour,`;
  const offerLine = manque > 0
    ? `<p style="font-size:18px;color:${COLOR_PRIMARY};"><strong>Il vous manque seulement ${formatMontant(manque)}</strong> pour bénéficier de la <strong>livraison offerte à partir de ${FRANCO_A}€</strong>.</p>`
    : `<p style="font-size:18px;color:${COLOR_PRIMARY};"><strong>Votre panier dépasse ${FRANCO_A}€</strong> — la <strong>livraison est offerte</strong> ! Il ne vous reste plus qu'à finaliser.</p>`;

  const bodyHtml = `
    <p>${greeting}</p>
    <p>Vous avez commencé une commande sur notre boutique mais ne l'avez pas finalisée. Votre panier est toujours disponible :</p>
    ${listeProduits(produits)}
    <p style="color:${COLOR_MUTED};">Total : <strong style="color:${COLOR_TEXT};">${formatMontant(total)}</strong></p>
    ${offerLine}
    ${ctaButton("Reprendre ma commande", recoverUrl)}
    <p style="font-size:14px;color:${COLOR_MUTED};">À très bientôt,<br>L'équipe de la Conserverie Jean de Luz</p>
  `;

  return {
    subject,
    html: emailLayout({ titre: subject, preheader: subject, bodyHtml }),
  };
}

function templateTerrine({ prenom, total, produits, recoverUrl }) {
  const subject = `Votre cadeau vous attend — choisissez votre terrine offerte`;
  const greeting = prenom ? `Bonjour ${prenom},` : `Bonjour,`;

  const bodyHtml = `
    <p>${greeting}</p>
    <p>Vous avez commencé une commande sur notre boutique mais ne l'avez pas encore finalisée. Votre panier vous attend :</p>
    ${listeProduits(produits)}
    <p style="color:${COLOR_MUTED};">Total : <strong style="color:${COLOR_TEXT};">${formatMontant(total)}</strong></p>
    <div style="background:#f5f0e3;border-left:3px solid ${COLOR_ACCENT};padding:20px 24px;margin:24px 0;">
      <p style="margin:0 0 8px;font-size:18px;color:${COLOR_PRIMARY};"><strong>🎁 Pour vous remercier, une terrine offerte au choix</strong></p>
      <p style="margin:0;color:${COLOR_TEXT};">Sardines, maquereaux ou thon — à l'ail, aux tomates ou aux oignons. Ajoutez votre terrine choisie à votre panier (5,20€), elle sera <strong>déduite de votre commande</strong>.</p>
    </div>
    ${ctaButton("Choisir ma terrine offerte", TERRINE_URL)}
    ${ctaButton("Reprendre ma commande", recoverUrl)}
    <p style="font-size:14px;color:${COLOR_MUTED};">À très bientôt,<br>L'équipe de la Conserverie Jean de Luz</p>
  `;

  return {
    subject,
    html: emailLayout({ titre: subject, preheader: "Votre cadeau vous attend chez la Conserverie", bodyHtml }),
  };
}

// ---------------------------------------------------------------------------

function buildEntry(c) {
  const total = parseFloat(c.totalPriceSet.shopMoney.amount);
  const produits = c.lineItems.edges.map((li) => {
    const node = li.node;
    const titre = node.product?.title || node.title || "Produit";
    return node.quantity > 1 ? `${titre} × ${node.quantity}` : titre;
  });
  const entry = {
    id: c.id,
    date: c.createdAt,
    total,
    email: c.customer?.email,
    prenom: c.customer?.firstName || "",
    nom: c.customer?.lastName || "",
    url: c.abandonedCheckoutUrl,
    produits,
    type: total < SEUIL_FRANCO ? "franco" : "terrine",
  };
  const tplFn = entry.type === "franco" ? templateFranco : templateTerrine;
  const tpl = tplFn({ prenom: entry.prenom, total, produits, recoverUrl: entry.url });
  entry.subject = tpl.subject;
  entry.html = tpl.html;
  return entry;
}

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error("GMAIL_USER ou GMAIL_APP_PASSWORD manquant dans .env");
  }
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

async function sendEmail(transporter, { to, subject, html }) {
  const fromName = process.env.GMAIL_FROM_NAME || "Conserverie Jean de Luz";
  const fromAddr = process.env.GMAIL_USER;
  return transporter.sendMail({
    from: `"${fromName}" <${fromAddr}>`,
    to,
    subject,
    html,
  });
}

function flag(args, name) {
  return args.includes(name);
}
function flagValue(args, name) {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
}

async function main() {
  const args = process.argv.slice(2);
  const days = parseInt(flagValue(args, "--days") || "1", 10);
  const minHours = parseInt(flagValue(args, "--min-hours") || "2", 10);
  const filterEmail = flagValue(args, "--email")?.toLowerCase() || null;
  const redirectTo = flagValue(args, "--redirect-to") || null;
  const doSend = flag(args, "--send");
  const doPreview = flag(args, "--preview");
  const force = flag(args, "--force");

  const now = new Date();
  const maxAge = new Date(now);
  maxAge.setDate(maxAge.getDate() - days);
  const minAge = new Date(now);
  minAge.setHours(minAge.getHours() - minHours);

  console.log(filterEmail
    ? `🔍 Recherche du panier pour ${filterEmail}...`
    : `🔍 Récupération des paniers abandonnés (entre ${minHours}h et ${days}j)...`);
  if (doSend) console.log(`✉️  Mode ENVOI réel${redirectTo ? ` (redirigé vers ${redirectTo})` : ""}.`);
  else console.log(`📋 Mode DRY-RUN (aucun email envoyé).`);
  console.log("");

  const data = shopifyGraphQL(QUERY);
  const checkouts = data.abandonedCheckouts.edges
    .map((e) => e.node)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const entries = [];
  const seen = new Set();
  for (const c of checkouts) {
    const email = c.customer?.email;
    if (!email || seen.has(email)) continue;
    if (filterEmail && email !== filterEmail) continue;
    const createdAt = new Date(c.createdAt);
    if (createdAt < maxAge || createdAt > minAge) continue;
    seen.add(email);
    entries.push(buildEntry(c));
  }

  const sousSeuil = entries.filter((e) => e.type === "franco");
  const auDessus = entries.filter((e) => e.type === "terrine");

  console.log(`📊 ${entries.length} panier(s) éligible(s) — ${sousSeuil.length} < ${SEUIL_FRANCO}€, ${auDessus.length} ≥ ${SEUIL_FRANCO}€\n`);

  for (const p of entries) {
    console.log(`📧 ${p.email} (${p.prenom} ${p.nom})`);
    console.log(`   Type      : ${p.type === "franco" ? `< ${SEUIL_FRANCO}€ → franco à ${FRANCO_A}€` : `≥ ${SEUIL_FRANCO}€ → terrine offerte`}`);
    console.log(`   Panier    : ${formatMontant(p.total)} — ${p.produits.join(", ")}`);
    console.log(`   Sujet     : ${p.subject}`);
    console.log(`   Lien      : ${p.url}`);
    console.log("");
  }

  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

  if (doPreview) {
    for (const p of entries) {
      const fname = `preview-${p.type}-${p.email.replace(/[^a-z0-9]/gi, "_")}.html`;
      const fpath = join(DATA_DIR, fname);
      writeFileSync(fpath, p.html);
      console.log(`👀 Preview : ${fpath}`);
    }
  }

  writeFileSync(REPORT_PATH, JSON.stringify({
    generatedAt: new Date().toISOString(),
    cutoffDays: days,
    minHours,
    entries: entries.map(({ html, ...rest }) => rest),
  }, null, 2));
  console.log(`📄 Rapport : ${REPORT_PATH}`);

  if (!doSend) {
    console.log(`\n⚠️  Aucun email envoyé. Ajoute --send pour envoyer réellement.`);
    return;
  }

  // ---- Envoi reel ----
  const sentLog = loadSentLog();
  const transporter = getTransporter();
  let sent = 0, skipped = 0, failed = 0;

  for (const p of entries) {
    const key = `${p.id}|${p.type}`;
    if (!force && sentLog[key]) {
      console.log(`⏭️  ${p.email} déjà relancé le ${sentLog[key].at}`);
      skipped++;
      continue;
    }
    const recipient = redirectTo || p.email;
    try {
      const info = await sendEmail(transporter, {
        to: recipient,
        subject: p.subject,
        html: p.html,
      });
      sentLog[key] = { at: new Date().toISOString(), to: recipient, originalEmail: p.email, type: p.type, messageId: info.messageId };
      saveSentLog(sentLog);
      console.log(`✅ ${p.email} → ${recipient} (${info.messageId})`);
      sent++;
    } catch (e) {
      console.error(`❌ ${p.email} : ${e.message}`);
      failed++;
    }
  }

  console.log(`\n✉️  Bilan : ${sent} envoyé(s), ${skipped} ignoré(s), ${failed} échec(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
