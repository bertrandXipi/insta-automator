

import { Post } from './types';

// Augmentez ce numéro à chaque fois que vous modifiez le code pour que l'équipe puisse vérifier
export const APP_VERSION = "v3.0 (CI/CD Test)"; 

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
  },

  // ============================================
  // FÉVRIER 2026 - Phase Printemps
  // ============================================

  // --- WEEK 10 (01/02 - 08/02) ---
  {
    id: 'p30b', week: 10, day: 'Dimanche', date: '01/02',
    phase: 'Printemps', theme: 'Event', format: 'Photo',
    title: "🎁 Code INSTA10 -10%",
    caption: "🎁 EXCLUSIF INSTAGRAM\n\n-10% sur toute la boutique avec le code INSTA10\n\nValable tout le mois de février !\nC'est notre façon de vous remercier de nous suivre ici. ❤️\n\n→ Lien en bio pour en profiter",
    hashtags: ["#CodePromo", "#Exclusif", "#JeanDeLuz", "#Fevrier", "#Reduction"],
    cta: "Enregistrez ce post pour ne pas oublier !",
    visualPrompt: "Visuel graphique avec le code INSTA10 bien visible en grand, produits phares en fond, ambiance festive.",
    imageUrl: "https://picsum.photos/id/1060/800/800",
    published: false
  },
  {
    id: 'p31', week: 10, day: 'Lundi', date: '02/02',
    phase: 'Printemps', theme: 'Produit', format: 'Photo',
    title: "Rillettes de Thon",
    caption: "Le petit-déj' des champions. 🥖\n\nNos rillettes de thon sur une tartine de pain frais...\nLe combo parfait pour bien démarrer la semaine.\n\n💡 Code INSTA10 = -10% tout février",
    hashtags: ["#Rillettes", "#Thon", "#PetitDej", "#JeanDeLuz", "#CodePromo"],
    cta: "Vous êtes plutôt tartine salée ou sucrée ?",
    visualPrompt: "Bocal ouvert au premier plan, tartine garnie de rillettes, lumière naturelle du matin.",
    imageUrl: "https://picsum.photos/id/1001/800/800",
    published: false
  },
  {
    id: 'p32', week: 10, day: 'Mercredi', date: '04/02',
    phase: 'Printemps', theme: 'Recette', format: 'Reel',
    title: "Tartine Express 30s",
    caption: "30 secondes chrono. ⏱️\n\nLa tartine parfaite pour l'apéro ou le lunch.\nPas besoin d'être chef pour se régaler !\n\n💡 -10% avec INSTA10",
    hashtags: ["#RecetteFacile", "#Apero", "#TartineGourmande", "#Reel", "#JeanDeLuz"],
    cta: "Enregistrez pour votre prochain apéro !",
    visualPrompt: "Vidéo POV : pain qui grille → ouverture bocal → tartinage → ajout roquette + citron → croque final.",
    imageUrl: "https://picsum.photos/id/1002/800/1200",
    published: false
  },
  {
    id: 'c7', week: 10, day: 'Vendredi', date: '06/02',
    phase: 'Printemps', theme: 'Lifestyle', format: 'Reel',
    title: "[CLIENT] Coulisses Atelier",
    caption: "Contenu à fournir par l'équipe. 📝\n\nFilmer la préparation des commandes, ambiance travail.",
    hashtags: ["#JeanDeLuz", "#Coulisses", "#Atelier"],
    cta: "Vous aimez voir les coulisses ?",
    visualPrompt: "Vidéo smartphone de l'atelier (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/1003/800/1200",
    published: false,
    isClientManaged: true
  },

  // --- WEEK 11 (09/02 - 15/02) ---
  {
    id: 'p33', week: 11, day: 'Mardi', date: '10/02',
    phase: 'Printemps', theme: 'Brand', format: 'Carousel',
    title: "Notre Engagement Qualité",
    caption: "Notre promesse. 🤝\n\nChaque bocal raconte une histoire :\n→ Des pêcheurs locaux\n→ Une sélection exigeante\n→ Un savoir-faire artisanal\n\nPas de compromis sur la qualité.\n\n💡 -10% avec INSTA10 tout février",
    hashtags: ["#SavoirFaire", "#Artisanat", "#PecheLocale", "#Qualite", "#JeanDeLuz"],
    cta: "Swipez pour découvrir notre processus",
    visualPrompt: "Carousel 4 slides : 1) Titre 2) Bateau pêche 3) Criée sélection 4) Atelier transformation + code promo.",
    imageUrl: "https://picsum.photos/id/1004/800/800",
    published: false
  },
  {
    id: 'p34', week: 11, day: 'Jeudi', date: '12/02',
    phase: 'Printemps', theme: 'Produit', format: 'Photo',
    title: "Sardines à l'Huile d'Olive",
    caption: "L'or de la mer. ✨\n\nNos sardines à l'huile d'olive vierge extra.\nPêchées, préparées et emboîtées à la main.\n\nChaque boîte est une petite œuvre d'art.\n\n💡 Code INSTA10 = -10%",
    hashtags: ["#Sardines", "#HuileOlive", "#Conserve", "#Artisanal", "#JeanDeLuz"],
    cta: "Vous les préférez nature ou avec du citron ?",
    visualPrompt: "Boîte ouverte, sardines parfaitement alignées, huile brillante, lumière naturelle.",
    imageUrl: "https://picsum.photos/id/1005/800/800",
    published: false
  },
  {
    id: 'p35', week: 11, day: 'Samedi', date: '14/02',
    phase: 'Printemps', theme: 'Event', format: 'Photo',
    title: "Saint-Valentin ❤️",
    caption: "L'amour passe par l'estomac. ❤️\n\nNotre coffret 'Apéro en Amoureux' :\n→ Rillettes de thon\n→ Sardines millésimées\n→ Terrine de la mer\n\n🎁 -10% avec INSTA10 jusqu'à fin février !\n\nLe cadeau parfait pour les gourmands.\nLien en bio 💝",
    hashtags: ["#SaintValentin", "#CadeauGourmand", "#Amour", "#Coffret", "#JeanDeLuz"],
    cta: "Identifiez votre moitié !",
    visualPrompt: "Coffret ouvert, 2 verres de vin, ambiance romantique, bougies.",
    imageUrl: "https://picsum.photos/id/1006/800/800",
    published: false
  },

  // --- WEEK 12 (16/02 - 22/02) ---
  {
    id: 'p36', week: 12, day: 'Lundi', date: '16/02',
    phase: 'Printemps', theme: 'Recette', format: 'Reel',
    title: "Salade Tiède Sardines",
    caption: "Healthy mais gourmand. 🥗\n\nSalade tiède aux sardines :\n- Sardines poêlées 2 min\n- Mesclun frais\n- Vinaigrette citron-moutarde\n\nPrêt en 5 minutes, 0 culpabilité.\n\n💡 -10% avec INSTA10",
    hashtags: ["#RecetteHealthy", "#Salade", "#Sardines", "#HealthyFood", "#JeanDeLuz"],
    cta: "La recette complète en bio !",
    visualPrompt: "Vidéo : sardines dans poêle → salade dans assiette → sardines posées → vinaigrette → dégustation.",
    imageUrl: "https://picsum.photos/id/1008/800/1200",
    published: false
  },
  {
    id: 'c8', week: 12, day: 'Mercredi', date: '18/02',
    phase: 'Printemps', theme: 'Brand', format: 'Photo',
    title: "[CLIENT] L'Équipe",
    caption: "Contenu à fournir par l'équipe. 📝\n\nPortrait équipe ou artisan au travail.",
    hashtags: ["#JeanDeLuz", "#Equipe", "#Artisan"],
    cta: "Merci à notre équipe !",
    visualPrompt: "Photo équipe ou portrait artisan (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/1009/800/800",
    published: false,
    isClientManaged: true
  },
  {
    id: 'p37', week: 12, day: 'Vendredi', date: '20/02',
    phase: 'Printemps', theme: 'Lifestyle', format: 'Photo',
    title: "Pause Déjeuner Vue Mer",
    caption: "La pause déj' parfaite. 🌊\n\nQuand le soleil d'hiver réchauffe la terrasse...\nUn bocal, du bon pain, et l'océan en fond.\n\nC'est ça, la vie au Pays Basque.\n\n💡 Profitez de -10% avec INSTA10",
    hashtags: ["#PaysBasque", "#PauseDej", "#Ocean", "#Lifestyle", "#JeanDeLuz"],
    cta: "Où prenez-vous votre pause préférée ?",
    visualPrompt: "Table en terrasse, produits Jean de Luz, vue mer en arrière-plan, soleil.",
    imageUrl: "https://picsum.photos/id/1010/800/800",
    published: false
  },

  // --- WEEK 13 (23/02 - 01/03) ---
  {
    id: 'p38', week: 13, day: 'Mardi', date: '24/02',
    phase: 'Printemps', theme: 'Produit', format: 'Carousel',
    title: "Gamme Terrines",
    caption: "Une terrine pour chaque occasion. 🍽️\n\nApéro improvisé ? Pique-nique ? Entrée chic ?\nNos terrines s'adaptent à tous vos moments.\n\n⏰ Plus que quelques jours pour profiter de -10% avec INSTA10 !\n\nDécouvrez la gamme complète en bio.",
    hashtags: ["#Terrine", "#Apero", "#Gourmandise", "#Gamme", "#JeanDeLuz"],
    cta: "Votez pour votre préférée en commentaire !",
    visualPrompt: "Carousel 5 slides : 1) Titre 2-4) Chaque terrine avec accord 5) CTA + code promo.",
    imageUrl: "https://picsum.photos/id/1011/800/800",
    published: false
  },
  {
    id: 'p39', week: 13, day: 'Jeudi', date: '26/02',
    phase: 'Printemps', theme: 'Recette', format: 'Photo',
    title: "Bruschetta Anchois",
    caption: "La bruschetta qui fait voyager. 🇮🇹\n\nPain grillé + tomates cerises + anchois + basilic.\nUn classique méditerranéen revisité avec nos anchois.\n\nPrêt en 5 minutes.\n\n💡 Dernier week-end pour INSTA10 = -10% !",
    hashtags: ["#Bruschetta", "#Anchois", "#Recette", "#Mediterranee", "#JeanDeLuz"],
    cta: "Enregistrez cette recette !",
    visualPrompt: "Vue de dessus, 3 bruschettas garnies, couleurs vives, basilic frais.",
    imageUrl: "https://picsum.photos/id/1012/800/800",
    published: false
  },
  {
    id: 'c9', week: 13, day: 'Samedi', date: '28/02',
    phase: 'Printemps', theme: 'Event', format: 'Story',
    title: "[CLIENT] Dernier Jour INSTA10 !",
    caption: "⏰ DERNIER JOUR !\n\nLe code INSTA10 expire ce soir à minuit.\n-10% sur toute la boutique.\n\nC'est maintenant ou jamais !",
    hashtags: ["#DernierJour", "#CodePromo", "#INSTA10", "#JeanDeLuz"],
    cta: "Foncez !",
    visualPrompt: "Story urgence : compte à rebours, code bien visible (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/1013/800/1200",
    published: false,
    isClientManaged: true
  },

  // ============================================
  // MARS 2026 - Phase Printemps
  // ============================================

  // --- WEEK 14 (02/03 - 08/03) ---
  {
    id: 'p40', week: 14, day: 'Lundi', date: '02/03',
    phase: 'Printemps', theme: 'Produit', format: 'Photo',
    title: "Thon Germon",
    caption: "Le roi de nos bocaux. 👑\n\nNotre thon germon à l'huile d'olive.\nChair ferme, goût délicat, qualité premium.\n\nLe produit que nos clients rachètent encore et encore.",
    hashtags: ["#Thon", "#Germon", "#Premium", "#JeanDeLuz", "#PaysBasque"],
    cta: "L'avez-vous déjà goûté ?",
    visualPrompt: "Bocal ouvert, morceaux de thon visibles, texture appétissante, lumière naturelle.",
    imageUrl: "https://picsum.photos/id/1015/800/800",
    published: false
  },
  {
    id: 'p41', week: 14, day: 'Mercredi', date: '04/03',
    phase: 'Printemps', theme: 'Recette', format: 'Reel',
    title: "Pâtes au Thon 2 min",
    caption: "Dîner en 10 minutes. ⏰\n\nPâtes + thon + tomates + basilic.\nLa recette du soir quand on a la flemme mais qu'on veut bien manger.",
    hashtags: ["#RecetteRapide", "#Pates", "#Thon", "#DinnerIdeas", "#JeanDeLuz"],
    cta: "Sauvegardez pour ce soir !",
    visualPrompt: "Vidéo ultra-rapide : pâtes qui égouttent → thon dans poêle → tomates → basilic → assiette finale → dégustation.",
    imageUrl: "https://picsum.photos/id/1016/800/1200",
    published: false
  },
  {
    id: 'c10', week: 14, day: 'Vendredi', date: '06/03',
    phase: 'Printemps', theme: 'Lifestyle', format: 'Reel',
    title: "[CLIENT] Arrivage du Jour",
    caption: "En direct du port ! ⚓️\n\nCe matin, la pêche a été bonne.\nÀ filmer par l'équipe : débarquement poisson au port.",
    hashtags: ["#JeanDeLuz", "#Port", "#PecheLocale", "#Frais"],
    cta: "Vous aimez voir les coulisses ?",
    visualPrompt: "Vidéo smartphone au port le matin, débarquement poisson (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/1018/800/1200",
    published: false,
    isClientManaged: true
  },

  // --- WEEK 15 (09/03 - 15/03) ---
  {
    id: 'p42', week: 15, day: 'Mardi', date: '10/03',
    phase: 'Printemps', theme: 'Brand', format: 'Carousel',
    title: "De la Mer à l'Assiette",
    caption: "7 heures. ⏱️\n\nC'est le temps entre la pêche et la mise en bocal.\nPas de congélation, pas d'intermédiaire.\n\nJuste la mer, nos mains, et votre table.",
    hashtags: ["#Transparence", "#CircuitCourt", "#Frais", "#Artisanal", "#JeanDeLuz"],
    cta: "Swipez pour suivre le parcours",
    visualPrompt: "Carousel 5 slides : 1) Titre sur fond océan 2) Bateau en mer 5h 3) Criée 8h 4) Atelier 10h 5) Table dressée midi.",
    imageUrl: "https://picsum.photos/id/1019/800/800",
    published: false
  },
  {
    id: 'p43', week: 15, day: 'Jeudi', date: '12/03',
    phase: 'Printemps', theme: 'Produit', format: 'Photo',
    title: "Soupe de Poisson",
    caption: "Le réconfort en bocal. 🥣\n\nNotre soupe de poisson concentrée.\nVous ajoutez l'eau, on s'occupe du goût.\n\nAvec des croûtons et de la rouille...\nLe bonheur simple.",
    hashtags: ["#Soupe", "#Poisson", "#Reconfort", "#Hiver", "#JeanDeLuz"],
    cta: "Avec ou sans fromage râpé ?",
    visualPrompt: "Bol fumant, croûtons dorés, rouille, cuillère, ambiance cosy.",
    imageUrl: "https://picsum.photos/id/1020/800/800",
    published: false
  },
  {
    id: 'p44', week: 15, day: 'Samedi', date: '14/03',
    phase: 'Printemps', theme: 'Lifestyle', format: 'Photo',
    title: "Marché de St-Jean",
    caption: "Samedi matin, rituel sacré. 🛒\n\nLe marché de Saint-Jean-de-Luz.\nLes couleurs, les odeurs, les sourires.\n\nC'est ici que tout commence.",
    hashtags: ["#Marche", "#SaintJeanDeLuz", "#Local", "#PaysBasque", "#Terroir"],
    cta: "Quel est votre marché préféré ?",
    visualPrompt: "Ambiance marché, étals colorés, foule, produits frais.",
    imageUrl: "https://picsum.photos/id/1021/800/800",
    published: false
  },

  // --- WEEK 16 (16/03 - 22/03) ---
  {
    id: 'p45', week: 16, day: 'Lundi', date: '16/03',
    phase: 'Printemps', theme: 'Recette', format: 'Reel',
    title: "Wrap Thon Avocat",
    caption: "Lunch box level 100. 🌯\n\nWrap thon-avocat :\n- Tortilla\n- Avocat écrasé\n- Thon Jean de Luz\n- Crudités\n\nHealthy, rassasiant, délicieux.",
    hashtags: ["#Wrap", "#Healthy", "#LunchBox", "#MealPrep", "#JeanDeLuz"],
    cta: "Parfait pour le bureau !",
    visualPrompt: "Vidéo assemblage : tortilla → avocat écrasé → thon émietté → crudités → roulage → coupe → dégustation.",
    imageUrl: "https://picsum.photos/id/1022/800/1200",
    published: false
  },
  {
    id: 'c11', week: 16, day: 'Mercredi', date: '18/03',
    phase: 'Printemps', theme: 'Brand', format: 'Photo',
    title: "[CLIENT] Nouveauté/Actu",
    caption: "Contenu à fournir par l'équipe. 📝\n\nNouveau produit ou actualité entreprise.",
    hashtags: ["#JeanDeLuz", "#Nouveaute", "#Actu"],
    cta: "Qu'en pensez-vous ?",
    visualPrompt: "Photo nouveau produit ou actualité (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/1023/800/800",
    published: false,
    isClientManaged: true
  },
  {
    id: 'p46', week: 16, day: 'Vendredi', date: '20/03',
    phase: 'Printemps', theme: 'Event', format: 'Photo',
    title: "Premier Jour du Printemps 🌸",
    caption: "Le printemps est là. 🌸\n\nPremier jour officiel de la belle saison.\nLa côte basque se réveille doucement.\n\nPrêts pour les apéros en terrasse ?",
    hashtags: ["#Printemps", "#Spring", "#PaysBasque", "#NouveauDepart", "#JeanDeLuz"],
    cta: "Qu'attendez-vous le plus du printemps ?",
    visualPrompt: "Côte basque ensoleillée, fleurs, renouveau, lumière douce.",
    imageUrl: "https://picsum.photos/id/1024/800/800",
    published: false
  },

  // --- WEEK 17 (23/03 - 29/03) ---
  {
    id: 'p47', week: 17, day: 'Mardi', date: '24/03',
    phase: 'Printemps', theme: 'Produit', format: 'Carousel',
    title: "Coffret Pâques 🐣",
    caption: "Pâques approche ! 🐣\n\nNotre coffret spécial pour le repas de famille :\n→ Thon germon\n→ Sardines millésimées\n→ Terrine festive\n→ Rillettes apéritives\n\nLe cadeau qui plaît à coup sûr.\nLien en bio 🎁",
    hashtags: ["#Paques", "#Coffret", "#Cadeau", "#Famille", "#JeanDeLuz"],
    cta: "Commandez avant rupture !",
    visualPrompt: "Carousel : 1) Titre festif 2) Contenu coffret détaillé 3) Idées présentation 4) CTA + lien.",
    imageUrl: "https://picsum.photos/id/1025/800/800",
    published: false
  },
  {
    id: 'p48', week: 17, day: 'Jeudi', date: '26/03',
    phase: 'Printemps', theme: 'Recette', format: 'Photo',
    title: "Œufs Mimosa Sardines",
    caption: "Œufs mimosa revisités. 🥚\n\nLa recette classique avec une twist :\nRemplacez le thon par nos sardines.\n\nRésultat ? Plus de caractère, plus de goût.",
    hashtags: ["#OeufsMimosa", "#Paques", "#Recette", "#Sardines", "#JeanDeLuz"],
    cta: "Vous testez pour Pâques ?",
    visualPrompt: "Assiette d'œufs mimosa garnis, présentation soignée, herbes fraîches.",
    imageUrl: "https://picsum.photos/id/1027/800/800",
    published: false
  },
  {
    id: 'p49', week: 17, day: 'Samedi', date: '28/03',
    phase: 'Printemps', theme: 'Brand', format: 'Photo',
    title: "Archives : Les Années 60",
    caption: "1962. 📷\n\nLes quais de Saint-Jean-de-Luz.\nLes bateaux, la criée, l'effervescence.\n\n60 ans plus tard, l'âme est la même.",
    hashtags: ["#Histoire", "#Vintage", "#Patrimoine", "#Archives", "#JeanDeLuz"],
    cta: "Aimez-vous ces photos d'époque ?",
    visualPrompt: "Photo N&B d'archive, port ou conserverie années 60, ambiance nostalgique.",
    imageUrl: "https://picsum.photos/id/1028/800/800",
    published: false
  },

  // --- WEEK 18 (30/03 - 31/03) ---
  {
    id: 'p50', week: 18, day: 'Lundi', date: '30/03',
    phase: 'Printemps', theme: 'Lifestyle', format: 'Photo',
    title: "Terrasse de Printemps",
    caption: "Les premiers rayons. ☀️\n\nQuand le soleil revient sur les terrasses...\nC'est le signal pour ressortir l'apéro.\n\nQui est prêt ?",
    hashtags: ["#Terrasse", "#Apero", "#Printemps", "#Soleil", "#JeanDeLuz"],
    cta: "Premier apéro terrasse de l'année ?",
    visualPrompt: "Table en terrasse, produits Jean de Luz, soleil couchant, ambiance conviviale.",
    imageUrl: "https://picsum.photos/id/1029/800/800",
    published: false
  },
  {
    id: 'c12', week: 18, day: 'Mardi', date: '31/03',
    phase: 'Printemps', theme: 'Event', format: 'Story',
    title: "[CLIENT] Bilan Mars",
    caption: "Au revoir Mars ! 👋\n\nRécap du mois + teaser avril.\nÀ fournir par l'équipe.",
    hashtags: ["#JeanDeLuz", "#Bilan", "#Mars", "#Recap"],
    cta: "Vivement avril !",
    visualPrompt: "Story récap du mois, remerciements, teaser avril (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/1031/800/1200",
    published: false,
    isClientManaged: true
  },

  // ============================================
  // MARS–AVRIL 2026 - Phase Printemps (à partir du 13/03)
  // ============================================

  // --- WEEK 15 (13/03 - 15/03) ---
  {
    id: 'p44', week: 15, day: 'Samedi', date: '14/03',
    phase: 'Printemps', theme: 'Lifestyle', format: 'Photo',
    title: "Marché de St-Jean",
    caption: "Samedi matin, rituel sacré. 🛒\n\nLe marché de Saint-Jean-de-Luz.\nLes couleurs, les odeurs, les sourires.\n\nC'est ici que tout commence.",
    hashtags: ["#Marche", "#SaintJeanDeLuz", "#Local", "#PaysBasque", "#Terroir"],
    cta: "Quel est votre marché préféré ?",
    visualPrompt: "Ambiance marché, étals colorés, foule, produits frais.",
    imageUrl: "https://picsum.photos/id/1021/800/800",
    published: false
  },

  // --- WEEK 16 (16/03 - 22/03) ---
  {
    id: 'p45', week: 16, day: 'Lundi', date: '16/03',
    phase: 'Printemps', theme: 'Recette', format: 'Reel',
    title: "Wrap Thon Avocat",
    caption: "Lunch box level 100. 🌯\n\nWrap thon-avocat :\n- Tortilla\n- Avocat écrasé\n- Thon Jean de Luz\n- Crudités\n\nHealthy, rassasiant, délicieux.",
    hashtags: ["#Wrap", "#Healthy", "#LunchBox", "#MealPrep", "#JeanDeLuz"],
    cta: "Parfait pour le bureau !",
    visualPrompt: "Vidéo assemblage : tortilla → avocat écrasé → thon émietté → crudités → roulage → coupe → dégustation.",
    imageUrl: "https://picsum.photos/id/1022/800/1200",
    published: false
  },
  {
    id: 'c13', week: 16, day: 'Mercredi', date: '18/03',
    phase: 'Printemps', theme: 'Brand', format: 'Photo',
    title: "[CLIENT] Nouveauté/Actu",
    caption: "Contenu à fournir par l'équipe. 📝\n\nNouveau produit ou actualité entreprise.",
    hashtags: ["#JeanDeLuz", "#Nouveaute", "#Actu"],
    cta: "Qu'en pensez-vous ?",
    visualPrompt: "Photo nouveau produit ou actualité (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/1023/800/800",
    published: false,
    isClientManaged: true
  },
  {
    id: 'p46', week: 16, day: 'Vendredi', date: '20/03',
    phase: 'Printemps', theme: 'Event', format: 'Photo',
    title: "Premier Jour du Printemps 🌸",
    caption: "Le printemps est là. 🌸\n\nPremier jour officiel de la belle saison.\nLa côte basque se réveille doucement.\n\nPrêts pour les apéros en terrasse ?",
    hashtags: ["#Printemps", "#Spring", "#PaysBasque", "#NouveauDepart", "#JeanDeLuz"],
    cta: "Qu'attendez-vous le plus du printemps ?",
    visualPrompt: "Côte basque ensoleillée, fleurs, renouveau, lumière douce.",
    imageUrl: "https://picsum.photos/id/1024/800/800",
    published: false
  },
  {
    id: 'c14', week: 16, day: 'Samedi', date: '21/03',
    phase: 'Printemps', theme: 'Lifestyle', format: 'Reel',
    title: "[CLIENT] Coulisses Atelier",
    caption: "Contenu à fournir par l'équipe. 📝\n\nFilmer la préparation des commandes, ambiance travail.",
    hashtags: ["#JeanDeLuz", "#Coulisses", "#Atelier"],
    cta: "Vous aimez voir les coulisses ?",
    visualPrompt: "Vidéo smartphone de l'atelier (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/1003/800/1200",
    published: false,
    isClientManaged: true
  },

  // --- WEEK 17 (23/03 - 29/03) ---
  {
    id: 'p36', week: 17, day: 'Lundi', date: '23/03',
    phase: 'Printemps', theme: 'Recette', format: 'Reel',
    title: "Salade Tiède Sardines",
    caption: "Healthy mais gourmand. 🥗\n\nSalade tiède aux sardines :\n- Sardines poêlées 2 min\n- Mesclun frais\n- Vinaigrette citron-moutarde\n\nPrêt en 5 minutes, 0 culpabilité.",
    hashtags: ["#RecetteHealthy", "#Salade", "#Sardines", "#HealthyFood", "#JeanDeLuz"],
    cta: "La recette complète en bio !",
    visualPrompt: "Vidéo : sardines dans poêle → salade dans assiette → sardines posées → vinaigrette → dégustation.",
    imageUrl: "https://picsum.photos/id/1008/800/1200",
    published: false
  },
  {
    id: 'c15', week: 17, day: 'Mercredi', date: '25/03',
    phase: 'Printemps', theme: 'Brand', format: 'Photo',
    title: "[CLIENT] L'Équipe",
    caption: "Contenu à fournir par l'équipe. 📝\n\nPortrait équipe ou artisan au travail.",
    hashtags: ["#JeanDeLuz", "#Equipe", "#Artisan"],
    cta: "Merci à notre équipe !",
    visualPrompt: "Photo équipe ou portrait artisan (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/1009/800/800",
    published: false,
    isClientManaged: true
  },
  {
    id: 'p42', week: 17, day: 'Jeudi', date: '26/03',
    phase: 'Printemps', theme: 'Brand', format: 'Carousel',
    title: "De la Mer à l'Assiette",
    caption: "7 heures. ⏱️\n\nC'est le temps entre la pêche et la mise en bocal.\nPas de congélation, pas d'intermédiaire.\n\nJuste la mer, nos mains, et votre table.",
    hashtags: ["#Transparence", "#CircuitCourt", "#Frais", "#Artisanal", "#JeanDeLuz"],
    cta: "Swipez pour suivre le parcours",
    visualPrompt: "Carousel 5 slides : 1) Titre sur fond océan 2) Bateau en mer 5h 3) Criée 8h 4) Atelier 10h 5) Table dressée midi.",
    imageUrl: "https://picsum.photos/id/1019/800/800",
    published: false
  },
  {
    id: 'p49', week: 17, day: 'Samedi', date: '28/03',
    phase: 'Printemps', theme: 'Brand', format: 'Photo',
    title: "Archives : Les Années 60",
    caption: "1962. 📷\n\nLes quais de Saint-Jean-de-Luz.\nLes bateaux, la criée, l'effervescence.\n\n60 ans plus tard, l'âme est la même.",
    hashtags: ["#Histoire", "#Vintage", "#Patrimoine", "#Archives", "#JeanDeLuz"],
    cta: "Aimez-vous ces photos d'époque ?",
    visualPrompt: "Photo N&B d'archive, port ou conserverie années 60, ambiance nostalgique.",
    imageUrl: "https://picsum.photos/id/1028/800/800",
    published: false
  },
  {
    id: 'c16', week: 17, day: 'Dimanche', date: '29/03',
    phase: 'Printemps', theme: 'Event', format: 'Story',
    title: "[CLIENT] Week-end Basque",
    caption: "Contenu à fournir par l'équipe. 📝\n\nPartage d'un moment week-end, ambiance locale.",
    hashtags: ["#JeanDeLuz", "#WeekEnd", "#PaysBasque"],
    cta: "Bon dimanche !",
    visualPrompt: "Story ambiance week-end, paysage ou moment convivial (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/1030/800/1200",
    published: false,
    isClientManaged: true
  },

  // --- WEEK 18 (30/03 - 05/04) ---
  {
    id: 'p40', week: 18, day: 'Lundi', date: '30/03',
    phase: 'Printemps', theme: 'Produit', format: 'Photo',
    title: "Thon Germon",
    caption: "Le roi de nos bocaux. 👑\n\nNotre thon germon à l'huile d'olive.\nChair ferme, goût délicat, qualité premium.\n\nLe produit que nos clients rachètent encore et encore.",
    hashtags: ["#Thon", "#Germon", "#Premium", "#JeanDeLuz", "#PaysBasque"],
    cta: "L'avez-vous déjà goûté ?",
    visualPrompt: "Bocal ouvert, morceaux de thon visibles, texture appétissante, lumière naturelle.",
    imageUrl: "https://picsum.photos/id/1015/800/800",
    published: false
  },
  {
    id: 'c17', week: 18, day: 'Mercredi', date: '01/04',
    phase: 'Printemps', theme: 'Lifestyle', format: 'Reel',
    title: "[CLIENT] Arrivage du Jour",
    caption: "En direct du port ! ⚓️\n\nCe matin, la pêche a été bonne.\nÀ filmer par l'équipe : débarquement poisson au port.",
    hashtags: ["#JeanDeLuz", "#Port", "#PecheLocale", "#Frais"],
    cta: "Vous aimez voir les coulisses ?",
    visualPrompt: "Vidéo smartphone au port le matin, débarquement poisson (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/1018/800/1200",
    published: false,
    isClientManaged: true
  },
  {
    id: 'p38', week: 18, day: 'Jeudi', date: '02/04',
    phase: 'Printemps', theme: 'Produit', format: 'Carousel',
    title: "Gamme Terrines",
    caption: "Une terrine pour chaque occasion. 🍽️\n\nApéro improvisé ? Pique-nique ? Entrée chic ?\nNos terrines s'adaptent à tous vos moments.\n\nDécouvrez la gamme complète en bio.",
    hashtags: ["#Terrine", "#Apero", "#Gourmandise", "#Gamme", "#JeanDeLuz"],
    cta: "Votez pour votre préférée en commentaire !",
    visualPrompt: "Carousel 5 slides : 1) Titre 2-4) Chaque terrine avec accord 5) CTA.",
    imageUrl: "https://picsum.photos/id/1011/800/800",
    published: false
  },
  {
    id: 'c18', week: 18, day: 'Samedi', date: '04/04',
    phase: 'Printemps', theme: 'Event', format: 'Story',
    title: "[CLIENT] Pâques en Préparation",
    caption: "Contenu à fournir par l'équipe. 📝\n\nPréparation des coffrets Pâques, ambiance atelier.",
    hashtags: ["#JeanDeLuz", "#Paques", "#Preparation"],
    cta: "Pâques approche !",
    visualPrompt: "Story préparation coffrets, ambiance atelier festive (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/1032/800/1200",
    published: false,
    isClientManaged: true
  },

  // --- WEEK 19 (06/04 - 12/04) ---
  {
    id: 'p47', week: 19, day: 'Mardi', date: '07/04',
    phase: 'Printemps', theme: 'Produit', format: 'Carousel',
    title: "Coffret Pâques 🐣",
    caption: "Pâques approche ! 🐣\n\nNotre coffret spécial pour le repas de famille :\n→ Thon germon\n→ Sardines millésimées\n→ Terrine festive\n→ Rillettes apéritives\n\nLe cadeau qui plaît à coup sûr.\nLien en bio 🎁",
    hashtags: ["#Paques", "#Coffret", "#Cadeau", "#Famille", "#JeanDeLuz"],
    cta: "Commandez avant rupture !",
    visualPrompt: "Carousel : 1) Titre festif 2) Contenu coffret détaillé 3) Idées présentation 4) CTA + lien.",
    imageUrl: "https://picsum.photos/id/1025/800/800",
    published: false
  },
  {
    id: 'c19', week: 19, day: 'Mercredi', date: '08/04',
    phase: 'Printemps', theme: 'Brand', format: 'Photo',
    title: "[CLIENT] Ambiance Boutique",
    caption: "Contenu à fournir par l'équipe. 📝\n\nDécoration printanière de la boutique.",
    hashtags: ["#JeanDeLuz", "#Boutique", "#Printemps"],
    cta: "Passez nous voir !",
    visualPrompt: "Photo boutique décorée pour le printemps (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/1033/800/800",
    published: false,
    isClientManaged: true
  },
  {
    id: 'p41', week: 19, day: 'Vendredi', date: '10/04',
    phase: 'Printemps', theme: 'Recette', format: 'Reel',
    title: "Pâtes au Thon 2 min",
    caption: "Dîner en 10 minutes. ⏰\n\nPâtes + thon + tomates + basilic.\nLa recette du soir quand on a la flemme mais qu'on veut bien manger.",
    hashtags: ["#RecetteRapide", "#Pates", "#Thon", "#DinnerIdeas", "#JeanDeLuz"],
    cta: "Sauvegardez pour ce soir !",
    visualPrompt: "Vidéo ultra-rapide : pâtes qui égouttent → thon dans poêle → tomates → basilic → assiette finale → dégustation.",
    imageUrl: "https://picsum.photos/id/1016/800/1200",
    published: false
  },
  {
    id: 'c20', week: 19, day: 'Samedi', date: '11/04',
    phase: 'Printemps', theme: 'Event', format: 'Story',
    title: "[CLIENT] Veille de Pâques",
    caption: "Contenu à fournir par l'équipe. 📝\n\nDernières commandes, ambiance veille de fête.",
    hashtags: ["#JeanDeLuz", "#Paques", "#DerniereMinute"],
    cta: "Joyeuses Pâques !",
    visualPrompt: "Story ambiance veille de Pâques, dernières préparations (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/1034/800/1200",
    published: false,
    isClientManaged: true
  },

  // --- WEEK 20 (13/04 - 19/04) ---
  {
    id: 'p43', week: 20, day: 'Lundi', date: '13/04',
    phase: 'Printemps', theme: 'Produit', format: 'Photo',
    title: "Soupe de Poisson",
    caption: "Le réconfort en bocal. 🥣\n\nNotre soupe de poisson concentrée.\nVous ajoutez l'eau, on s'occupe du goût.\n\nAvec des croûtons et de la rouille...\nLe bonheur simple.",
    hashtags: ["#Soupe", "#Poisson", "#Reconfort", "#Printemps", "#JeanDeLuz"],
    cta: "Avec ou sans fromage râpé ?",
    visualPrompt: "Bol fumant, croûtons dorés, rouille, cuillère, ambiance cosy.",
    imageUrl: "https://picsum.photos/id/1020/800/800",
    published: false
  },
  {
    id: 'c21', week: 20, day: 'Mercredi', date: '15/04',
    phase: 'Printemps', theme: 'Lifestyle', format: 'Reel',
    title: "[CLIENT] Retour de Pêche",
    caption: "Contenu à fournir par l'équipe. 📝\n\nFilmer le retour des bateaux au port.",
    hashtags: ["#JeanDeLuz", "#Port", "#PecheLocale"],
    cta: "Vous aimez voir les coulisses ?",
    visualPrompt: "Vidéo smartphone retour de pêche au port (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/196/800/1200",
    published: false,
    isClientManaged: true
  },
  {
    id: 'p48', week: 20, day: 'Jeudi', date: '16/04',
    phase: 'Printemps', theme: 'Recette', format: 'Photo',
    title: "Œufs Mimosa Sardines",
    caption: "Œufs mimosa revisités. 🥚\n\nLa recette classique avec une twist :\nRemplacez le thon par nos sardines.\n\nRésultat ? Plus de caractère, plus de goût.",
    hashtags: ["#OeufsMimosa", "#Recette", "#Sardines", "#JeanDeLuz"],
    cta: "Vous testez ce week-end ?",
    visualPrompt: "Assiette d'œufs mimosa garnis, présentation soignée, herbes fraîches.",
    imageUrl: "https://picsum.photos/id/1027/800/800",
    published: false
  },
  {
    id: 'c22', week: 20, day: 'Samedi', date: '18/04',
    phase: 'Printemps', theme: 'Brand', format: 'Photo',
    title: "[CLIENT] Savoir-Faire",
    caption: "Contenu à fournir par l'équipe. 📝\n\nPhoto ou vidéo d'un geste artisanal en atelier.",
    hashtags: ["#JeanDeLuz", "#SavoirFaire", "#Artisanat"],
    cta: "L'artisanat, c'est notre fierté.",
    visualPrompt: "Photo gros plan geste artisanal, mains au travail (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/1035/800/800",
    published: false,
    isClientManaged: true
  },

  // --- WEEK 21 (20/04 - 26/04) ---
  {
    id: 'p37', week: 21, day: 'Lundi', date: '20/04',
    phase: 'Printemps', theme: 'Lifestyle', format: 'Photo',
    title: "Pause Déjeuner Vue Mer",
    caption: "La pause déj' parfaite. 🌊\n\nQuand le soleil de printemps réchauffe la terrasse...\nUn bocal, du bon pain, et l'océan en fond.\n\nC'est ça, la vie au Pays Basque.",
    hashtags: ["#PaysBasque", "#PauseDej", "#Ocean", "#Lifestyle", "#JeanDeLuz"],
    cta: "Où prenez-vous votre pause préférée ?",
    visualPrompt: "Table en terrasse, produits Jean de Luz, vue mer en arrière-plan, soleil.",
    imageUrl: "https://picsum.photos/id/1010/800/800",
    published: false
  },
  {
    id: 'c23', week: 21, day: 'Mercredi', date: '22/04',
    phase: 'Printemps', theme: 'Event', format: 'Story',
    title: "[CLIENT] Journée de la Terre 🌍",
    caption: "Contenu à fournir par l'équipe. 📝\n\nEngagement éco-responsable, pêche durable.",
    hashtags: ["#JeanDeLuz", "#JourneeDeLaTerre", "#PecheDurable"],
    cta: "Notre engagement pour la planète.",
    visualPrompt: "Story engagement environnemental, pêche durable (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/1036/800/1200",
    published: false,
    isClientManaged: true
  },
  {
    id: 'p39', week: 21, day: 'Jeudi', date: '23/04',
    phase: 'Printemps', theme: 'Recette', format: 'Photo',
    title: "Bruschetta Anchois",
    caption: "La bruschetta qui fait voyager. 🇮🇹\n\nPain grillé + tomates cerises + anchois + basilic.\nUn classique méditerranéen revisité avec nos anchois.\n\nPrêt en 5 minutes.",
    hashtags: ["#Bruschetta", "#Anchois", "#Recette", "#Mediterranee", "#JeanDeLuz"],
    cta: "Enregistrez cette recette !",
    visualPrompt: "Vue de dessus, 3 bruschettas garnies, couleurs vives, basilic frais.",
    imageUrl: "https://picsum.photos/id/1012/800/800",
    published: false
  },
  {
    id: 'p50', week: 21, day: 'Samedi', date: '25/04',
    phase: 'Printemps', theme: 'Lifestyle', format: 'Photo',
    title: "Terrasse de Printemps",
    caption: "Les premiers vrais rayons. ☀️\n\nQuand le soleil revient sur les terrasses...\nC'est le signal pour ressortir l'apéro.\n\nQui est prêt ?",
    hashtags: ["#Terrasse", "#Apero", "#Printemps", "#Soleil", "#JeanDeLuz"],
    cta: "Premier apéro terrasse de l'année ?",
    visualPrompt: "Table en terrasse, produits Jean de Luz, soleil couchant, ambiance conviviale.",
    imageUrl: "https://picsum.photos/id/1029/800/800",
    published: false
  },
  {
    id: 'c24', week: 21, day: 'Dimanche', date: '26/04',
    phase: 'Printemps', theme: 'Lifestyle', format: 'Story',
    title: "[CLIENT] Dimanche en Famille",
    caption: "Contenu à fournir par l'équipe. 📝\n\nMoment convivial, repas en famille avec nos produits.",
    hashtags: ["#JeanDeLuz", "#Famille", "#Dimanche"],
    cta: "Bon dimanche !",
    visualPrompt: "Story moment familial, table dressée (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/1037/800/1200",
    published: false,
    isClientManaged: true
  },

  // --- WEEK 22 (27/04 - 30/04) ---
  {
    id: 'p35', week: 22, day: 'Lundi', date: '27/04',
    phase: 'Printemps', theme: 'Produit', format: 'Carousel',
    title: "Coffret Apéro Printanier",
    caption: "L'apéro parfait pour les beaux jours. 🌸\n\nNotre coffret spécial printemps :\n→ Rillettes de thon\n→ Sardines millésimées\n→ Terrine de la mer\n\nLe cadeau idéal pour les gourmands.\nLien en bio 🎁",
    hashtags: ["#Coffret", "#Apero", "#Printemps", "#Cadeau", "#JeanDeLuz"],
    cta: "Commandez le vôtre !",
    visualPrompt: "Coffret ouvert, produits bien disposés, ambiance printanière lumineuse.",
    imageUrl: "https://picsum.photos/id/1006/800/800",
    published: false
  },
  {
    id: 'c25', week: 22, day: 'Mercredi', date: '29/04',
    phase: 'Printemps', theme: 'Event', format: 'Story',
    title: "[CLIENT] Bilan Avril",
    caption: "Au revoir Avril ! 👋\n\nRécap du mois + teaser mai.\nÀ fournir par l'équipe.",
    hashtags: ["#JeanDeLuz", "#Bilan", "#Avril", "#Recap"],
    cta: "Vivement mai !",
    visualPrompt: "Story récap du mois, remerciements, teaser mai (A FAIRE PAR L'ÉQUIPE).",
    imageUrl: "https://picsum.photos/id/1031/800/1200",
    published: false,
    isClientManaged: true
  }
];
