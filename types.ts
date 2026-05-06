
import React from 'react';

export type PostFormat = 'Carousel' | 'Reel' | 'Photo' | 'Story';
export type PostPhase = 'Fêtes' | 'Détox' | 'Printemps';

export interface Post {
  id: string;
  week: number;
  day: string;
  date: string; // e.g. "05/12"
  title: string;
  theme: string; // Mapped to pillars: Brand, Prod, Food, Life, Event
  format: PostFormat;
  caption: string;
  hashtags: string[];
  cta: string;
  visualPrompt: string;
  phase: PostPhase;
  imageUrl: string;
  imageUrls?: string[]; // Multiple images for carousel posts
  published: boolean;
  isClientManaged?: boolean; // New flag for posts managed by the client
}

export interface Stat {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  trend?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

export interface InstagramAccount {
  connected: boolean;
  username?: string;
  expiresAt?: string;
  isExpired?: boolean;
}

// ==================== STATS TYPES ====================

export interface StatsVisibility {
  totalViews: number;
  uniqueReach: number;
  followersPercent: number;
  nonFollowersPercent: number;
}

export interface StatsViewsTrend {
  last30Days: { views: number; avgPerDay: number };
  last14Days: { views: number; avgPerDay: number };
  last7Days: { views: number; avgPerDay: number };
}

export interface StatsContentDistribution {
  publications: number;
  reels: number;
  stories: number;
  videos: number;
}

export interface StatsEngagement {
  totalInteractions: number;
  fromFollowers: number;
  last30Days: number;
}

export interface StatsConversion {
  profileVisits: number;
  linkClicks: number;
  addressClicks: number;
  ctr: number;
}

export interface StatsTopPost {
  date: string;
  title: string;
  views: number;
  interactions?: number;
  likes?: number;
  saves?: number;
}

export interface StatsPeakHour {
  hour: string;
  active: number;
}

export interface StatsFinancial {
  monthlyInvestment: number;
  cpm: number;
  potentialROI: string;
}

export interface StatsSnapshotData {
  period: string;
  duration: string;
  followers: number;
  visibility: StatsVisibility;
  viewsTrend: StatsViewsTrend;
  contentDistribution: StatsContentDistribution;
  engagement: StatsEngagement;
  conversion: StatsConversion;
  topPosts: StatsTopPost[];
  peakHours: StatsPeakHour[];
  financial: StatsFinancial;
}

export interface StatsSnapshot {
  id: string;
  user_id: string;
  period: string;
  period_start: string;
  period_end: string;
  data: StatsSnapshotData;
  source: 'manual' | 'api' | 'migration';
  business_metrics: StatsFinancial | null;
  created_at: string;
}

export interface PeriodComparison {
  current: StatsSnapshot;
  previous: StatsSnapshot | null;
  differences: {
    followers: number;
    followersPercent: number;
    totalViews: number;
    totalViewsPercent: number;
    uniqueReach: number;
    uniqueReachPercent: number;
    engagement: number;
    engagementPercent: number;
    linkClicks: number;
    linkClicksPercent: number;
    ctr: number;
    ctrDelta: number;
  };
}