import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  Calendar as CalendarIcon, 
  Image as ImageIcon, 
  Menu,
  PlusCircle,
  Home,
  RefreshCw,
  Database,
  HardDrive,
  Sun,
  Moon,
  Instagram,
  BarChart3
} from 'lucide-react';
import { NavItem, Post, InstagramAccount } from './types';
import StrategyView from './components/StrategyView';
import CalendarView from './components/CalendarView';
import AssetLibrary from './components/AssetLibrary';
import PostDetailModal from './components/PostDetailModal';
import HomeView from './components/HomeView';
import StatisticsView from './components/StatisticsView';
import { database } from './services/database';
import { APP_VERSION } from './constants';

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'statistics', label: 'Bilan & Performance', icon: BarChart3 },
  { id: 'strategy', label: 'Vue Détaillée', icon: LayoutGrid },
  { id: 'calendar', label: 'Calendrier Éditorial', icon: CalendarIcon },
  { id: 'assets', label: 'Bibliothèque Visuelle', icon: ImageIcon },
  { id: 'statistics', label: 'Bilan & Stats', icon: BarChart3 },
];

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Data State
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'offline'>('connected');
  const [providerName, setProviderName] = useState('Local Storage');
  
  // Instagram OAuth State
  const [instagramAccount, setInstagramAccount] = useState<InstagramAccount | null>(null);
  const [isConnectingInstagram, setIsConnectingInstagram] = useState(false);
  
  // User ID (pour l'instant on utilise un ID fixe, à remplacer par auth plus tard)
  const USER_ID = 'default-user';
  
  // Initial Load & Realtime Subscription
  useEffect(() => {
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('jdl-theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    loadData();
    setProviderName(database.getProviderName());
    loadInstagramStatus();

    const unsubscribe = database.subscribeToChanges((updatedPost) => {
      setPosts(currentPosts => 
        currentPosts.map(p => p.id === updatedPost.id ? updatedPost : p)
      );

      if (selectedPost && selectedPost.id === updatedPost.id) {
        setSelectedPost(currentSelected => {
          if (currentSelected && currentSelected.id === updatedPost.id) {
            return updatedPost;
          }
          return currentSelected;
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Theme Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('jdl-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await database.getAllPosts();
      setPosts(sortPostsByDate(data));
      setConnectionStatus('connected');
    } catch (error) {
      console.error("Erreur de chargement", error);
      setConnectionStatus('offline');
    } finally {
      setIsLoading(false);
    }
  };

  const loadInstagramStatus = async () => {
    const status = await database.getInstagramStatus(USER_ID);
    setInstagramAccount(status);
    
    // Vérifier les paramètres URL après callback OAuth
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('instagram_connected') === 'true') {
      // Recharger le statut après connexion réussie
      const newStatus = await database.getInstagramStatus(USER_ID);
      setInstagramAccount(newStatus);
      // Nettoyer l'URL
      window.history.replaceState({}, '', window.location.pathname);
    }
    if (urlParams.get('instagram_error')) {
      console.error('Instagram OAuth error:', urlParams.get('instagram_error'));
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const handleConnectInstagram = async () => {
    setIsConnectingInstagram(true);
    try {
      const authUrl = await database.initiateInstagramAuth(USER_ID);
      if (authUrl) {
        window.location.href = authUrl;
      }
    } catch (e) {
      console.error('Erreur connexion Instagram:', e);
    } finally {
      setIsConnectingInstagram(false);
    }
  };

  const handleDisconnectInstagram = async () => {
    if (confirm('Voulez-vous vraiment déconnecter votre compte Instagram ?')) {
      const success = await database.disconnectInstagram(USER_ID);
      if (success) {
        setInstagramAccount({ connected: false });
      }
    }
  };

  const handleTogglePublish = async (postId: string) => {
    setPosts(current => current.map(p => p.id === postId ? { ...p, published: !p.published } : p));
    
    setIsSaving(true);
    try {
      const updatedPosts = await database.togglePublishStatus(postId);
      setPosts(updatedPosts);
      
      if (selectedPost && selectedPost.id === postId) {
        const updated = updatedPosts.find(p => p.id === postId);
        if (updated) setSelectedPost(updated);
      }
    } catch (err) {
      console.error("Erreur sauvegarde", err);
      loadData(); 
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction utilitaire pour parser et comparer les dates au format "DD/MM"
  const parseDate = (dateStr: string): number => {
    const [day, month] = dateStr.split('/').map(Number);
    return month * 100 + day; // Ex: "05/12" -> 1205, "15/01" -> 115
  };

  const sortPostsByDate = (postsToSort: Post[]): Post[] => {
    return [...postsToSort].sort((a, b) => parseDate(a.date) - parseDate(b.date));
  };

  const handleUpdatePost = async (updatedPost: Post) => {
    setPosts(current => {
      const updated = current.map(p => p.id === updatedPost.id ? updatedPost : p);
      return sortPostsByDate(updated);
    });
    if (selectedPost?.id === updatedPost.id) {
        setSelectedPost(updatedPost);
    }

    try {
        await database.updatePost(updatedPost);
    } catch (err) {
        console.error("Failed to save post update", err);
    }
  };

  const currentPostIndex = selectedPost ? posts.findIndex(p => p.id === selectedPost.id) : -1;
  const hasPrev = currentPostIndex > 0;
  const hasNext = currentPostIndex < posts.length - 1;

  const handlePrevPost = () => {
    if (hasPrev) setSelectedPost(posts[currentPostIndex - 1]);
  };

  const handleNextPost = () => {
    if (hasNext) setSelectedPost(posts[currentPostIndex + 1]);
  };

  const handleForceUpdate = () => {
    if (confirm("Ceci va recharger l'application pour être sûr d'avoir la dernière version. Continuer ?")) {
       window.location.reload();
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 space-y-4">
          <RefreshCw className="animate-spin text-jdl-red" size={48} />
          <p>Chargement des données...</p>
        </div>
      );
    }

    switch (currentView) {
      case 'home':
        return <HomeView posts={posts} onPostClick={setSelectedPost} />;
      case 'statistics':
        return <StatisticsView />;
      case 'strategy':
        return <StrategyView onPostClick={setSelectedPost} posts={posts} />;
      case 'calendar':
        return <CalendarView onPostClick={setSelectedPost} posts={posts} onTogglePublish={handleTogglePublish} />;
      case 'assets':
        return <AssetLibrary />;
      case 'statistics':
        return <StatisticsView />;
      default:
        return <HomeView posts={posts} onPostClick={setSelectedPost} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-jdl-text font-sans selection:bg-jdl-red selection:text-white transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col bg-white dark:bg-jdl-dark border-r border-gray-200 dark:border-[#252525] transition-all duration-300 ease-in-out z-30 shadow-sm`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-jdl-red to-red-800 rounded-lg flex items-center justify-center shadow-md">
                 <span className="font-serif font-bold text-white text-lg">J</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Jean de Luz</span>
            </div>
          ) : (
             <div className="w-8 h-8 bg-gradient-to-br from-jdl-red to-red-800 rounded-lg flex items-center justify-center mx-auto shadow-md">
                 <span className="font-serif font-bold text-white text-lg">J</span>
              </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                currentView === item.id 
                  ? 'bg-jdl-red text-white shadow-lg shadow-red-900/20' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#252525] hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon size={20} className={currentView === item.id ? 'text-white' : 'text-gray-500 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white'} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer Sidebar (Theme, Version & Update) */}
        <div className="p-4 border-t border-gray-200 dark:border-[#252525]">
          
          {isSidebarOpen && (
            <div className="mb-4 bg-gray-100 dark:bg-[#1a1a1a] rounded-lg p-3 border border-gray-200 dark:border-gray-800 space-y-3">
               
               {/* Instagram Status */}
               {instagramAccount?.connected ? (
                 <div className="space-y-2">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-2">
                        <Instagram size={14} className="text-pink-600" />
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                          @{instagramAccount.username || 'Compte lié'}
                        </span>
                     </div>
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   </div>
                   <button
                     onClick={handleDisconnectInstagram}
                     className="text-[10px] text-gray-400 hover:text-red-500 transition-colors"
                   >
                     Déconnecter
                   </button>
                 </div>
               ) : (
                 <button
                   onClick={handleConnectInstagram}
                   disabled={isConnectingInstagram}
                   className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50"
                 >
                   <Instagram size={14} />
                   <span>{isConnectingInstagram ? 'Connexion...' : 'Connecter Instagram'}</span>
                 </button>
               )}
               
               <div className="h-px bg-gray-200 dark:bg-gray-700"></div>

               <div className="flex items-center justify-between">
                 <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Thème</p>
                 </div>
                 <button 
                  onClick={toggleTheme}
                  className="p-1.5 rounded-full bg-white dark:bg-gray-800 text-yellow-500 dark:text-blue-200 shadow-sm border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform"
                 >
                   {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                 </button>
               </div>
               
               <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Version</p>
                  <p className="text-xs text-gray-900 dark:text-white font-mono">{APP_VERSION}</p>
               </div>
               
               <button 
                onClick={handleForceUpdate}
                className="w-full bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-white dark:hover:text-black text-gray-700 dark:text-gray-300 text-xs py-2 rounded transition-colors flex items-center justify-center border border-gray-200 dark:border-gray-700"
               >
                 <RefreshCw size={12} className="mr-2" />
                 Mettre à jour
               </button>
            </div>
          )}

          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-gray-50 dark:bg-[#121212] transition-colors duration-300">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 dark:border-[#252525] bg-white/80 dark:bg-[#121212]/90 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center space-x-4">
             <h1 className="text-xl font-bold text-gray-900 dark:text-white">
               {NAV_ITEMS.find(n => n.id === currentView)?.label}
             </h1>
             {isSaving && (
               <span className="flex items-center text-xs text-gray-500 animate-pulse">
                 <RefreshCw size={12} className="mr-1 animate-spin" />
                 Sauvegarde...
               </span>
             )}
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="hidden md:flex items-center space-x-6 mr-6 border-r border-gray-200 dark:border-gray-800 pr-6">
                <div className="text-center">
                    <span className="block text-xs text-gray-500 uppercase tracking-wider font-bold">Objectif</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">30 Posts</span>
                </div>
                 <div className="text-center">
                    <span className="block text-xs text-gray-500 uppercase tracking-wider font-bold">Durée</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">8 Semaines</span>
                </div>
             </div>

             {/* Connection Status Badge */}
             <div 
               className="hidden lg:flex items-center space-x-2 bg-gray-100 dark:bg-[#1a1a1a] px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 mr-2 cursor-help"
               title="Vos modifications sont synchronisées en temps réel avec l'équipe"
             >
                {connectionStatus === 'connected' ? (
                  <>
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full absolute top-0 left-0 animate-ping opacity-75"></div>
                    </div>
                    {providerName.includes('Supabase') ? (
                       <Database size={12} className="text-gray-500 dark:text-gray-400 mx-1" />
                    ) : (
                       <HardDrive size={12} className="text-gray-500 dark:text-gray-400 mx-1" />
                    )}
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{providerName}</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-xs font-medium text-red-500 dark:text-red-400">Déconnecté</span>
                  </>
                )}
             </div>

            <button className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center space-x-2 shadow-sm">
              <PlusCircle size={16} />
              <span className="hidden sm:inline">Nouveau Post</span>
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
           {/* Background subtle gradient */}
           <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 dark:from-jdl-blue/10 to-transparent pointer-events-none" />
           
           <div className="relative z-10 max-w-7xl mx-auto">
             {renderContent()}
           </div>
        </div>
      </main>

      {/* Modal */}
      {selectedPost && (
        <PostDetailModal 
            post={posts.find(p => p.id === selectedPost.id) || selectedPost} 
            onClose={() => setSelectedPost(null)} 
            onTogglePublish={handleTogglePublish}
            onUpdate={handleUpdatePost}
            onNext={handleNextPost}
            onPrev={handlePrevPost}
            hasNext={hasNext}
            hasPrev={hasPrev}
        />
      )}
    </div>
  );
}