
import React, { useEffect, useState, useRef } from 'react';
import { Post } from '../types';
import { X, Copy, Image, Hash, MessageCircle, Send, CheckCircle, ChevronLeft, ChevronRight, User, Loader2, Upload, Download, Save, Check, Instagram, Wifi, AlertTriangle, Maximize2 } from 'lucide-react';
import { database } from '../services/database';
import DatePicker from './DatePicker';

interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
  onTogglePublish: (postId: string) => void;
  onUpdate: (post: Post) => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

// Composant interne pour les champs auto-sauvegardés
const AutoSaveField = ({ 
    value, 
    onSave, 
    multiline = false, 
    className = "",
    placeholder = ""
}: { 
    value: string, 
    onSave: (val: string) => void, 
    multiline?: boolean, 
    className?: string,
    placeholder?: string
}) => {
    const [localValue, setLocalValue] = useState(value);
    const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    
    useEffect(() => {
        setLocalValue(value);
        setStatus('idle');
    }, [value]);

    const handleBlur = async () => {
        if (localValue !== value) {
            setStatus('saving');
            await new Promise(r => setTimeout(r, 600)); // UX delay
            onSave(localValue);
            setStatus('saved');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <div className="relative group/field w-full">
            {multiline ? (
                <textarea
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className={`w-full bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-jdl-red focus:bg-gray-100 dark:focus:bg-[#1a1a1a] focus:ring-0 transition-all outline-none resize-none rounded px-2 py-1 -ml-2 ${className}`}
                    rows={6}
                />
            ) : (
                <input
                    type="text"
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className={`w-full bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-jdl-red focus:bg-gray-100 dark:focus:bg-[#1a1a1a] focus:ring-0 transition-all outline-none rounded px-2 py-1 -ml-2 ${className}`}
                />
            )}
            
            {/* Indicateur de sauvegarde */}
            <div className="absolute right-0 -bottom-5 h-4 flex items-center justify-end pointer-events-none">
                {status === 'saving' && (
                    <div className="flex items-center text-xs text-gray-500">
                        <Loader2 size={10} className="animate-spin mr-1" />
                        Sauvegarde...
                    </div>
                )}
                {status === 'saved' && (
                    <div className="flex items-center text-xs text-green-500 font-medium animate-in fade-in slide-in-from-left-2 duration-300">
                        <CheckCircle size={10} className="mr-1" />
                        Sauvegardé
                    </div>
                )}
            </div>
        </div>
    );
};

export default function PostDetailModal({ 
  post, 
  onClose, 
  onTogglePublish, 
  onUpdate,
  onNext, 
  onPrev, 
  hasNext, 
  hasPrev 
}: PostDetailModalProps) {
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [hasCopiedPrompt, setHasCopiedPrompt] = useState(false);
    const [isPublishingToInsta, setIsPublishingToInsta] = useState(false);
    const [publishError, setPublishError] = useState<string | null>(null);
    const [isZoomed, setIsZoomed] = useState(false);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
            
            if (e.key === 'Escape') {
                if (isZoomed) setIsZoomed(false);
                else onClose();
            }
            if (!isInput && !isZoomed) {
                if (e.key === 'ArrowRight' && hasNext) onNext();
                if (e.key === 'ArrowLeft' && hasPrev) onPrev();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onNext, onPrev, hasNext, hasPrev, isZoomed]);

    const updateField = (field: keyof Post, value: any) => {
        onUpdate({ ...post, [field]: value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploading(true);
            try {
                // Utilisation du service centralisé qui gère Storage ou Base64 fallback
                const imageUrl = await database.uploadImage(e.target.files[0]);
                updateField('imageUrl', imageUrl);
            } catch (err) {
                console.error("Failed to upload image", err);
                alert("Erreur lors du chargement de l'image.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleDownloadImage = async () => {
        try {
            let downloadUrl = post.imageUrl;
            let shouldRevoke = false;

            // Si c'est une URL externe (pas base64), on la fetch en blob pour forcer le téléchargement
            // et éviter l'ouverture dans un nouvel onglet
            if (!post.imageUrl.startsWith('data:')) {
                setIsUploading(true); // Indicateur visuel pendant le fetch
                const response = await fetch(post.imageUrl);
                const blob = await response.blob();
                downloadUrl = window.URL.createObjectURL(blob);
                shouldRevoke = true;
            }

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `jean-de-luz-post-${post.id}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            if (shouldRevoke) {
                window.URL.revokeObjectURL(downloadUrl);
            }
        } catch (error) {
            console.error('Erreur téléchargement, fallback classique:', error);
            // Fallback simple si le fetch échoue (CORS strict par exemple)
            window.open(post.imageUrl, '_blank');
        } finally {
            setIsUploading(false);
        }
    };

    const handleCopyPrompt = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(post.visualPrompt);
        setHasCopiedPrompt(true);
        setTimeout(() => setHasCopiedPrompt(false), 2000);
    };

    const handleInstagramPublish = async () => {
        if (post.published) return;
        
        setIsPublishingToInsta(true);
        setPublishError(null);
        
        try {
            const result = await database.publishToInstagram(post);
            if (!result.success) {
                setPublishError(result.message || "Échec de la publication.");
            }
            // Si succès, l'état 'published' sera mis à jour via le service et répercuté ici via les props
        } catch (e: any) {
            console.error(e);
            setPublishError(e.message || "Erreur technique lors de l'envoi.");
        } finally {
            setIsPublishingToInsta(false);
        }
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Navigation Buttons */}
      {!isZoomed && hasPrev && (
        <button 
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all border border-white/10 z-50 hidden md:flex"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {!isZoomed && hasNext && (
        <button 
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all border border-white/10 z-50 hidden md:flex"
        >
          <ChevronRight size={32} />
        </button>
      )}
      
      <div className={`relative w-full max-w-5xl bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden border flex flex-col md:flex-row max-h-[90vh] z-10 ${post.isClientManaged ? 'border-yellow-400 dark:border-jdl-gold' : 'border-gray-200 dark:border-gray-800'}`}>
        
        {/* Client Banner Overlay */}
        {post.isClientManaged && (
          <div className="absolute top-0 left-0 w-full bg-jdl-gold text-black text-center text-xs font-bold uppercase tracking-widest py-1 z-30 flex items-center justify-center">
            <User size={12} className="mr-2" />
            Post géré par l'équipe (Client)
          </div>
        )}

        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-6 right-4 z-40 p-2 bg-black/50 hover:bg-jdl-red text-white rounded-full transition-colors backdrop-blur-md"
        >
            <X size={20} />
        </button>

        {/* Left: Visual Preview & Image Management */}
        <div 
            className="w-full md:w-5/12 bg-gray-100 dark:bg-black relative flex items-center justify-center group h-64 md:h-auto shrink-0 mt-6 md:mt-0 overflow-hidden cursor-zoom-in"
            onClick={() => setIsZoomed(true)}
        >
            {/* Image display */}
            <img 
                src={post.imageUrl} 
                alt={post.title} 
                className={`w-full h-full object-cover transition-opacity duration-300 ${isUploading ? 'opacity-50 blur-sm' : 'opacity-90'}`}
            />
            
            {/* Loading Spinner */}
            {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <Loader2 size={48} className="text-jdl-red animate-spin" />
                </div>
            )}

            {/* Hover Actions Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-4 z-10 backdrop-blur-[2px]">
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden" 
                    accept="image/*"
                />
                
                <div 
                    className="flex flex-col space-y-3"
                    onClick={(e) => e.stopPropagation()} // Empêche le zoom quand on clique sur les boutons
                >
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-gray-200 transition-transform hover:scale-105 shadow-lg w-full justify-center"
                    >
                        <Upload size={18} />
                        <span>Changer l'image</span>
                    </button>

                    <div className="flex space-x-2">
                        <button 
                            onClick={handleDownloadImage}
                            className="flex-1 flex items-center justify-center space-x-2 bg-black/50 text-white px-4 py-2 rounded-full font-medium hover:bg-black border border-white/20 transition-transform hover:scale-105"
                        >
                            <Download size={18} />
                            <span>DL</span>
                        </button>
                        
                        <button 
                            onClick={() => setIsZoomed(true)}
                            className="flex-1 flex items-center justify-center space-x-2 bg-black/50 text-white px-4 py-2 rounded-full font-medium hover:bg-black border border-white/20 transition-transform hover:scale-105"
                        >
                            <Maximize2 size={18} />
                            <span>Zoom</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Prompt Text Overlay - Always dark for contrast with image/overlay */}
            <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-20">
                <div className="flex items-center justify-between mb-2 pointer-events-auto">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-lg p-2 md:p-3 inline-flex items-center space-x-2 text-sm text-white font-medium">
                        <Image size={16} />
                        <span className="hidden md:inline">Prompt Visuel</span>
                    </div>
                    
                    <button 
                        onClick={handleCopyPrompt}
                        className={`p-2 rounded-lg backdrop-blur-md border transition-all pointer-events-auto ${hasCopiedPrompt ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-white/10 hover:bg-white/20 text-white border-white/10'}`}
                        title="Copier le prompt"
                    >
                        {hasCopiedPrompt ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                </div>
                <div className="pointer-events-auto">
                     <AutoSaveField 
                        value={post.visualPrompt}
                        onSave={(val) => updateField('visualPrompt', val)}
                        multiline={true}
                        className="text-gray-300 italic text-sm border-l-2 border-jdl-red pl-3"
                        placeholder="Décrivez l'image souhaitée..."
                     />
                </div>
            </div>
        </div>

        {/* Right: The "Fiche" Content */}
        <div className="w-full md:w-7/12 flex flex-col flex-1 min-h-0 bg-white dark:bg-[#1a1a1a] overflow-hidden pt-4 md:pt-0">
            
            {/* Scrollable Area */}
            <div className="px-6 py-4 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                
                {/* Header Info */}
                <div className="flex items-center justify-between mb-6 pr-12">
                    <div className="flex items-center space-x-2 md:space-x-3">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-jdl-blue rounded text-[10px] md:text-xs font-bold text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-900">
                            S{post.week}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-[#252525] rounded text-[10px] md:text-xs font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 uppercase">
                            {post.day.substring(0, 3)}.
                        </span>
                        <span className="px-2 py-1 bg-red-100 dark:bg-jdl-red/20 text-red-700 dark:text-jdl-red rounded text-[10px] md:text-xs font-bold border border-red-200 dark:border-jdl-red/30">
                            {post.format}
                        </span>
                    </div>
                     <DatePicker 
                        value={post.date} 
                        onSave={(newDate, dayName, weekNumber) => {
                          onUpdate({ ...post, date: newDate, day: dayName, week: weekNumber });
                        }} 
                     />
                </div>

                <div className="mb-2">
                    <AutoSaveField 
                        value={post.title} 
                        onSave={(val) => updateField('title', val)}
                        className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white bg-transparent"
                        placeholder="Titre du post"
                    />
                </div>
                
                {post.isClientManaged && (
                   <p className="text-yellow-600 dark:text-jdl-gold text-xs md:text-sm italic mb-2 font-medium">
                      ⚠️ À réaliser et poster par l'entreprise
                   </p>
                )}

                <p className="text-gray-500 dark:text-gray-500 font-medium mb-6 flex items-center text-sm">
                    Thème : <span className="text-gray-800 dark:text-gray-300 ml-2">{post.theme}</span>
                </p>

                {/* Main Content Fields */}
                <div className="space-y-8 md:space-y-10 pb-4">
                    
                    {/* Caption */}
                    <div className={`bg-gray-50 dark:bg-[#252525] rounded-xl p-4 md:p-5 border relative group ${post.isClientManaged ? 'border-yellow-200 dark:border-jdl-gold/30' : 'border-gray-200 dark:border-gray-800'}`}>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden md:block">
                             <button 
                                onClick={() => navigator.clipboard.writeText(post.caption)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white" 
                                title="Copier"
                             >
                                <Copy size={16} />
                             </button>
                        </div>
                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 flex items-center">
                            <MessageCircle size={14} className="mr-2" /> Légende Instagram
                        </h3>
                        <AutoSaveField 
                            value={post.caption}
                            onSave={(val) => updateField('caption', val)}
                            multiline={true}
                            className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed min-h-[120px]"
                            placeholder="Rédigez la légende ici..."
                        />
                    </div>

                    {/* Hashtags */}
                    <div className="bg-gray-50 dark:bg-[#252525] rounded-xl p-4 md:p-5 border border-gray-200 dark:border-gray-800">
                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 flex items-center">
                            <Hash size={14} className="mr-2" /> Hashtags Stratégiques
                        </h3>
                        <div className="relative">
                            <AutoSaveField 
                                value={post.hashtags.join(' ')}
                                onSave={(val) => {
                                    // Parse string back to array, filter empty
                                    const tags = val.split(/[\s\n]+/).filter(t => t.trim() !== '');
                                    // Ensure they start with #
                                    const cleanTags = tags.map(t => t.startsWith('#') ? t : `#${t}`);
                                    updateField('hashtags', cleanTags);
                                }}
                                multiline={true}
                                className="text-blue-600 dark:text-blue-400 text-sm font-medium min-h-[60px]"
                                placeholder="#Ajouter #des #hashtags"
                            />
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-gradient-to-r from-red-50 to-transparent dark:from-jdl-red/10 rounded-xl p-4 md:p-5 border border-red-100 dark:border-jdl-red/20 mb-4">
                        <h3 className="text-xs font-bold text-jdl-red uppercase tracking-widest mb-2 flex items-center">
                            <Send size={14} className="mr-2" /> Call to Action (CTA)
                        </h3>
                        <AutoSaveField 
                            value={post.cta}
                            onSave={(val) => updateField('cta', val)}
                            className="text-gray-900 dark:text-white font-medium text-base md:text-lg"
                            placeholder="Incitation à l'action..."
                        />
                    </div>
                </div>
            </div>

            {/* Footer Actions - Always visible at bottom */}
            <div className="p-4 md:p-8 border-t border-gray-200 dark:border-[#252525] bg-gray-50 dark:bg-[#1a1a1a] mt-auto shrink-0 z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
                {publishError && (
                    <div className="mb-4 text-xs text-red-500 flex items-center justify-center animate-pulse">
                        <AlertTriangle size={12} className="mr-1" />
                        {publishError}
                    </div>
                )}
                
                <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-0">
                    <div className="text-xs text-gray-400 dark:text-gray-500 font-mono hidden md:block">
                        ID: {post.id}
                    </div>
                    <div className="flex space-x-3 w-full md:w-auto">
                        <button 
                            onClick={onClose}
                            className="flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-700"
                        >
                            Fermer
                        </button>

                        {/* BOUTON DE PUBLICATION INSTAGRAM (PRIMARY) */}
                        {!post.published ? (
                           <button 
                                onClick={handleInstagramPublish}
                                disabled={isPublishingToInsta}
                                className="flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-lg font-bold text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isPublishingToInsta ? (
                                    <>
                                       <Loader2 size={18} className="animate-spin" />
                                       <span>Envoi au serveur...</span>
                                    </>
                                ) : (
                                    <>
                                       <Instagram size={18} />
                                       <span>Publier sur Instagram</span>
                                    </>
                                )}
                            </button>
                        ) : (
                             /* ETAT PUBLIÉ */
                            <div className="flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-lg font-bold flex items-center justify-center space-x-2 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-500 border border-green-200 dark:border-green-500/50 cursor-default">
                                <CheckCircle size={18} />
                                <span>Publié en ligne</span>
                            </div>
                        )}
                        
                        {/* TOGGLE MANUEL (SECONDARY) - Affiché seulement si pas publié pour permettre le fallback, ou pour dépublier */}
                        {post.published && (
                            <button 
                                onClick={() => onTogglePublish(post.id)}
                                className="p-2.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                title="Annuler la publication (Local)"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* FULL SCREEN IMAGE ZOOM MODAL */}
      {isZoomed && (
          <div 
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center animate-in fade-in duration-200"
            onClick={() => setIsZoomed(false)}
          >
              <button 
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-black/50 hover:bg-white/10 rounded-full transition-colors"
                onClick={() => setIsZoomed(false)}
              >
                  <X size={32} />
              </button>
              
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="max-h-screen max-w-screen object-contain p-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()} // Prevent close when clicking image
              />
          </div>
      )}

    </div>
  );
}
