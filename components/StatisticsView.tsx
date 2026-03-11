import React from 'react';
import { 
  Eye, 
  Users, 
  MousePointerClick, 
  TrendingUp, 
  Target,
  Clock,
  BarChart3,
  ArrowUpRight,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Play,
  Image,
  MessageSquare,
  Heart,
  Bookmark,
  UserPlus,
  Euro,
  Zap,
  Calendar,
  Award
} from 'lucide-react';

// Données extraites du rapport
const STATS_DATA = {
  period: 'Décembre 2025 – Janvier 2026',
  duration: '60 jours',
  followers: 4023,
  
  visibility: {
    totalViews: 25159,
    uniqueReach: 1990,
    followersPercent: 67,
    nonFollowersPercent: 33,
  },
  
  viewsTrend: {
    last30Days: { views: 9817, avgPerDay: 327 },
    last14Days: { views: 4529, avgPerDay: 323 },
    last7Days: { views: 2001, avgPerDay: 285 },
  },

  contentDistribution: {
    publications: 93.5,
    reels: 3.4,
    stories: 2.9,
    videos: 0.2,
  },
  
  engagement: {
    totalInteractions: 701,
    fromFollowers: 94.6,
    last30Days: 186,
  },
  
  conversion: {
    profileVisits: 468,
    linkClicks: 59,
    addressClicks: 11,
    ctr: 12.6,
  },
  
  topPosts: [
    { date: '7 Déc.', title: 'Coffret Cadeau Noël', views: 1900, interactions: 296, likes: 136, saves: 18 },
    { date: '11 Déc.', title: 'Photo traditionnelle / Port', views: 796, likes: 22 },
    { date: '5 Déc.', title: 'Paysage / Port de nuit', views: 775, likes: 18 },
    { date: '14 Janv.', title: 'Verres en terrasse / Port', views: 703, interactions: 20, likes: 18, saves: 1 },
    { date: '22 Janv.', title: 'Photo historique (NB)', views: 703, interactions: 23, likes: 22 },
  ],
  
  peakHours: [
    { hour: '9h', active: 1195 },
    { hour: '10h', active: 1100 },
    { hour: '11h', active: 1050 },
    { hour: '12h', active: 1000 },
    { hour: '15h', active: 400 },
    { hour: '18h', active: 158 },
  ],
  
  financial: {
    monthlyInvestment: 150,
    cpm: 17.80,
    potentialROI: '4-5 ventes',
  }
};

