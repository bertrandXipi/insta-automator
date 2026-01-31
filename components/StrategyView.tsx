import React, { useState } from 'react';
import { Post, PostPhase } from '../types';
import { Calendar, User, ArrowRight, Grid3X3, List, Play, Images, CheckCircle, Filter } from 'lucide-react';

interface StrategyViewProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

type MonthFilter = 'all' | 'dec' | 'jan' | 'feb' | 'mar';

export default function StrategyView({ posts, onPostClick }: StrategyViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [monthFilter, setMonthFilter] = useState<MonthFilter>('all');
  const phases: PostPhase[] = ['Fêtes', 'Détox', 'Printemps'];

  // Tous les posts triés par date
  const sortedPosts = [...posts].sort((a, b) => {
    const [dayA, monthA] = a.date.split('/').map(Number);
    const [dayB, monthB] = b.date.split('/').map(Number);
    // Décembre 2025, Janvier-Mars 2026
    const yearA = monthA === 12 ? 2025 : 2026;
    const yearB = monthB === 12 ? 2025 : 2026;
    return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
  });

  // Filtrer par mois
  const filteredPosts = sortedPosts.filter(post => {
    if (monthFilter === 'all') return true;
    const month = parseInt(post.date.split('/')[1]);
    switch (monthFilter) {
      case 'dec': return month === 12;
      case 'jan': return month === 1;
      case 'feb': return month === 2;
      case 'mar': return month === 3;
      default: return true;
    }
  });

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'Reel': return <Play size={16} fill="white" />;
      case 'Carousel': return <Images size={16} />;
      default: return null;
    }
  };

  // Vue Grille Instagram
  const GridView = () => (
    <div className="grid grid-cols-3 gap-1 md:gap-2">
      {filteredPosts.map((post) => (
        <div
          key={post.id}
          onClick={() => onPostClick(post)}
          className="aspect-square relative cursor-pointer group overflow-hidden bg-gray-100 dark:bg-gray-900"
        >
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-80"
          />
          
          {/* Overlay au hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="text-white text-center px-2">
              <p className="text-xs md:text-sm font-bold line-clamp-2">{post.title}</p>
              <p className="text-[10px] md:text-xs opacity-70 mt-1">{post.date}</p>
            </div>
          </div>

          {/* Badge format (Reel/Carousel) */}
          {(post.format === 'Reel' || post.format === 'Carousel') && (
            <div className="absolute top-2 right-2 text-white drop-shadow-lg">
              {getFormatIcon(post.format)}
            </div>
          )}

          {/* Badge Client */}
          {post.isClientManaged && (
            <div className="absolute top-2 left-2 bg-jdl-gold text-black rounded-full p-1 shadow-lg">
              <User size={10} />
            </div>
          )}

          {/* Badge Publié */}
          {post.published && (
            <div className="absolute bottom-2 right-2">
              <CheckCircle size={16} className="text-green-500 drop-shadow-lg" fill="rgba(255,255,255,0.8)" />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // Vue Liste détaillée (ancienne vue)
  const ListView = () => (
    <div className="space-y-12">
      {phases.map((phase) => {
        const phasePosts = filteredPosts.filter(p => p.phase === phase);
        if (phasePosts.length === 0) return null;

        return (
          <div key={phase} className="space-y-6">
            <div className="flex items-center space-x-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{phase}</h2>
              <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {phasePosts.map((post) => (
                <div 
                  key={post.id} 
                  onClick={() => onPostClick(post)}
                  className={`bg-white dark:bg-[#1e1e1e] group hover:bg-gray-50 dark:hover:bg-[#252525] border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 relative
                    ${post.isClientManaged 
                      ? 'border-yellow-200 dark:border-jdl-gold/40 shadow-yellow-100 dark:shadow-jdl-gold/5' 
                      : 'border-gray-200 dark:border-[#333] hover:border-red-200 dark:hover:border-jdl-red/50'
                    }`}
                >
                  {post.isClientManaged && (
                    <div className="absolute top-0 left-0 bg-jdl-gold text-black text-[10px] font-bold px-3 py-1 z-10 rounded-br-lg flex items-center shadow-lg">
                      <User size={10} className="mr-1" />
                      Post Client
                    </div>
                  )}

                  <div className="h-48 w-full overflow-hidden relative">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 dark:opacity-80 group-hover:opacity-100" 
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                      {post.format}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white dark:from-[#1e1e1e] to-transparent"></div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span className={`flex items-center font-medium ${post.isClientManaged ? 'text-yellow-600 dark:text-jdl-gold' : 'text-red-600 dark:text-jdl-red'}`}>
                        <Calendar size={12} className="mr-1" />
                        Sem {post.week} • {post.day}
                      </span>
                      <span>•</span>
                      <span>{post.theme}</span>
                    </div>

                    <h3 className={`text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-1 transition-colors ${post.isClientManaged ? 'group-hover:text-yellow-600 dark:group-hover:text-jdl-gold' : 'group-hover:text-red-600 dark:group-hover:text-jdl-red'}`}>
                      {post.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                      {post.caption}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#333]">
                      <div className="flex -space-x-2">
                         <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border border-white dark:border-[#1e1e1e] flex items-center justify-center text-[10px] text-gray-500 dark:text-gray-300">#</div>
                         <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border border-white dark:border-[#1e1e1e] flex items-center justify-center text-[10px] text-gray-500 dark:text-gray-300">#</div>
                      </div>
                      <span className="text-xs font-semibold text-gray-900 dark:text-white flex items-center group-hover:translate-x-1 transition-transform">
                        Voir la fiche <ArrowRight size={14} className="ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header avec toggle de vue */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Feed Preview</h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">{filteredPosts.length} posts</span>
        </div>
        
        {/* Toggle Vue */}
        <div className="flex items-center bg-gray-100 dark:bg-[#252525] rounded-lg p-1 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all ${
              viewMode === 'grid' 
                ? 'bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            title="Vue grille Instagram"
          >
            <Grid3X3 size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all ${
              viewMode === 'list' 
                ? 'bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            title="Vue liste détaillée"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Filtre par mois */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setMonthFilter('all')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
            monthFilter === 'all' 
              ? 'bg-gray-900 dark:bg-white text-white dark:text-black' 
              : 'bg-gray-100 dark:bg-[#252525] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#333]'
          }`}
        >
          <Filter size={14} />
          <span>Tous ({sortedPosts.length})</span>
        </button>
        <button
          onClick={() => setMonthFilter('dec')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
            monthFilter === 'dec' 
              ? 'bg-jdl-red text-white' 
              : 'bg-gray-100 dark:bg-[#252525] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#333]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-jdl-red"></span>
          <span>Décembre</span>
        </button>
        <button
          onClick={() => setMonthFilter('jan')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
            monthFilter === 'jan' 
              ? 'bg-jdl-teal text-white' 
              : 'bg-gray-100 dark:bg-[#252525] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#333]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-jdl-teal"></span>
          <span>Janvier</span>
        </button>
        <button
          onClick={() => setMonthFilter('feb')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
            monthFilter === 'feb' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 dark:bg-[#252525] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#333]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span>Février</span>
        </button>
        <button
          onClick={() => setMonthFilter('mar')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
            monthFilter === 'mar' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 dark:bg-[#252525] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#333]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span>Mars</span>
        </button>
      </div>

      {/* Phases summary (only in grid mode) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {phases.map((phase, idx) => {
            const count = sortedPosts.filter(p => p.phase === phase).length;
            return (
              <div 
                key={phase} 
                className={`p-4 rounded-xl border ${
                  idx === 0 
                    ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30' 
                    : 'bg-teal-50 dark:bg-teal-900/10 border-teal-200 dark:border-teal-900/30'
                }`}
              >
                <span className={`text-xs font-bold uppercase tracking-widest ${idx === 0 ? 'text-red-600 dark:text-jdl-red' : 'text-teal-600 dark:text-jdl-teal'}`}>
                  Phase {idx + 1} • {phase}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{count} posts</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Contenu */}
      {viewMode === 'grid' ? <GridView /> : <ListView />}
    </div>
  );
}
