

import { Post } from './types';

// Augmentez ce numéro à chaque fois que vous modifiez le code pour que l'équipe puisse vérifier
export const APP_VERSION = "v2.8 (Correction p3)"; 

export const STRATEGY_HASHTAGS = [
  "#JeanDeLuz", "#PaysBasque", "#NoelBasque", "#CharcuterieBasque",
  "#JambonDeBayonne", "#Detox", "#HealthyFood", "#CircuitCourt",
  "#ProduitBio", "#Tradition", "#RecetteFestive", "#FoodBasque", "#Terroir"
];

export const ASSET_CATEGORIES = [
  { id: 'prod', label: 'Produits' },
  { id: 'food', label: 'Recettes' },
  { id: 'life', label: 'Lifestyle' },
  { id: 'brand', label: 'Marque' },
];

export const STRATEGY_POSTS: Post[] = [
  // --- WEEK 1 ---
  {
    id: 'p1', week: 1, day: 'Vendredi', date: '05/12',
    phase: 'Fêtes', theme: 'Brand', format: 'Photo',
    title: "Magie de Noël",
    caption: "Ça commence maintenant... ✨\n\nLes lumières scintillent sur le port de Saint-Jean-de-Luz. C'est le top départ d'une saison pleine de gourmandise et de partage.\n\nPrêts pour un Noël basque inoubliable ?",
    hashtags: ["#NoelBasque", "#SaintJeanDeLuz", "#MagieDeNoel"],
    cta: "Mettez un ✨ si vous avez hâte !",
    visualPrompt: "Photo de nuit du port de St Jean de Luz illuminé, ambiance chaleureuse et féerique.",
    imageUrl: "https://picsum.photos/id/132/800/800",
    published: true
  },
  {
    id: 'p2', week: 1, day: 'Dimanche', date: '07/12',
    phase: 'Fêtes', theme: 'Produit', format: 'Carousel',
    title: "Concours de Noël",
    caption: "Pour ceux qui ont du goût. 🎁\n\nDécouvrez nos coffrets cadeaux sur-mesure : l'alliance parfaite de nos produits de la mer : thon, sardines et terrines pour l’apéro...\n\nLe cadeau qui ne restera pas longtemps sous le sapin !\n\nAbonnez-vous à notre page, likez ce post et identifiez un(e) ami(e). Tirage au sort par nos soins le mercredi 10 !\n\nBonne chance 🍀",
    hashtags: ["#Concours", "#JeuConcours", "#CadeauGourmand"],
    cta: "Participez maintenant en commentaire !",
    visualPrompt: "Studio : Coffret ouvert avec produits bien disposés, ruban rouge, mise en scène festive pour concours.",
    imageUrl: "https://picsum.photos/id/225/800/800",
    published: false
  },

  // --- WEEK 2 ---
  {
    id: 'p3', week: 2, day: 'Mardi', date: '09/12',
    phase: 'Fêtes', theme: 'Recette', format: 'Reel',
    title: "Toast Ventrêche",
    caption: "L'apéro chic en 5 minutes chrono. ⏱️\n\nToast de pain de campagne grillé, fine tranche de ventrêche de thon, pointe de piment d'Espelette.\n\nSimple. Efficace. Divin.",
    hashtags: ["#RecetteApero", "#Ventreche", "#Tapas"],
    cta: "Enregistrez pour votre prochain apéro !",
    visualPrompt: "Vidéo rapide : Grillage pain, dépose ventrêche, pincée piment. Gros plan final.",
    imageUrl: "https://picsum.photos/id/425/800/1200",
    published: false
  },
  // CLIENT POST 1: Boutique Garat
  {
    id: 'c1', week: 2, day: 'Mercredi', date: '10/12',
    phase: 'Fêtes', theme: 'Lifestyle', format: 'Reel',
    title: "Ambiance Boutique",
    caption: "Bienvenue chez nous ! 🎄\n\nDécouvrez la décoration féérique de notre boutique rue Garat. Nous avons mis tout notre cœur pour vous accueillir dans une ambiance chaleureuse.",
    hashtags: ["#BoutiqueJeanDeLuz", "#RueGarat", "#DecorationNoel"],
    cta: "Passez nous voir !",
    visualPrompt: "Vidéo immersive de l'intérieur de la boutique décorée (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/445/800/1200",
    published: false,
    isClientManaged: true
  },
  {
    id: 'p4', week: 2, day: 'Jeudi', date: '11/12',
    phase: 'Fêtes', theme: 'Brand', format: 'Photo',
    title: "Noël Basque",
    caption: "Connaissez-vous Olentzero ? 🎅\n\nDans nos montagnes, c'est ce charbonnier qui descend annoncer Noël. Une tradition qui nous rappelle l'importance des racines et du partage.",
    hashtags: ["#TraditionBasque", "#Olentzero", "#Culture"],
    cta: "Et chez vous, quelle est la tradition incontournable ?",
    visualPrompt: "Illustration ou photo stylisée d'Olentzero ou ambiance village basque traditionnel.",
    imageUrl: "https://picsum.photos/id/234/800/800",
    published: false
  },
  {
    id: 'p5', week: 2, day: 'Samedi', date: '13/12',
    phase: 'Fêtes', theme: 'Lifestyle', format: 'Story',
    title: "Week-end à St Jean",
    caption: "Flânerie dans les rues piétonnes... 🛍️\n\nL'ambiance de Noël bat son plein. Passez nous voir en boutique après votre shopping !",
    hashtags: ["#ShoppingNoel", "#SaintJeanDeLuz", "#Lifestyle"],
    cta: "Venez nous faire un coucou en Story !",
    visualPrompt: "Vue rue commerçante St Jean de Luz décorée, vitrine Jean de Luz.",
    imageUrl: "https://picsum.photos/id/54/800/1200",
    published: false
  },
  // CLIENT POST 2: Salon Asphodèle
  {
    id: 'c2', week: 2, day: 'Dimanche', date: '14/12',
    phase: 'Fêtes', theme: 'Event', format: 'Carousel',
    title: "Salon Asphodèle",
    caption: "On est à Pau ! 👋\n\nRetrouvez-nous tout le week-end au salon Asphodèle. Dégustations, nouveautés et échanges gourmands au programme.",
    hashtags: ["#SalonAsphodele", "#Pau", "#Rencontre"],
    cta: "Qui vient nous voir ?",
    visualPrompt: "Photos du stand, de l'équipe et des produits sur place (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/517/800/800",
    published: false,
    isClientManaged: true
  },

  // --- WEEK 3 ---
  {
    id: 'p6', week: 3, day: 'Lundi', date: '15/12',
    phase: 'Fêtes', theme: 'Produit', format: 'Photo',
    title: "J-10 Livraison",
    caption: "⚠️ DERNIER APPEL !\n\nIl vous reste 48h pour commander sur notre e-shop et être livré avant Noël. Ne laissez pas votre table de fête sans le meilleur du Pays Basque.",
    hashtags: ["#LivraisonNoel", "#DerniereMinute", "#JeanDeLuz"],
    cta: "Lien dans la bio pour commander MAINTENANT.",
    visualPrompt: "Photo carton expédition Jean de Luz avec étiquette 'Urgent' stylisée.",
    imageUrl: "https://picsum.photos/id/119/800/800",
    published: false
  },
  {
    id: 'p7', week: 3, day: 'Mercredi', date: '17/12',
    phase: 'Fêtes', theme: 'Produit', format: 'Carousel',
    title: "Thon Huile d'Olive",
    caption: "L'indispensable de votre table. 🐟\n\nNotre Thon Blanc Germon à l'huile d'olive. Une chair tendre qui se bonifie avec le temps. À déguster tel quel ou à cuisiner.",
    hashtags: ["#ThonBlanc", "#SavoirFaire", "#Conserve"],
    cta: "Quelle est votre façon préférée de le manger ?",
    visualPrompt: "Bocal thon ouvert, belle lumière sur la texture du poisson et l'huile dorée.",
    imageUrl: "https://picsum.photos/id/352/800/800",
    published: false
  },
  {
    id: 'p8', week: 3, day: 'Vendredi', date: '19/12',
    phase: 'Fêtes', theme: 'Recette', format: 'Reel',
    title: "Rillettes Truffées",
    caption: "Pimpez vos rillettes pour les fêtes ! ✨\n\nAstuce de chef : mélangez nos rillettes de thon avec un peu de brisures de truffe et une pointe de crème. Servir frais sur toast brioché.",
    hashtags: ["#RecetteFestive", "#Truffe", "#Rillettes"],
    cta: "Qui teste ça ce week-end ?",
    visualPrompt: "Vidéo montage : mélange ingrédients, tartinage généreux, dégustation.",
    imageUrl: "https://picsum.photos/id/490/800/1200",
    published: false
  },
  {
    id: 'p9', week: 3, day: 'Dimanche', date: '21/12',
    phase: 'Fêtes', theme: 'Event', format: 'Story',
    title: "Ouverture Boutique",
    caption: "Marie-Aline vous attend au 16 rue Garat ! 👋\n\nLa boutique sera ouverte ce dimanche pour vos derniers achats de Noël. Pensez aux cadeaux gourmands.",
    hashtags: ["#OuvertureExceptionnelle", "#Cadeaux", "#RueGarat"],
    cta: "Swipe up pour l'itinéraire.",
    visualPrompt: "Photo chaleureuse de Marie-Aline devant la boutique 16 rue Garat.",
    imageUrl: "https://picsum.photos/id/514/800/1200",
    published: false
  },

  // --- WEEK 4 ---
  // CLIENT POST 3: Fermeture Atelier
  {
    id: 'c3', week: 4, day: 'Lundi', date: '22/12',
    phase: 'Fêtes', theme: 'Brand', format: 'Photo',
    title: "Fermeture Annuelle",
    caption: "L'atelier prend une pause. 🎄\n\nNos fourneaux s'éteignent pour quelques jours de repos bien mérité. Fermeture du 23/12 au 05/01 inclus.\n\nLa boutique reste ouverte pour vos achats de dernière minute !",
    hashtags: ["#Conges", "#JeanDeLuz", "#Repos"],
    cta: "Bonnes fêtes à tous !",
    visualPrompt: "Photo de l'atelier ou visuel textuel élégant 'Congés Annuels'.",
    imageUrl: "https://picsum.photos/id/160/800/800",
    published: false,
    isClientManaged: true
  },
  {
    id: 'p10', week: 4, day: 'Mardi', date: '23/12',
    phase: 'Fêtes', theme: 'Brand', format: 'Photo',
    title: "Qualité Artisanale",
    caption: "Pourquoi c'est meilleur ? 🖐️\n\nParce que chaque bocal est rempli à la main. Pas de machine, juste l'œil expert et le geste précis de nos conserveurs.",
    hashtags: ["#FaitMain", "#Artisanat", "#Qualité"],
    cta: "Likez pour soutenir l'artisanat français.",
    visualPrompt: "Gros plan noir et blanc sur des mains remplissant un bocal.",
    imageUrl: "https://picsum.photos/id/885/800/800",
    published: false
  },
  // CLIENT POST 4: Voeux Production
  {
    id: 'c4', week: 4, day: 'Mercredi', date: '24/12',
    phase: 'Fêtes', theme: 'Brand', format: 'Reel',
    title: "Le mot de l'équipe",
    caption: "Avant de partir réveillonner... ✨\n\nUn petit message de nos équipes en production qui ont œuvré toute l'année pour régaler vos tables.",
    hashtags: ["#TeamJeanDeLuz", "#Coulisses", "#JoyeuxNoel"],
    cta: "Laissez-leur un petit mot !",
    visualPrompt: "Vidéo selfie ou plan joyeux de l'équipe de prod qui souhaite bonnes fêtes (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/806/800/1200",
    published: false,
    isClientManaged: true
  },
  {
    id: 'p11', week: 4, day: 'Jeudi', date: '25/12',
    phase: 'Fêtes', theme: 'Event', format: 'Photo',
    title: "Joyeux Noël !",
    caption: "Egu Berri On ! 🎄\n\nToute l'équipe Jean de Luz vous souhaite un Noël gourmand, chaleureux et entouré de ceux que vous aimez.",
    hashtags: ["#JoyeuxNoel", "#EguBerriOn", "#Fetes"],
    cta: "Joyeux Noël à tous !",
    visualPrompt: "Visuel carte de vœux sobre et élégante avec logo Jean de Luz doré.",
    imageUrl: "https://picsum.photos/id/668/800/800",
    published: false
  },
  {
    id: 'p12', week: 4, day: 'Samedi', date: '27/12',
    phase: 'Fêtes', theme: 'Lifestyle', format: 'Carousel',
    title: "Pause Légèreté",
    caption: "Besoin de fraîcheur ? 🥗\n\nAprès les excès, place à une belle salade d'hiver avec nos sardines au citron. Léger, mais toujours gourmand.",
    hashtags: [
      "#LendemainDeFete",
      "#Detox",
      "#Salade"
    ],
    cta: "Team restes de Noël ou Team Salade ?",
    visualPrompt: "Belle assiette salade colorée, lumière naturelle, verre d'eau.",
    imageUrl: "https://picsum.photos/id/856/800/800",
    published: false
  },

  // --- WEEK 5 ---
  {
    id: 'p13', week: 5, day: 'Lundi', date: '29/12',
    phase: 'Fêtes', theme: 'Recette', format: 'Reel',
    title: "Tapas du 31",
    caption: "Pour le réveillon, on fait simple et chic. ✨\n\nPintxos variés avec nos tartinables. Prêts en 10 minutes, dévorés en 2.",
    hashtags: [
      "#Reveillon",
      "#Pintxos",
      "#AperoDinatoire"
    ],
    "cta": "Votre indispensable apéro du 31 ?",
    "visualPrompt": "Succession rapide de différents toasts sur une planche ardoise.",
    "imageUrl": "https://picsum.photos/id/365/800/1200",
    "published": false
  },
  // CLIENT POST 5: Bilan Année
  {
    id: 'c5', week: 5, day: 'Mardi', date: '30/12',
    phase: 'Fêtes', theme: 'Brand', format: 'Carousel',
    title: "Rétrospective 2025",
    caption: "Quelle année ! 🎉\n\nDes milliers de bocaux, de belles rencontres gourmandes, des salons inoubliables... Merci d'être à nos côtés.",
    hashtags: ["#Bilan2025", "#Merci", "#Aventure"],
    cta: "Votre meilleur souvenir avec nous ?",
    visualPrompt: "Carrousel photos marquantes de l'année (salons, équipe, nouveautés) (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/509/800/800",
    "published": false,
    "isClientManaged": true
  },
  {
    id: 'p14', week: 5, day: 'Mercredi', date: '31/12',
    phase: 'Fêtes', theme: 'Event', format: 'Photo',
    title: "Bon Réveillon",
    caption: "Prêts pour 2026 ? 🥂\n\nOn vous souhaite une excellente soirée de réveillon. Profitez, savourez, partagez.",
    hashtags: ["#Reveillon2025", "#BonneAnnee", "#Party"],
    cta: "À l'année prochaine !",
    visualPrompt: "Photo floue artistique feux d'artifice ou verres qui trinquent.",
    imageUrl: "https://picsum.photos/id/768/800/800",
    "published": false
  },
  {
    id: 'p15', week: 5, day: 'Vendredi', date: '02/01',
    phase: 'Détox', theme: 'Event', format: 'Photo',
    title: "Bonne Année 2026",
    caption: "Urte Berri On ! ✨\n\nSanté, bonheur et beaucoup de gourmandise pour cette nouvelle année. Nous avons hâte de continuer l'aventure avec vous.",
    hashtags: ["#BonneAnnee2026", "#Voeux", "#JeanDeLuz"],
    cta: "Votre résolution gourmande ?",
    visualPrompt: "Photo épurée, texte 2026 écrit dans le sable ou design minimaliste.",
    imageUrl: "https://picsum.photos/id/845/800/800",
    "published": false
  },
  {
    id: 'p16', week: 5, day: 'Dimanche', date: '04/01',
    phase: 'Détox', theme: 'Lifestyle', format: 'Carousel',
    title: "Objectif Détox",
    caption: "Le saviez-vous ? 🐟\n\nLe maquereau est l'un des poissons les plus riches en Oméga-3. L'allié parfait pour reprendre des forces après les fêtes.",
    hashtags: ["#Omega3", "#Sante", "#BienManger"],
    cta: "Enregistrez ce post mémo santé.",
    visualPrompt: "Infographie propre sur les bienfaits du maquereau, fond clair.",
    imageUrl: "https://picsum.photos/id/896/800/800",
    "published": false
  },

  // --- WEEK 6 ---
  {
    id: 'p17', week: 6, day: 'Mardi', date: '06/01',
    phase: 'Détox', theme: 'Produit', format: 'Photo',
    title: "Maquereau Citron",
    caption: "Le plein de vitamines ! 🍋\n\nNos filets de maquereaux au citron et aromates. Une recette fraîcheur, garantie sans alcool, pour un déjeuner sain et savoureux.\n\nAccompagné de pommes vapeur, c'est l'équilibre parfait.",
    hashtags: ["#Maquereau", "#SansAlcool", "#Detox", "#Healthy"],
    cta: "Ça vous tente pour ce midi ?",
    visualPrompt: "Assiette fraîcheur, maquereaux, tranches de citron, herbes fraîches.",
    imageUrl: "https://picsum.photos/id/401/800/800",
    "published": false
  },
  {
    id: 'p18', week: 6, day: 'Jeudi', date: '08/01',
    phase: 'Détox', theme: 'Recette', format: 'Reel',
    title: "Winter Bowl",
    caption: "Le plein de couleurs ! 🌈\n\nRiz complet, courge rôtie, avocat et notre thon émietté. Le 'Winter Bowl' qui réchauffe et fait du bien.",
    hashtags: [
      "#Bowl",
      "#HealthyRecipe",
      "#Hiver"
    ],
    "cta": "Taggez votre binôme healthy.",
    "visualPrompt": "Vidéo assemblage du bowl vue de dessus.",
    "imageUrl": "https://picsum.photos/id/488/800/1200",
    "published": false
  },
  {
    "id": 'p19', week: 6, day: 'Samedi', date: '10/01',
    phase: 'Détox', theme: 'Lifestyle', format: 'Photo',
    title: "Grand Air",
    caption: "Respirer. 🌊\n\nRien de tel qu'une balade sur la plage d'hiver pour s'oxygéner. Le Pays Basque est aussi beau sous les nuages.",
    hashtags: [
      "#PaysBasque",
      "#Ocean",
      "#Nature"
    ],
    "cta": "Vous êtes plutôt balade mer ou montagne ?",
    "visualPrompt": "Paysage plage désierte en hiver, vagues, ciel dramatique.",
    "imageUrl": "https://picsum.photos/id/973/800/800",
    "published": false
  },
  {
    "id": 'p20', week: 7, day: 'Lundi', date: '12/01',
    phase: 'Détox', theme: 'Brand', format: 'Carousel',
    title: "Le Geste Précis",
    caption: "L'art de la mise en boîte. 🥫\n\nChaque poisson est coupé et emboîté à la main pour garantir une présentation parfaite et une texture préservée. Un savoir-faire rare.",
    hashtags: [
      "#SavoirFaire",
      "#Coulisses",
      "#Tradition"
    ],
    "cta": "Swipez pour voir les étapes.",
    "visualPrompt": "Série photo atelier : découpe, mise en boite, sertissage.",
    "imageUrl": "https://picsum.photos/id/114/800/800",
    "published": false
  },
  {
    "id": 'c6', week: 7, day: 'Mardi', date: '13/01',
    phase: 'Détox', theme: 'Lifestyle', format: 'Reel',
    title: "Retour de Pêche",
    caption: "En direct du port ! ⚓️\n\nCe matin, la pêche à la sardine a été bonne. C'est ça aussi Jean de Luz : être au plus près des bateaux pour garantir une fraîcheur absolue.",
    hashtags: [
      "#PortDeSaintJeanDeLuz",
      "#PecheLocale",
      "#Sardine"
    ],
    "cta": "Vous aimez voir les coulisses ?",
    "visualPrompt": "Vidéo smartphone prise le matin même sur le port, ambiance authentique (A FAIRE PAR L'ÉQUIPE).",
    "imageUrl": "https://picsum.photos/id/196/800/1200",
    "published": false,
    "isClientManaged": true
  },
  {
    "id": 'p21', week: 7, day: 'Mercredi', date: '14/01',
    phase: 'Détox', theme: 'Produit', format: 'Photo',
    title: "Soupe de Poisson",
    caption: "Réconfort immédiat. 🥣\n\nNotre soupe de poisson aux légumes bio, à diluer. On ne vous vend pas de l’eau mais un concentré de poisson et de légumes. Vous ajoutez l’eau jusqu’à obtention de votre consistance préférée.\n\nRiche et intense, quelques croûtons, un peu de rouille... Le bonheur.",
    hashtags: [
      "#Soupe",
      "#ComfortFood",
      "#Bio",
      "#SansEauAjoutee"
    ],
    "cta": "Avec ou sans fromage râpé ?",
    "visualPrompt": "Bol de soupe fumant, ambiance cosy, cuillère en bois.",
    "imageUrl": "https://picsum.photos/id/758/800/800",
    "published": false
  },
  {
    "id": 'p22', week: 7, day: 'Vendredi', date: '16/01',
    phase: 'Détox', theme: 'Recette', format: 'Reel',
    title: "Quiche Hivernale",
    caption: "Quiche Poireaux & Sardines. 🥧\n\nChangez de la quiche lorraine ! L'association poireaux fondants et sardines est juste incroyable.",
    hashtags: [
      "#RecetteOriginale",
      "#Quiche",
      "#Sardine"
    ],
    "cta": "La recette est en description !",
    "visualPrompt": "Sortie de four de la quiche dorée, découpe d'une part.",
    "imageUrl": "https://picsum.photos/id/95/800/1200",
    "published": false
  },
  {
    "id": 'p23', week: 7, day: 'Dimanche', date: '18/01',
    phase: 'Détox', theme: 'Event', format: 'Story',
    title: "Vos Photos",
    caption: "Merci ❤️\n\nOn adore voir nos produits sur vos tables de fêtes ! Merci pour vos partages.",
    hashtags: [
      "#JeanDeLuzEtVous",
      "#UGC",
      "#Merci"
    ],
    "cta": "Continuez à nous identifier !",
    "visualPrompt": "Montage style collage de photos clients (fictives).",
    "imageUrl": "https://picsum.photos/id/338/800/1200",
    "published": false
  },
  {
    "id": 'p24', week: 8, day: 'Mardi', date: '20/01',
    phase: 'Détox', theme: 'Produit', format: 'Photo',
    title: "Sardine Millésime",
    caption: "Comme un bon vin. 🍷\n\nNos sardines millésimées se bonifient avec le temps. L'huile confit l'arête centrale qui devient fondante. À conserver... ou à craquer !",
    hashtags: [
      "#Millesime",
      "#Sardine",
      "#Collection"
    ],
    "cta": "Combien de temps tenez-vous avant d'ouvrir la boîte ?",
    "visualPrompt": "Belle photo packshot sardine millésimée avec date visible.",
    "imageUrl": "https://picsum.photos/id/616/800/800",
    "published": false
  },
  {
    "id": 'p25', week: 8, day: 'Jeudi', date: '22/01',
    phase: 'Détox', theme: 'Brand', format: 'Photo',
    title: "Depuis 19XX",
    caption: "Un peu d'histoire... 🕰️\n\nRetour sur les quais de Saint-Jean-de-Luz dans les années 50. Les bateaux, la criée, l'effervescence. L'âme de notre maison vient d'ici.",
    hashtags: [
      "#Histoire",
      "#Patrimoine",
      "#Vintage"
    ],
    "cta": "Aimez-vous ces photos d'époque ?",
    "visualPrompt": "Photo d'archive noir et blanc du port ou de la conserverie.",
    "imageUrl": "https://picsum.photos/id/106/800/800",
    "published": false
  },
  {
    "id": 'p26', week: 8, day: 'Samedi', date: '24/01',
    phase: 'Détox', theme: 'Recette', format: 'Photo',
    title: "Sandwich Gourmet",
    caption: "Lunchbox de luxe. 🥪\n\nPain ciabatta, thon, roquette, tomates séchées et pesto. Le sandwich qui fait des jaloux au bureau.",
    hashtags: [
      "#Lunchbox",
      "#Sandwich",
      "#Miam"
    ],
    "cta": "On échange de repas ?",
    "visualPrompt": "Sandwich coupé en deux, ingrédients bien visibles et appétissants.",
    "imageUrl": "https://picsum.photos/id/788/800/800",
    "published": false
  },
  {
    "id": 'p27', week: 9, day: 'Lundi', date: '26/01',
    phase: 'Détox', theme: 'Lifestyle', format: 'Carousel',
    title: "Blue Ocean",
    caption: "Inspiration Bleu & Argent. 🌊\n\nLes couleurs de nos poissons, les reflets de l'océan... Une palette naturelle qui nous inspire chaque jour.",
    hashtags: [
      "#Moodboard",
      "#Inspiration",
      "#Bleu"
    ],
    "cta": "Quelle est votre couleur préférée ?",
    "visualPrompt": "Moodboard esthétique : écailles, eau, ciel, métal.",
    "imageUrl": "https://picsum.photos/id/296/800/800",
    "published": false
  },
  {
    "id": 'p28', week: 9, day: 'Mercredi', date: '28/01',
    phase: 'Détox', theme: 'Produit', format: 'Photo',
    title: "Thon Piment",
    caption: "Ça pique (un peu) ! 🌶️\n\nThon à l'huile d'olive vierge extra et au piment d’Espelette bio. Juste ce qu'il faut pour réveiller les papilles.",
    hashtags: [
      "#Piment",
      "#Spicy",
      "#Saveur",
      "#Espelette",
      "#HuileOlive"
    ],
    "cta": "Niveau piment : 1 (doux) ou 10 (volcan) ?",
    "visualPrompt": "Bocal avec piment rouge bien visible à l'intérieur.",
    "imageUrl": "https://picsum.photos/id/368/800/800",
    "published": false
  },
  {
    "id": 'p29', week: 9, day: 'Vendredi', date: '30/01',
    phase: 'Détox', theme: 'Brand', format: 'Photo',
    title: "Circuit Court",
    caption: "De l'océan à la boîte. 📍\n\nNous travaillons en direct avec la criée de Saint-Jean-de-Luz. Pas d'intermédiaire, une fraîcheur absolue.",
    hashtags: [
      "#Local",
      "#PecheDurable",
      "#Transparence"
    ],
    "cta": "Soutenez la pêche locale !",
    "visualPrompt": "Photo caisses de poissons frais débarqués au port.",
    "imageUrl": "https://picsum.photos/id/551/800/800",
    "published": false
  },
  {
    "id": 'p30', week: 9, day: 'Samedi', date: '31/01',
    phase: 'Détox', theme: 'Event', format: 'Story',
    title: "Bilan Janvier",
    "caption": "Au revoir Janvier ! 👋\n\nUn mois sous le signe de la légèreté et du bien-être. Quel a été votre produit favori ce mois-ci ?",
    "hashtags": [
      "#Bilan",
      "#Community",
      "#JeanDeLuz"
    ],
    "cta": "Répondez au sondage !",
    "visualPrompt": "Visuel graphique récapitulatif mois janvier.",
    "imageUrl": "https://picsum.photos/id/1057/800/1200",
    "published": false
  }
];