// Composant carte statistique
const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  subValue, 
  color = 'blue',
  trend 
}: { 
  icon: any; 
  label: string; 
  value: string | number; 
  subValue?: string;
  color?: 'blue' | 'red' | 'green' | 'gold' | 'teal';
  trend?: 'up' | 'down';
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/20',
    red: 'from-jdl-red to-red-600 shadow-red-500/20',
    green: 'from-green-500 to-green-600 shadow-green-500/20',
    gold: 'from-jdl-gold to-yellow-600 shadow-yellow-500/20',
    teal: 'from-jdl-teal to-teal-600 shadow-teal-500/20',
  };

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-[#252525] shadow-sm hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <Icon size={20} className="text-white" />
        </div>
        {trend && (
          <span className={`flex items-center text-xs font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            <ArrowUpRight size={14} className={trend === 'down' ? 'rotate-90' : ''} />
            {trend === 'up' ? '+' : '-'}
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      {subValue && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subValue}</p>}
    </div>
  );
};

// Barre de progression visuelle
const ProgressBar = ({ value, max, color }: { value: number; max: number; color: string }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
    <div 
      className={`h-full rounded-full transition-all duration-1000 ${color}`}
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
);

export default function StatisticsView() {
  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#252525] p-8 md:p-12 shadow-xl">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-jdl-red via-jdl-gold to-jdl-teal"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-jdl-red/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
              Bilan de la phase précédente (Déc 2025 – Jan 2026)
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            BILAN DE PERFORMANCE
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-light mb-2">
            {STATS_DATA.period} • {STATS_DATA.duration}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">
            Compte : {STATS_DATA.followers.toLocaleString()} abonnés • Secteur : Artisanat / Agroalimentaire
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-900/30">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-green-700 dark:text-green-300">Période active : Mars – Avril 2026</span>
          </div>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={Eye} 
          label="Vues totales" 
          value={STATS_DATA.visibility.totalViews.toLocaleString()}
          subValue="sur 60 jours"
          color="blue"
        />
        <StatCard 
          icon={Users} 
          label="Comptes touchés" 
          value={STATS_DATA.visibility.uniqueReach.toLocaleString()}
          subValue="portée unique"
          color="teal"
        />
        <StatCard 
          icon={MousePointerClick} 
          label="Clics site web" 
          value={STATS_DATA.conversion.linkClicks}
          subValue={`CTR: ${STATS_DATA.conversion.ctr}%`}
          color="gold"
          trend="up"
        />
        <StatCard 
          icon={Heart} 
          label="Interactions" 
          value={STATS_DATA.engagement.totalInteractions}
          subValue={`${STATS_DATA.engagement.fromFollowers}% abonnés`}
          color="red"
        />
      </div>

      {/* Section Audience & Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Répartition Audience */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-[#252525] shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Users size={16} />
            Structure de l'audience
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-300">Abonnés</span>
                <span className="font-bold text-jdl-teal">{STATS_DATA.visibility.followersPercent}%</span>
              </div>
              <ProgressBar value={STATS_DATA.visibility.followersPercent} max={100} color="bg-jdl-teal" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-300">Non-abonnés</span>
                <span className="font-bold text-jdl-gold">{STATS_DATA.visibility.nonFollowersPercent}%</span>
              </div>
              <ProgressBar value={STATS_DATA.visibility.nonFollowersPercent} max={100} color="bg-jdl-gold" />
            </div>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            💡 Noyau dur fidèle, mais potentiel de croissance vers les non-abonnés
          </p>
        </div>

        {/* Répartition Contenu */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-[#252525] shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <BarChart3 size={16} />
            Types de contenu
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image size={14} className="text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Publications</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">{STATS_DATA.contentDistribution.publications}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play size={14} className="text-pink-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Reels</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">{STATS_DATA.contentDistribution.reels}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-purple-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Stories</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">{STATS_DATA.contentDistribution.stories}%</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-900/30">
            <p className="text-xs text-orange-700 dark:text-orange-300 flex items-start gap-2">
              <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
              <span>Les Reels sont sous-exploités. C'est le levier principal pour toucher de nouveaux abonnés.</span>
            </p>
          </div>
        </div>

        {/* Funnel Conversion */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-[#252525] shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Target size={16} />
            Entonnoir de conversion
          </h3>
          
          <div className="space-y-4">
            <div className="relative">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{STATS_DATA.conversion.profileVisits}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Visites profil</p>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-100 dark:border-t-blue-900/30"></div>
            </div>
            
            <div className="relative">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4 text-center mx-8">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{STATS_DATA.conversion.linkClicks}</p>
                <p className="text-xs text-green-600 dark:text-green-400">Clics vers le site</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900/30">
            <p className="text-xs text-green-700 dark:text-green-300 flex items-center gap-2">
              <CheckCircle size={14} />
              <span>CTR de {STATS_DATA.conversion.ctr}% = Excellent ! 1 visiteur sur 8 clique.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Top Posts */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-[#252525] shadow-sm">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Award size={16} />
          Top 5 des publications
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Publication</th>
                <th className="pb-3 font-medium text-right">Vues</th>
                <th className="pb-3 font-medium text-right">Likes</th>
                <th className="pb-3 font-medium text-right">Saves</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {STATS_DATA.topPosts.map((post, idx) => (
                <tr key={idx} className={`${idx === 0 ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}`}>
                  <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{post.date}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {idx === 0 && <span className="text-yellow-500">🏆</span>}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{post.title}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm font-bold text-right text-gray-900 dark:text-white">{post.views.toLocaleString()}</td>
                  <td className="py-3 text-sm text-right text-gray-600 dark:text-gray-400">{post.likes || '-'}</td>
                  <td className="py-3 text-sm text-right text-gray-600 dark:text-gray-400">{post.saves || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          🎯 Le post "Coffret Noël" a généré <span className="font-bold text-jdl-gold">9 nouveaux abonnés</span> et confirme que l'audience réagit aux offres concrètes.
        </p>
      </div>

      {/* Heures d'activité + ROI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Heures d'activité */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-[#252525] shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Clock size={16} />
            Heures d'activité de l'audience
          </h3>
          
          <div className="flex items-end justify-between h-32 gap-2">
            {STATS_DATA.peakHours.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full rounded-t-lg transition-all ${
                    item.active > 1000 ? 'bg-jdl-teal' : item.active > 500 ? 'bg-jdl-gold' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                  style={{ height: `${(item.active / 1195) * 100}%` }}
                />
                <span className="text-[10px] text-gray-500 mt-2">{item.hour}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-900/30">
            <p className="text-xs text-teal-700 dark:text-teal-300">
              📈 Pic maximal à <span className="font-bold">9h00</span> (1 195 actifs). Publier entre 7h30-8h30 pour capter ce pic.
            </p>
          </div>
        </div>

        {/* ROI & Rentabilité */}
        <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-[#1a1a1a] rounded-xl p-6 border border-green-200 dark:border-green-900/30 shadow-sm">
          <h3 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Euro size={16} />
            Rentabilité de l'investissement
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1a1a1a] rounded-lg border border-green-100 dark:border-green-900/20">
              <span className="text-sm text-gray-600 dark:text-gray-300">Investissement mensuel</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{STATS_DATA.financial.monthlyInvestment}€</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1a1a1a] rounded-lg border border-green-100 dark:border-green-900/20">
              <span className="text-sm text-gray-600 dark:text-gray-300">Coût pour 1000 vues (CPM)</span>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">{STATS_DATA.financial.cpm}€</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1a1a1a] rounded-lg border border-green-100 dark:border-green-900/20">
              <span className="text-sm text-gray-600 dark:text-gray-300">Seuil de rentabilité</span>
              <span className="text-xl font-bold text-jdl-gold">{STATS_DATA.financial.potentialROI}</span>
            </div>
          </div>
          
          <p className="text-xs text-green-700 dark:text-green-300 mt-4">
            ✅ CPM inférieur aux Ads payantes. Avec 59 clics, seulement 4-5 ventes suffisent à rentabiliser.
          </p>
        </div>
      </div>

      {/* Diagnostic & Recommandations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Points forts */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-[#252525] shadow-sm">
          <h3 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <CheckCircle size={16} />
            Points forts
          </h3>
          
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><span className="font-medium text-gray-900 dark:text-white">Base fidèle</span> : 94% des interactions viennent des abonnés</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><span className="font-medium text-gray-900 dark:text-white">Qualité visuelle</span> : Photos de paysages et produits très appréciées</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><span className="font-medium text-gray-900 dark:text-white">Conversion excellente</span> : CTR de 12,6% (1 visiteur sur 8 clique)</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><span className="font-medium text-gray-900 dark:text-white">Algorithme réactivé</span> : Le compte est sorti de l'oubli</span>
            </li>
          </ul>
        </div>

        {/* Points faibles */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-[#252525] shadow-sm">
          <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <AlertTriangle size={16} />
            Points à améliorer
          </h3>
          
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="text-red-500 mt-0.5">!</span>
              <span><span className="font-medium text-gray-900 dark:text-white">Dépendance abonnés</span> : Peu de nouvelles personnes touchées (33%)</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="text-red-500 mt-0.5">!</span>
              <span><span className="font-medium text-gray-900 dark:text-white">Reels absents</span> : Seulement 3,4% des vues, levier sous-exploité</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="text-red-500 mt-0.5">!</span>
              <span><span className="font-medium text-gray-900 dark:text-white">Contenu statique</span> : Trop de "bocaux fermés", pas assez de vie</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="text-red-500 mt-0.5">!</span>
              <span><span className="font-medium text-gray-900 dark:text-white">Traçabilité</span> : Pas de code promo pour mesurer les ventes</span>
            </li>
          </ul>
        </div>

        {/* Opportunités */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-[#252525] shadow-sm">
          <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Lightbulb size={16} />
            Opportunités
          </h3>
          
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="text-orange-500 mt-0.5">→</span>
              <span><span className="font-medium text-gray-900 dark:text-white">Reels</span> : Passer de 3,4% à 20% pour toucher les non-abonnés</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="text-orange-500 mt-0.5">→</span>
              <span><span className="font-medium text-gray-900 dark:text-white">Horaires</span> : Publier à 7h30-8h30 pour capter le pic de 9h</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="text-orange-500 mt-0.5">→</span>
              <span><span className="font-medium text-gray-900 dark:text-white">Code promo</span> : Créer INSTA10 pour tracer les ventes</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="text-orange-500 mt-0.5">→</span>
              <span><span className="font-medium text-gray-900 dark:text-white">Contenu "vivant"</span> : Dégustations, recettes, moments de partage</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Call to Action - Pourquoi continuer */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-jdl-red via-red-600 to-jdl-gold p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <Zap size={24} className="text-yellow-300" />
            <span className="text-sm font-bold uppercase tracking-wider text-yellow-200">
              Pourquoi continuer ?
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Le compte est prêt pour la phase de croissance
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-3xl font-bold text-yellow-300 mb-1">60</p>
              <p className="text-sm text-white/80">jours pour "chauffer" l'algorithme</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-3xl font-bold text-yellow-300 mb-1">12,6%</p>
              <p className="text-sm text-white/80">de taux de clic (excellent)</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-3xl font-bold text-yellow-300 mb-1">17,80€</p>
              <p className="text-sm text-white/80">CPM (moins cher que les Ads)</p>
            </div>
          </div>
          
          <p className="text-lg text-white/90 leading-relaxed">
            Arrêter maintenant reviendrait à <span className="font-bold text-yellow-300">stopper un investissement au moment précis où il commence à produire ses effets</span>. 
            Le passage au format vidéo de dégustation est le levier unique restant pour transformer cette visibilité en moteur de croissance e-commerce.
          </p>
        </div>
      </div>

    </div>
  );
}
