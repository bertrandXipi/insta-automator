import React from 'react';
import { ASSET_CATEGORIES } from '../constants';
import { Download, ExternalLink } from 'lucide-react';

export default function AssetLibrary() {
  // Generating fake assets for visual representation
  const assets = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    url: `https://picsum.photos/seed/${i + 45}/800/800`,
    category: ASSET_CATEGORIES[i % ASSET_CATEGORIES.length].id,
    title: `Asset_JDL_2024_0${i+1}.jpg`
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Médiathèque</h2>
         <div className="flex space-x-2">
            {ASSET_CATEGORIES.map(cat => (
                <button key={cat.id} className="px-4 py-2 rounded-full text-xs font-medium border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors">
                    {cat.label}
                </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {/* Upload Card */}
         <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-jdl-red dark:hover:border-jdl-red hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors flex flex-col items-center justify-center cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 group-hover:bg-jdl-red flex items-center justify-center mb-3 transition-colors">
                <span className="text-2xl text-gray-500 dark:text-gray-400 group-hover:text-white font-light">+</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white font-medium">Importer un visuel</span>
         </div>

         {assets.map((asset) => (
             <div key={asset.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-900">
                 <img src={asset.url} alt={asset.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 dark:opacity-70 group-hover:opacity-100" />
                 
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-3 p-4">
                     <p className="text-xs text-center text-gray-300 font-mono truncate w-full">{asset.title}</p>
                     <div className="flex space-x-3">
                        <button className="p-2 bg-white text-black rounded-full hover:bg-gray-200 shadow-lg">
                            <Download size={16} />
                        </button>
                         <button className="p-2 bg-gray-800 text-white rounded-full hover:bg-black border border-gray-600 shadow-lg">
                            <ExternalLink size={16} />
                        </button>
                     </div>
                 </div>
                 
                 <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded text-[10px] font-bold uppercase text-gray-900 dark:text-white border border-black/10 dark:border-white/10 shadow-sm">
                        {ASSET_CATEGORIES.find(c => c.id === asset.category)?.label}
                    </span>
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
}