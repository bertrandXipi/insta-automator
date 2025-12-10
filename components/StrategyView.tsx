import React from 'react';
import { Post, PostPhase } from '../types';
import { Calendar, Tag, Hash, ArrowRight, User } from 'lucide-react';

interface StrategyViewProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

export default function StrategyView({ posts, onPostClick }: StrategyViewProps) {
  
  const phases: PostPhase[] = ['Fêtes', 'Détox'];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {phases.map((phase, idx) => (
          <div key={phase} className="bg-white dark:bg-[#252525] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 relative overflow-hidden group shadow-md dark:shadow-none">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-10 rounded-bl-full transition-transform group-hover:scale-110 
              ${idx === 0 ? 'from-red-600 to-red-900' : 'from-teal-600 to-teal-900'}`} 
            />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Phase {idx + 1}</span>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{phase}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                {phase === 'Fêtes' ? 'Semaines 1-5' : 'Semaines 6-9'}
            </p>
          </div>
        ))}
      </div>

      {phases.map((phase) => {
        // Affichage de tous les posts de la phase, triés par date
        const phasePosts = posts
            .filter(p => p.phase === phase)
            .sort((a, b) => {
                const [dayA, monthA] = a.date.split('/').map(Number);
                const [dayB, monthB] = b.date.split('/').map(Number);
                const yearA = monthA === 12 ? 2025 : 2026;
                const yearB = monthB === 12 ? 2025 : 2026;
                return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
            });

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
}