
import React from 'react';

export type PostFormat = 'Carousel' | 'Reel' | 'Photo' | 'Story';
export type PostPhase = 'Fêtes' | 'Détox';

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