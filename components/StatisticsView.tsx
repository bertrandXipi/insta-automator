import React, { useState, useEffect } from 'react';
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
  Award,
  RefreshCw,
  Download,
  Save,
  ArrowLeftRight,
  ChevronDown,
  Edit3,
  Database,
  TrendingDown,
  Minus,
  Instagram
} from 'lucide-react';
import { database } from '../services/database';
import { StatsSnapshot, StatsSnapshotData, StatsFinancial, PeriodComparison } from '../types';

// Données historiques Dec 2025 – Jan 2026 (source initiale, migrée au 1er chargement)
export const LEGACY_STATS: StatsSnapshotData = {
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

// Données Février – Avril 2026 (rapport dashboard pro, 90 jours)
export const FEV_AVRIL_2026_STATS: StatsSnapshotData = {
  period: 'Février – Avril 2026',
  duration: '90 jours',
  followers: 4100,

  visibility: {
    totalViews: 41909,
    uniqueReach: 9877,
    followersPercent: 59.8,
    nonFollowersPercent: 40.2,
  },

  viewsTrend: {
    last30Days: { views: 13968, avgPerDay: 466 },
    last14Days: { views: 6518, avgPerDay: 466 },
    last7Days: { views: 3259, avgPerDay: 466 },
  },

  contentDistribution: {
    publications: 35.0,
    reels: 40.0,
    stories: 20.0,
    videos: 5.0,
  },

  engagement: {
    totalInteractions: 1859,
    fromFollowers: 75.7,
    last30Days: 620,
  },

  conversion: {
    profileVisits: 704,
    linkClicks: 28,
    addressClicks: 0,
    ctr: 4.0,
  },

  topPosts: [
    { date: '29 Mars', title: 'Coucher de soleil', views: 2400, interactions: 110, likes: 70, saves: 12 },
    { date: '14 Fév.', title: 'Bords de mer / Saint-Jean-de-Luz', views: 1850, likes: 45, saves: 8 },
    { date: '3 Mars', title: 'Pique-nique / Terroir', views: 1620, interactions: 85, likes: 52, saves: 10 },
    { date: '8 Avril', title: 'Produits locaux en terrasse', views: 1480, interactions: 65, likes: 40, saves: 6 },
    { date: '22 Fév.', title: 'Plat du jour / Recette Basque', views: 1350, likes: 38, saves: 5 },
  ],

  peakHours: [
    { hour: '9h', active: 1300 },
    { hour: '10h', active: 1150 },
    { hour: '11h', active: 980 },
    { hour: '8h', active: 850 },
    { hour: '12h', active: 720 },
    { hour: '0h', active: 480 },
  ],

  financial: {
    monthlyInvestment: 150,
    cpm: 0,
    potentialROI: '',
  }
};

const DEFAULT_FINANCIAL: StatsFinancial = {
  monthlyInvestment: 0,
  cpm: 0,
  potentialROI: '',
};

// Composant carte statistique
const StatCard = ({
  icon: Icon,
  label,
  value,
  subValue,
  color = 'blue',
  trend,
  comparisonDelta,
}: {
  icon: any;
  label: string;
  value: string | number;
  subValue?: string;
  color?: 'blue' | 'red' | 'green' | 'gold' | 'teal';
  trend?: 'up' | 'down';
  comparisonDelta?: { value: string; positive: boolean | null };
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
        <div className="flex items-center gap-1">
          {trend && (
            <span className={`flex items-center text-xs font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              <ArrowUpRight size={14} className={trend === 'down' ? 'rotate-90' : ''} />
            </span>
          )}
          {comparisonDelta && (
            <span className={`text-xs font-bold ${
              comparisonDelta.positive === null ? 'text-gray-400' :
              comparisonDelta.positive ? 'text-green-500' : 'text-red-500'
            }`}>
              {comparisonDelta.value}
            </span>
          )}
        </div>
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

function computeComparison(current: StatsSnapshot, previous: StatsSnapshot | null): PeriodComparison {
  if (!previous) {
    return {
      current,
      previous: null,
      differences: {
        followers: 0, followersPercent: 0,
        totalViews: 0, totalViewsPercent: 0,
        uniqueReach: 0, uniqueReachPercent: 0,
        engagement: 0, engagementPercent: 0,
        linkClicks: 0, linkClicksPercent: 0,
        ctr: 0, ctrDelta: 0,
      }
    };
  }

  const c = current.data;
  const p = previous.data;

  const pctDiff = (curr: number, prev: number) => prev > 0 ? Math.round(((curr - prev) / prev) * 1000) / 10 : 0;

  return {
    current,
    previous,
    differences: {
      followers: c.followers - p.followers,
      followersPercent: pctDiff(c.followers, p.followers),
      totalViews: c.visibility.totalViews - p.visibility.totalViews,
      totalViewsPercent: pctDiff(c.visibility.totalViews, p.visibility.totalViews),
      uniqueReach: c.visibility.uniqueReach - p.visibility.uniqueReach,
      uniqueReachPercent: pctDiff(c.visibility.uniqueReach, p.visibility.uniqueReach),
      engagement: c.engagement.totalInteractions - p.engagement.totalInteractions,
      engagementPercent: pctDiff(c.engagement.totalInteractions, p.engagement.totalInteractions),
      linkClicks: c.conversion.linkClicks - p.conversion.linkClicks,
      linkClicksPercent: pctDiff(c.conversion.linkClicks, p.conversion.linkClicks),
      ctr: c.conversion.ctr,
      ctrDelta: Math.round((c.conversion.ctr - p.conversion.ctr) * 10) / 10,
    }
  };
}

function deltaFmt(diff: number): string {
  if (diff > 0) return `+${diff.toLocaleString()}`;
  return diff.toLocaleString();
}

function deltaPct(diff: number): { value: string; positive: boolean | null } {
  if (diff > 0) return { value: `+${diff}%`, positive: true };
  if (diff < 0) return { value: `${diff}%`, positive: false };
  return { value: '0%', positive: null };
}

export default function StatisticsView({ fixedSnapshot }: { fixedSnapshot?: StatsSnapshotData | null }) {
  const [snapshots, setSnapshots] = useState<StatsSnapshot[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonIndex, setComparisonIndex] = useState(1);
  const [editingFinancial, setEditingFinancial] = useState(false);
  const [financialDraft, setFinancialDraft] = useState<StatsFinancial>(DEFAULT_FINANCIAL);
  const [savingFinancial, setSavingFinancial] = useState(false);

  useEffect(() => {
    if (fixedSnapshot) {
      setSnapshots([{
        id: 'fixed',
        user_id: 'default-user',
        period: fixedSnapshot.period,
        period_start: '',
        period_end: '',
        data: fixedSnapshot,
        source: 'migration',
        business_metrics: fixedSnapshot.financial,
        created_at: new Date().toISOString()
      }]);
      setCurrentIndex(0);
      setIsLoading(false);
      return;
    }
    loadSnapshots();
  }, [fixedSnapshot]);

  const loadSnapshots = async () => {
    setIsLoading(true);
    try {
      const all = await database.getStatsSnapshots();
      setSnapshots(all);
      if (all.length > 0) {
        setCurrentIndex(0);
        setComparisonIndex(all.length > 1 ? 1 : 0);
        const bm = all[0].business_metrics;
        if (bm && (bm.monthlyInvestment > 0 || bm.cpm > 0 || bm.potentialROI)) {
          setFinancialDraft(bm);
        } else {
          setFinancialDraft(all[0].data.financial);
        }
      }
    } catch (e) {
      console.error("Erreur chargement snapshots:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMigrateLegacy = async () => {
    setIsMigrating(true);
    try {
      const result = await database.saveStatsSnapshot(LEGACY_STATS, {
        source: 'migration',
        businessMetrics: LEGACY_STATS.financial,
        periodStart: '2025-12-01',
        periodEnd: '2026-01-31',
      });
      if (result) await loadSnapshots();
    } catch (e: any) {
      console.error("Erreur migration:", e);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleMigrateFevAvril = async () => {
    setIsMigrating(true);
    try {
      const result = await database.saveStatsSnapshot(FEV_AVRIL_2026_STATS, {
        source: 'migration',
        businessMetrics: FEV_AVRIL_2026_STATS.financial,
        periodStart: '2026-02-01',
        periodEnd: '2026-04-30',
      });
      if (result) await loadSnapshots();
    } catch (e: any) {
      console.error("Erreur migration:", e);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleFetchInsights = async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      const result = await database.fetchInstagramInsights();
      if (result.success && result.data) {
        const merged: StatsSnapshotData = { ...result.data, financial: financialDraft };
        const saved = await database.saveStatsSnapshot(merged, {
          source: 'api',
          businessMetrics: financialDraft,
        });
        if (saved) await loadSnapshots();
      } else {
        setFetchError(result.error || "Erreur inconnue");
      }
    } catch (e: any) {
      setFetchError(e.message);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSaveFinancial = async () => {
    const snap = snapshots[currentIndex];
    if (!snap) return;
    setSavingFinancial(true);
    try {
      const merged: StatsSnapshotData = { ...snap.data, financial: financialDraft };
      await database.saveStatsSnapshot(merged, {
        source: snap.source,
        businessMetrics: financialDraft,
        periodStart: snap.period_start,
        periodEnd: snap.period_end,
      });
      await loadSnapshots();
      setEditingFinancial(false);
    } catch (e: any) {
      console.error("Erreur sauvegarde metrics:", e);
    } finally {
      setSavingFinancial(false);
    }
  };

  const handleDeleteSnapshot = async (id: string) => {
    if (!confirm("Supprimer ce snapshot ?")) return;
    await database.deleteStatsSnapshot(id);
    await loadSnapshots();
  };

  // ==================== RENDERING ====================

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 space-y-4">
        <RefreshCw className="animate-spin text-jdl-red" size={48} />
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  const currentSnapshot = snapshots[currentIndex];
  const comparisonSnapshot = comparisonMode ? snapshots[comparisonIndex] : null;
  const comparison = comparisonMode && currentSnapshot
    ? computeComparison(currentSnapshot, comparisonSnapshot ?? null)
    : null;

  // Empty state
  if (!currentSnapshot) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="p-6 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-[#252525] shadow-sm text-center max-w-md">
          <Database size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucune donnée statistique</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Importez les données historiques ou connectez Instagram pour récupérer les statistiques des 90 derniers jours.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleMigrateFevAvril}
              disabled={isMigrating}
              className="w-full px-4 py-3 bg-jdl-red text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isMigrating ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />}
              Importer les données Fév – Avril 2026
            </button>
            <button
              onClick={handleMigrateLegacy}
              disabled={isMigrating}
              className="w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#252525] rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isMigrating ? <RefreshCw size={16} className="animate-spin" /> : <Database size={16} />}
              Importer les données Déc 2025 – Jan 2026
            </button>
            <button
              onClick={handleFetchInsights}
              disabled={isFetching}
              className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isFetching ? <RefreshCw size={16} className="animate-spin" /> : <Instagram size={16} />}
              Récupérer via Instagram (90 jours)
            </button>
          </div>
          {fetchError && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900/30">
              <p className="text-xs text-red-700 dark:text-red-300">{fetchError}</p>
              {fetchError.includes('permissions') && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                  Reconnectez votre compte Instagram pour obtenir les permissions nécessaires.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  const d = currentSnapshot.data;
  const prevD = comparison?.previous?.data;

  return (
    <div className="space-y-8 pb-12">
      {fixedSnapshot && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <BarChart3 className="text-jdl-red" size={36} />
              {fixedSnapshot.period}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Rapport de performance archivé • {fixedSnapshot.duration}
            </p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      {!fixedSnapshot && (
        <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="relative">
            <select
              value={currentIndex}
              onChange={(e) => {
                setCurrentIndex(parseInt(e.target.value));
                if (comparisonMode && parseInt(e.target.value) === comparisonIndex) {
                  setComparisonIndex(0);
                }
              }}
              className="appearance-none bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#252525] rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-jdl-red"
            >
              {snapshots.map((s, i) => (
                <option key={s.id} value={i}>
                  {s.period} {s.source === 'api' ? '(API)' : s.source === 'migration' ? '(Hist.)' : ''}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            currentSnapshot.source === 'api' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            currentSnapshot.source === 'migration' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}>
            {currentSnapshot.source === 'api' ? 'API Instagram' : currentSnapshot.source === 'migration' ? 'Historique' : 'Manuel'}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle comparison */}
          {snapshots.length >= 2 && (
            <button
              onClick={() => setComparisonMode(!comparisonMode)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                comparisonMode
                  ? 'bg-jdl-red text-white'
                  : 'bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#252525] hover:bg-gray-100 dark:hover:bg-[#252525]'
              }`}
            >
              <ArrowLeftRight size={14} />
              Comparer
            </button>
          )}

          {/* Comparison period selector */}
          {comparisonMode && (
            <select
              value={comparisonIndex}
              onChange={(e) => setComparisonIndex(parseInt(e.target.value))}
              className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#252525] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-jdl-red"
            >
              {snapshots.map((s, i) => (
                i !== currentIndex ? <option key={s.id} value={i}>{s.period}</option> : null
              ))}
            </select>
          )}

          <button
            onClick={handleFetchInsights}
            disabled={isFetching}
            className="px-3 py-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {isFetching ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
            Instagram 90j
          </button>

          {!editingFinancial ? (
            <button
              onClick={() => setEditingFinancial(true)}
              className="px-3 py-2 bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#252525] rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors flex items-center gap-2"
            >
              <Edit3 size={14} />
              Métriques business
            </button>
          ) : null}

          <button
            onClick={handleMigrateFevAvril}
            disabled={isMigrating}
            className="px-3 py-2 bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#252525] rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors flex items-center gap-2"
            title="Importer les données Février – Avril 2026"
          >
            <Download size={14} />
            {isMigrating ? 'Import...' : 'Fév–Avr 2026'}
          </button>
          <button
            onClick={handleMigrateLegacy}
            disabled={isMigrating}
            className="px-3 py-2 bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#252525] rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors flex items-center gap-2"
            title="Importer les données Décembre 2025 – Janvier 2026"
          >
            <Database size={14} />
            {isMigrating ? 'Import...' : 'Déc–Jan 2026'}
          </button>
        </div>
      </div>
      )}

      {/* Financial editor */}
      {editingFinancial && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-jdl-red/30 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Métriques business</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Investissement mensuel (€)</label>
              <input
                type="number"
                value={financialDraft.monthlyInvestment}
                onChange={(e) => setFinancialDraft({ ...financialDraft, monthlyInvestment: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-jdl-red"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">CPM (€)</label>
              <input
                type="number"
                step="0.01"
                value={financialDraft.cpm}
                onChange={(e) => setFinancialDraft({ ...financialDraft, cpm: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-jdl-red"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Seuil de rentabilité</label>
              <input
                type="text"
                value={financialDraft.potentialROI}
                onChange={(e) => setFinancialDraft({ ...financialDraft, potentialROI: e.target.value })}
                placeholder="ex: 4-5 ventes"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-jdl-red"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSaveFinancial} disabled={savingFinancial} className="px-4 py-2 bg-jdl-red text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2">
              {savingFinancial ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              Sauvegarder
            </button>
            <button onClick={() => { setEditingFinancial(false); setFinancialDraft(d.financial); }} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Fetch error banner */}
      {fetchError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/30 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-300">{fetchError}</p>
            {fetchError.includes('permissions') && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Reconnectez votre compte Instagram pour obtenir les permissions nécessaires.
              </p>
            )}
          </div>
          <button onClick={() => setFetchError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* ==================== COMPARISON MODE ==================== */}
      {comparisonMode && comparison && comparison.previous ? (
        <>
          {/* Side-by-side KPIs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Previous period */}
            <div>
              <h2 className="text-lg font-bold text-gray-400 dark:text-gray-500 mb-4 uppercase tracking-wider text-center">{comparison.previous.data.period}</h2>
              <div className="grid grid-cols-2 gap-3">
                <StatCard icon={Eye} label="Vues totales" value={prevD!.visibility.totalViews.toLocaleString()} color="blue" />
                <StatCard icon={Users} label="Comptes touchés" value={prevD!.visibility.uniqueReach.toLocaleString()} color="teal" />
                <StatCard icon={MousePointerClick} label="Clics site web" value={prevD!.conversion.linkClicks} subValue={`CTR: ${prevD!.conversion.ctr}%`} color="gold" />
                <StatCard icon={Heart} label="Interactions" value={prevD!.engagement.totalInteractions} color="red" />
              </div>
            </div>

            {/* Current period */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-center">{d.period}</h2>
              <div className="grid grid-cols-2 gap-3">
                <StatCard icon={Eye} label="Vues totales" value={d.visibility.totalViews.toLocaleString()} color="blue" comparisonDelta={deltaPct(comparison.differences.totalViewsPercent)} />
                <StatCard icon={Users} label="Comptes touchés" value={d.visibility.uniqueReach.toLocaleString()} color="teal" comparisonDelta={deltaPct(comparison.differences.uniqueReachPercent)} />
                <StatCard icon={MousePointerClick} label="Clics site web" value={d.conversion.linkClicks} subValue={`CTR: ${d.conversion.ctr}%`} color="gold" comparisonDelta={{ value: deltaFmt(comparison.differences.linkClicks), positive: comparison.differences.linkClicks > 0 ? true : comparison.differences.linkClicks < 0 ? false : null }} />
                <StatCard icon={Heart} label="Interactions" value={d.engagement.totalInteractions} color="red" comparisonDelta={deltaPct(comparison.differences.engagementPercent)} />
              </div>
            </div>
          </div>

          {/* Deltas summary */}
          <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#252525] p-8 shadow-xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-jdl-red via-jdl-gold to-jdl-teal"></div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Résumé des évolutions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <DeltaSummary label="Abonnés" current={d.followers.toLocaleString()} previous={prevD!.followers.toLocaleString()} delta={comparison.differences.followersPercent} />
              <DeltaSummary label="Vues totales" current={d.visibility.totalViews.toLocaleString()} previous={prevD!.visibility.totalViews.toLocaleString()} delta={comparison.differences.totalViewsPercent} />
              <DeltaSummary label="Portée unique" current={d.visibility.uniqueReach.toLocaleString()} previous={prevD!.visibility.uniqueReach.toLocaleString()} delta={comparison.differences.uniqueReachPercent} />
              <DeltaSummary label="Interactions" current={d.engagement.totalInteractions.toLocaleString()} previous={prevD!.engagement.totalInteractions.toLocaleString()} delta={comparison.differences.engagementPercent} />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* ==================== SINGLE PERIOD MODE ==================== */}
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
                  Bilan de la phase précédente ({d.period})
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                BILAN DE PERFORMANCE
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 font-light mb-2">
                {d.period} • {d.duration}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">
                Compte : {d.followers.toLocaleString()} abonnés • Secteur : Artisanat / Agroalimentaire
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-900/30">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                  Période active : {currentSnapshot.source === 'api' ? 'Données API Instagram' : currentSnapshot.source === 'migration' ? 'Données historiques' : 'Saisie manuelle'}
                </span>
              </div>
            </div>
          </div>

          {/* KPIs principaux */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={Eye}
              label="Vues totales"
              value={d.visibility.totalViews.toLocaleString()}
              subValue={`sur ${d.duration}`}
              color="blue"
            />
            <StatCard
              icon={Users}
              label="Comptes touchés"
              value={d.visibility.uniqueReach.toLocaleString()}
              subValue="portée unique"
              color="teal"
            />
            <StatCard
              icon={MousePointerClick}
              label="Clics site web"
              value={d.conversion.linkClicks}
              subValue={`CTR: ${d.conversion.ctr}%`}
              color="gold"
              trend={d.conversion.ctr > 10 ? 'up' : undefined}
            />
            <StatCard
              icon={Heart}
              label="Interactions"
              value={d.engagement.totalInteractions}
              subValue={d.engagement.fromFollowers > 0 ? `${d.engagement.fromFollowers}% abonnés` : undefined}
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
                    <span className="font-bold text-jdl-teal">{d.visibility.followersPercent}%</span>
                  </div>
                  <ProgressBar value={d.visibility.followersPercent} max={100} color="bg-jdl-teal" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-300">Non-abonnés</span>
                    <span className="font-bold text-jdl-gold">{d.visibility.nonFollowersPercent}%</span>
                  </div>
                  <ProgressBar value={d.visibility.nonFollowersPercent} max={100} color="bg-jdl-gold" />
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                {currentSnapshot.source === 'api'
                  ? "⚠️ Estimé depuis les données API. Le split abonnés/non-abonnés n'est pas fourni directement par l'API Instagram."
                  : '💡 Noyau dur fidèle, mais potentiel de croissance vers les non-abonnés'}
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
                  <span className="font-bold text-gray-900 dark:text-white">{d.contentDistribution.publications}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Play size={14} className="text-pink-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Reels</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">{d.contentDistribution.reels}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-purple-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Stories</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">{d.contentDistribution.stories}%</span>
                </div>
              </div>

              {d.contentDistribution.reels < 10 && (
                <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-900/30">
                  <p className="text-xs text-orange-700 dark:text-orange-300 flex items-start gap-2">
                    <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>Les Reels sont sous-exploités. C'est le levier principal pour toucher de nouveaux abonnés.</span>
                  </p>
                </div>
              )}
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
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{d.conversion.profileVisits.toLocaleString()}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Visites profil</p>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-100 dark:border-t-blue-900/30"></div>
                </div>

                <div className="relative">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4 text-center mx-8">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{d.conversion.linkClicks.toLocaleString()}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">Clics vers le site</p>
                  </div>
                </div>
              </div>

              {d.conversion.ctr > 0 && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900/30">
                  <p className="text-xs text-green-700 dark:text-green-300 flex items-center gap-2">
                    <CheckCircle size={14} />
                    <span>CTR de {d.conversion.ctr}%{d.conversion.ctr > 10 ? " = Excellent !" : ""}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Top Posts */}
          {d.topPosts.length > 0 && (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-[#252525] shadow-sm">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Award size={16} />
                Top {d.topPosts.length} des publications
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
                    {d.topPosts.map((post, idx) => (
                      <tr key={idx} className={`${idx === 0 ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}`}>
                        <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{post.date}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            {idx === 0 && <span>🏆</span>}
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
            </div>
          )}

          {/* Heures d'activité + ROI */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Heures d'activité */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-[#252525] shadow-sm">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Clock size={16} />
                Heures d'activité de l'audience
              </h3>

              {d.peakHours.length > 0 ? (
                <>
                  <div className="flex items-end justify-between h-32 gap-2">
                    {d.peakHours.map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div
                          className={`w-full rounded-t-lg transition-all ${
                            item.active > 1000 ? 'bg-jdl-teal' : item.active > 500 ? 'bg-jdl-gold' : 'bg-gray-300 dark:bg-gray-700'
                          }`}
                          style={{ height: `${(item.active / d.peakHours[0].active) * 100}%` }}
                        />
                        <span className="text-[10px] text-gray-500 mt-2">{item.hour}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-900/30">
                    <p className="text-xs text-teal-700 dark:text-teal-300">
                      📈 Pic maximal à <span className="font-bold">{d.peakHours[0].hour}00</span> ({d.peakHours[0].active.toLocaleString()} actifs).
                    </p>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center text-gray-400">
                  <Clock size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Données non disponibles via l'API Instagram.</p>
                  <p className="text-xs mt-1">Les heures d'activité nécessitent une saisie manuelle ou des outils tiers.</p>
                </div>
              )}
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
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{d.financial.monthlyInvestment}€</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1a1a1a] rounded-lg border border-green-100 dark:border-green-900/20">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Coût pour 1000 vues (CPM)</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">{d.financial.cpm}€</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1a1a1a] rounded-lg border border-green-100 dark:border-green-900/20">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Seuil de rentabilité</span>
                  <span className="text-xl font-bold text-jdl-gold">{d.financial.potentialROI || '—'}</span>
                </div>
              </div>

              <p className="text-xs text-green-700 dark:text-green-300 mt-4">
                ✅ Métriques modifiables via le bouton "Métriques business".
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
                  <span><span className="font-medium text-gray-900 dark:text-white">Base fidèle</span> : {d.engagement.fromFollowers > 0 ? `${d.engagement.fromFollowers}%` : 'Majorité'} des interactions viennent des abonnés</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span><span className="font-medium text-gray-900 dark:text-white">Qualité visuelle</span> : Photos de paysages et produits très appréciées</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span><span className="font-medium text-gray-900 dark:text-white">Conversion</span> : CTR de {d.conversion.ctr}%</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span><span className="font-medium text-gray-900 dark:text-white">Visibilité</span> : {d.visibility.totalViews.toLocaleString()} vues sur la période</span>
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
                  <span><span className="font-medium text-gray-900 dark:text-white">Dépendance abonnés</span> : {100 - d.visibility.nonFollowersPercent}% abonnés, peu de nouvelles personnes touchées</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-red-500 mt-0.5">!</span>
                  <span><span className="font-medium text-gray-900 dark:text-white">Reels absents</span> : Seulement {d.contentDistribution.reels}% des vues, levier sous-exploité</span>
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
                  <span><span className="font-medium text-gray-900 dark:text-white">Reels</span> : Passer à 20%+ pour toucher les non-abonnés</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-orange-500 mt-0.5">→</span>
                  <span><span className="font-medium text-gray-900 dark:text-white">Code promo</span> : Créer un code pour tracer les ventes</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-orange-500 mt-0.5">→</span>
                  <span><span className="font-medium text-gray-900 dark:text-white">Contenu "vivant"</span> : Dégustations, recettes, moments de partage</span>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Petit composant pour afficher un delta dans le comparateur
function DeltaSummary({ label, current, previous, delta }: {
  label: string;
  current: string;
  previous: string;
  delta: number;
}) {
  const isUp = delta > 0;
  const isDown = delta < 0;
  return (
    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="text-sm text-gray-400 line-through">{previous}</span>
        <span className="text-lg font-bold text-gray-900 dark:text-white">{current}</span>
      </div>
      <span className={`inline-flex items-center gap-0.5 text-sm font-bold ${
        isUp ? 'text-green-500' : isDown ? 'text-red-500' : 'text-gray-400'
      }`}>
        {isUp ? <TrendingUp size={14} /> : isDown ? <TrendingDown size={14} /> : <Minus size={14} />}
        {isUp ? '+' : ''}{delta}%
      </span>
    </div>
  );
}
