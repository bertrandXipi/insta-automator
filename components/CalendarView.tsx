import React from 'react';
import { Post } from '../types';
import { Instagram, Video, Camera, Images, CheckCircle, Circle, User } from 'lucide-react';

interface CalendarViewProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  onTogglePublish: (postId: string) => void;
}

export default function CalendarView({ posts, onPostClick, onTogglePublish }: CalendarViewProps) {
  // We have 9 weeks to cover until Jan 31
  const weeks = Array.from({ length: 9 }, (_, i) => i + 1);
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'Reel': return <Video size={14} />;
      case 'Carousel': return <Images size={14} />;
      default: return <Camera size={14} />;
    }
  };

  const getFormatColor = (post: Post) => {
     // Special styling for client-managed posts
     if (post.isClientManaged) {
        if (post.published) return 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-400 dark:text-gray-500 border-yellow-200 dark:border-yellow-900/30 ring-1 ring-yellow-200 dark:ring-yellow-900/30';
        return 'bg-yellow-50 dark:bg-[#2a2515] text-yellow-800 dark:text-jdl-gold border-yellow-200 dark:border-jdl-gold/60 ring-1 ring-yellow-200 dark:ring-jdl-gold/20';
     }

     // If published, desaturate/dim the colors
     if (post.published) {
        return 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-400 dark:text-gray-500 border-green-200 dark:border-green-900/30 ring-1 ring-green-200 dark:ring-green-900/30';
     }

     switch (post.format) {
      case 'Reel': return 'bg-pink-50 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-700/50';
      case 'Carousel': return 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/50';
      default: return 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[1000px]">
        {/* Header Days */}
        <div className="grid grid-cols-8 gap-4 mb-6 sticky top-0 bg-gray-50 dark:bg-[#121212] z-10 py-2 transition-colors duration-300">
          <div className="col-span-1 text-gray-400 dark:text-gray-500 font-bold uppercase text-xs flex items-end pb-2">Semaine</div>
          {days.map(day => (
            <div key={day} className="col-span-1 text-center text-gray-500 dark:text-gray-400 font-medium text-sm pb-2 border-b border-gray-200 dark:border-gray-800">
              {day}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {weeks.map(week => (
            <div key={week} className="grid grid-cols-8 gap-4 min-h-[140px]">
              {/* Week Number Column */}
              <div className="col-span-1 flex flex-col justify-center border-r border-gray-200 dark:border-gray-800 pr-4">
                <span className="text-3xl font-bold text-gray-400 dark:text-gray-700">0{week}</span>
                <span className={`text-xs uppercase font-bold mt-1 ${week <= 5 ? 'text-red-500 dark:text-jdl-red' : 'text-teal-600 dark:text-jdl-teal'}`}>
                   {week <= 5 ? 'Fêtes' : 'Détox'}
                </span>
              </div>

              {/* Days Columns */}
              {days.map(day => {
                const post = posts.find(p => p.week === week && p.day === day);
                
                return (
                  <div key={`${week}-${day}`} className="col-span-1 relative group">
                    <div className="absolute inset-0 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg pointer-events-none"></div>
                    
                    {post ? (
                      <div 
                        onClick={() => onPostClick(post)}
                        className={`h-full w-full rounded-lg p-3 border cursor-pointer hover:ring-2 hover:ring-opacity-100 transition-all flex flex-col justify-between group/card relative 
                        ${getFormatColor(post)} 
                        ${post.isClientManaged ? 'hover:ring-yellow-400 dark:hover:ring-jdl-gold' : 'hover:ring-red-400 dark:hover:ring-jdl-red'}
                        `}
                      >
                         {/* Client Badge */}
                         {post.isClientManaged && (
                           <div className="absolute -top-2 -left-2 z-20 bg-jdl-gold text-black rounded-full p-1 shadow-lg border border-yellow-600 dark:border-yellow-900" title="Post Client">
                             <User size={10} />
                           </div>
                         )}

                         {/* Checkbox Status */}
                         <div 
                            className="absolute top-2 right-2 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                onTogglePublish(post.id);
                            }}
                         >
                             {post.published ? (
                                 <CheckCircle size={18} className="text-green-500 fill-green-100 dark:fill-green-900/50" />
                             ) : (
                                 <Circle size={18} className={`hover:text-gray-900 dark:hover:text-white ${post.isClientManaged ? 'text-yellow-600 dark:text-jdl-gold' : 'text-gray-400'}`} />
                             )}
                         </div>
                         
                         {/* Always visible checkmark if published */}
                         {post.published && (
                             <div className="absolute top-2 right-2 z-10">
                                 <CheckCircle size={18} className="text-green-500 fill-green-100 dark:fill-green-900/50" />
                             </div>
                         )}

                         <div className="flex justify-between items-start pr-4">
                             <div className={`opacity-80 ${post.published ? 'text-gray-500 dark:text-gray-600' : ''}`}>{getFormatIcon(post.format)}</div>
                             <span className="text-[10px] font-bold opacity-50">{post.date}</span>
                         </div>
                         <div>
                             <p className={`text-[10px] uppercase tracking-wide opacity-70 mb-1 line-clamp-1 ${post.published ? 'text-gray-500 dark:text-gray-600' : ''}`}>{post.theme}</p>
                             <p className={`text-xs font-semibold leading-tight line-clamp-3 ${post.published ? 'text-gray-400 dark:text-gray-500 line-through decoration-gray-400 dark:decoration-gray-700' : ''}`}>{post.title}</p>
                         </div>
                      </div>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white text-xs">+ Planifier</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}