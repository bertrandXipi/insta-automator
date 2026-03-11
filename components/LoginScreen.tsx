import React, { useState } from 'react';
import { Lock, AlertCircle, Loader2 } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (token: string) => void;
  verifyPassword: (password: string) => Promise<{ success: boolean; token?: string; error?: string }>;
}

export default function LoginScreen({ onLogin, verifyPassword }: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await verifyPassword(password);
      
      if (result.success && result.token) {
        onLogin(result.token);
      } else {
        setError(result.error || 'Mot de passe incorrect');
        setPassword('');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-jdl-red to-jdl-gold rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Jean de Luz
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Planning Éditorial Instagram
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#252525] text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-jdl-red focus:border-transparent transition-all"
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl">
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 px-4 bg-gradient-to-r from-jdl-red to-jdl-gold text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Vérification...</span>
                </>
              ) : (
                <span>Accéder</span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Accès réservé aux utilisateurs autorisés
        </p>
      </div>
    </div>
  );
}
