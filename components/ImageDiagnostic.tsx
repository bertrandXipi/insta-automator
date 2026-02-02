import React, { useEffect, useState } from 'react';
import { Post } from '../types';
import { database } from '../services/database';
import { X, AlertTriangle, CheckCircle, Copy } from 'lucide-react';

interface ImageDiagnosticProps {
  onClose: () => void;
}

export default function ImageDiagnostic({ onClose }: ImageDiagnosticProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageImages, setStorageImages] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allPosts = await database.getAllPosts();
      // Filtrer décembre et janvier (posts p1 à p30)
      const decJanPosts = allPosts.filter(p => {
        const num = parseInt(p.id.replace('p', '').replace('c', ''));
        return num >= 1 && num <= 30;
      }).sort((a, b) => {
        const numA = parseInt(a.id.replace('p', '').replace('c', ''));
        const numB = parseInt(b.id.replace('p', '').replace('c', ''));
        return numA - numB;
      });
      setPosts(decJanPosts);
    } catch (error) {
      console.error('Erreur chargement posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPlaceholder = (url: string) => {
    return url.includes('picsum.photos');
  };

  const isSupabaseStorage = (url: string) => {
    return url.includes('supabase.co/storage');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const placeholderCount = posts.filter(p => isPlaceholder(p.imageUrl)).length;
  const supabaseCount = posts.filter(p => isSupabaseStorage(p.imageUrl)).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="text-orange-500" size={24} />
              Diagnostic Images Décembre-Janvier
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Vérification des URLs d'images des posts p1 à p30
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Stats */}
        <div className="p-6 bg-gray-50 dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</div>
              <div className="text-sm text-gray-500">Total posts</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-900">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{placeholderCount}</div>
              <div className="text-sm text-red-600 dark:text-red-400">Images placeholder (picsum)</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-900">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{supabaseCount}</div>
              <div className="text-sm text-green-600 dark:text-green-400">Images Supabase Storage</div>
            </div>
          </div>
        </div>

        {/* Liste des posts */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
              <p className="mt-4 text-gray-500">Chargement...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map(post => {
                const isPlaceholderImg = isPlaceholder(post.imageUrl);
                const isSupabaseImg = isSupabaseStorage(post.imageUrl);
                
                return (
                  <div
                    key={post.id}
                    className={`p-4 rounded-lg border ${
                      isPlaceholderImg
                        ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900'
                        : 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Image preview */}
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Error';
                        }}
                      />
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                            {post.id}
                          </span>
                          <span className="text-xs text-gray-500">{post.date}</span>
                          {isPlaceholderImg ? (
                            <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
                              ⚠️ PLACEHOLDER
                            </span>
                          ) : (
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                              ✓ OK
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          {post.title}
                        </p>
                        
                        {/* URL */}
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-xs bg-white dark:bg-[#0a0a0a] px-2 py-1 rounded border border-gray-200 dark:border-gray-800 overflow-x-auto">
                            {post.imageUrl}
                          </code>
                          <button
                            onClick={() => copyToClipboard(post.imageUrl)}
                            className="p-1 hover:bg-white dark:hover:bg-[#0a0a0a] rounded transition-colors"
                            title="Copier l'URL"
                          >
                            <Copy size={14} className="text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0a0a]">
          <div className="flex items-start gap-3 text-sm">
            <AlertTriangle size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="text-gray-600 dark:text-gray-400">
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                Les images placeholder (picsum.photos) ont écrasé les vraies images
              </p>
              <p>
                Les vraies images sont peut-être encore dans le Storage Supabase (bucket posts-images).
                Va dans ton dashboard Supabase → Storage → posts-images pour les récupérer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
