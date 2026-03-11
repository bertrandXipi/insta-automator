import React, { useState } from 'react';
import { Post } from '../types';
import { ArrowUpRight, Calendar, TrendingUp, Package, MessageCircle, User, Filter } from 'lucide-react';

interface HomeViewProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

type MonthFilter = 'all' | 'mar' | 'apr';

export default function HomeView({ posts, onPostClick }: HomeViewProps) {
  const [monthFilter, setMonthFilter] = useState<MonthFilter>('all');
  
  // Stats Calculation
  const totalPosts = posts.length;
  const publishedCount = posts.filter(p => p.published).length;
  const progress = totalPosts > 0 ? Math.round((publishedCount / totalPosts) * 100) : 0;
  
  const clientPostsCount = posts.filter(p => p.isClientManaged).length;

  // Fonction de tri par date (DD/MM)
  const sortedPosts = [...posts].sort((a, b) => {
    const [dayA, monthA] = a.date.split('/').map(Number);
    const [dayB, monthB] = b.date.split('/').map(Number);
    
    // Année logique : 12 = 2025, 01-04 = 2026
    const yearA = monthA === 12 ? 2025 : 2026;
    const yearB = monthB === 12 ? 2025 : 2026;
    
    return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
  });

  // Séparer mars et avril
  const marchPosts = sortedPosts.filter(p => {
    const month = parseInt(p.date.split('/')[1]);
    return month === 3;
  });
  const aprilPosts = sortedPosts.filter(p => {
    const month = parseInt(p.date.split('/')[1]);
    return month === 4;
  });

  const getPillColor = (theme: string) => {
      switch(theme.toLowerCase()) {
          case 'produit': return 'bg-blue-100 dark:bg-jdl-blue/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900';
          case 'recette': return 'bg-red-100 dark:bg-jdl-red/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-900';
          case 'brand': return 'bg-yellow-100 dark:bg-jdl-gold/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900';
          case 'lifestyle': return 'bg-teal-100 dark:bg-jdl-teal/20 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-900';
          case 'event': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
          default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
      }
  };

  const getBorderColor = (post: Post) => {
    if (post.isClientManaged) return 'border-l-jdl-gold';

    switch(post.theme.toLowerCase()) {
        case 'produit': return 'border-l-jdl-blue';
        case 'recette': return 'border-l-jdl-red';
        case 'brand': return 'border-l-jdl-gold';
        case 'lifestyle': return 'border-l-jdl-teal';
        case 'event': return 'border-l-gray-500';
        default: return 'border-l-gray-600';
    }
  };

  return (
    <div className="space-y-12 pb-12">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#252525] p-8 md:p-12 text-center shadow-xl dark:shadow-2xl">
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-jdl-red via-jdl-gold to-jdl-teal"></div>
         <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">PLANNING ÉDITORIAL</h1>
         <p className="text-xl text-gray-500 dark:text-gray-400 font-light mb-8">Mars – Avril 2026</p>
         
         <div className="inline-flex flex-wrap justify-center gap-4 bg-gray-50 dark:bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-gray-200 dark:border-white/10 shadow-sm">
             <button 
               onClick={() => setMonthFilter('all')}
               className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-all ${monthFilter === 'all' ? 'bg-gray-900 dark:bg-white text-white dark:text-black' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}
             >
                 <Filter size={12} />
                 <span className="text-sm font-bold">Tous</span>
             </button>
             <button 
               onClick={() => setMonthFilter('mar')}
               className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-all ${monthFilter === 'mar' ? 'bg-green-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}
             >
                <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                <span className="text-sm font-bold text-gray-700 dark:text-white">Mars</span>
            </button>
             <button 
               onClick={() => setMonthFilter('apr')}
               className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-all ${monthFilter === 'apr' ? 'bg-green-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}
             >
                <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                <span className="text-sm font-bold text-gray-700 dark:text-white">Avril</span>
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         
         {/* Sidebar Stats */}
         <div className="lg:col-span-1 space-y-6">
             {/* Main Stat Card */}
             <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-[#252525] shadow-sm">
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Progression</h3>
                 <div className="flex items-end justify-between mb-2">
                     <span className="text-4xl font-bold text-gray-900 dark:text-white">{progress}%</span>
                     <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">{publishedCount}/{totalPosts} posts</span>
                 </div>
                 <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                     <div className="bg-gradient-to-r from-jdl-red to-jdl-gold h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                 </div>
             </div>

             {/* Distribution Card - Visual Only */}
             <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 border border-gray-200 dark:border-[#252525] shadow-sm">
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Répartition</h3>
                 <div className="space-y-4">
                     <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center text-gray-700 dark:text-gray-300"><div className="w-3 h-3 bg-jdl-blue rounded-full mr-3"></div>Produits</div>
                         <span className="font-bold text-gray-500 dark:text-gray-400">35%</span>
                     </div>
                     <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center text-gray-700 dark:text-gray-300"><div className="w-3 h-3 bg-jdl-red rounded-full mr-3"></div>Recettes</div>
                         <span className="font-bold text-gray-500 dark:text-gray-400">30%</span>
                     </div>
                     <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center text-gray-700 dark:text-gray-300"><div className="w-3 h-3 bg-jdl-teal rounded-full mr-3"></div>Lifestyle</div>
                         <span className="font-bold text-gray-500 dark:text-gray-400">20%</span>
                     </div>
                     <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center text-gray-700 dark:text-gray-300"><div className="w-3 h-3 bg-jdl-gold rounded-full mr-3"></div>Client (Vous)</div>
                         <span className="font-bold text-gray-900 dark:text-white">{Math.round((clientPostsCount / totalPosts) * 100)}%</span>
                     </div>
                 </div>
             </div>

             {/* Focus Cards */}
             <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-green-900/5 rounded-xl p-6 border border-green-100 dark:border-green-900/20 shadow-sm">
                 <h3 className="text-green-600 dark:text-green-400 font-bold text-lg mb-2">Focus Mars</h3>
                 <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">Printemps, savoir-faire, recettes légères. Le renouveau de la côte basque.</p>
             </div>

             <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-green-900/5 rounded-xl p-6 border border-green-100 dark:border-green-900/20 shadow-sm">
                 <h3 className="text-green-600 dark:text-green-400 font-bold text-lg mb-2">Focus Avril</h3>
                 <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">Pâques, coffrets cadeaux, terrasses et apéros printaniers.</p>
             </div>
         </div>

         {/* Timeline Content */}
         <div className="lg:col-span-3 space-y-10">
             
             {/* MARCH SECTION */}
             {marchPosts.length > 0 && (monthFilter === 'all' || monthFilter === 'mar') && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                            <span className="w-2 h-8 bg-green-500 mr-4 rounded-full"></span> MARS 2026
                        </h2>
                        <span className="px-3 py-1 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/20 rounded text-xs font-bold uppercase">
                            {marchPosts.length} Posts
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {marchPosts.map(post => (
                            <div 
                                key={post.id}
                                onClick={() => onPostClick(post)}
                                className={`bg-white dark:bg-[#1e1e1e] rounded-lg p-5 border-l-4 ${getBorderColor(post)} hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer shadow-sm border-r border-t border-b border-gray-100 dark:border-transparent relative`}
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{post.date}</span>
                                    
                                    {post.isClientManaged ? (
                                        <span className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border border-yellow-200 dark:border-jdl-gold bg-yellow-50 dark:bg-jdl-gold/20 text-yellow-700 dark:text-jdl-gold shadow-[0_0_10px_rgba(214,158,46,0.1)] ml-4">
                                            <User size={12} className="stroke-[3]" />
                                            <span>Post Entreprise</span>
                                        </span>
                                    ) : (
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getPillColor(post.theme)}`}>
                                            {post.theme}
                                        </span>
                                    )}
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{post.title}</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-500 line-clamp-2">{post.caption}</p>
                            </div>
                        ))}
                    </div>
                </div>
             )}

             {/* APRIL SECTION */}
             {aprilPosts.length > 0 && (monthFilter === 'all' || monthFilter === 'apr') && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                            <span className="w-2 h-8 bg-green-500 mr-4 rounded-full"></span> AVRIL 2026
                        </h2>
                        <span className="px-3 py-1 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/20 rounded text-xs font-bold uppercase">
                            {aprilPosts.length} Posts
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {aprilPosts.map(post => (
                            <div 
                                key={post.id}
                                onClick={() => onPostClick(post)}
                                className={`bg-white dark:bg-[#1e1e1e] rounded-lg p-5 border-l-4 ${getBorderColor(post)} hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer shadow-sm border-r border-t border-b border-gray-100 dark:border-transparent relative`}
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{post.date}</span>
                                    
                                    {post.isClientManaged ? (
                                        <span className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border border-yellow-200 dark:border-jdl-gold bg-yellow-50 dark:bg-jdl-gold/20 text-yellow-700 dark:text-jdl-gold shadow-[0_0_10px_rgba(214,158,46,0.1)] ml-4">
                                            <User size={12} className="stroke-[3]" />
                                            <span>Post Entreprise</span>
                                        </span>
                                    ) : (
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getPillColor(post.theme)}`}>
                                            {post.theme}
                                        </span>
                                    )}
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{post.title}</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-500 line-clamp-2">{post.caption}</p>
                            </div>
                        ))}
                    </div>
                </div>
             )}
             
             {marchPosts.length === 0 && aprilPosts.length === 0 && (
                 <div className="text-center py-12 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800">
                     <Package size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                     <p className="text-gray-500 dark:text-gray-400">Aucun post à venir. Consultez le calendrier pour voir l'historique.</p>
                 </div>
             )}

         </div>

      </div>
    </div>
  );
}