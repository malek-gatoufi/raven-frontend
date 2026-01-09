'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/compte';
  const { login, isLoading } = useAuth();
  const toast = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      router.push(redirectTo);
    } catch (err) {
      // L'erreur est déjà affichée via toast dans AuthContext
      console.error(err);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { authApi } = await import('@/lib/api');
      await authApi.forgotPassword(email);
      setForgotSent(true);
      toast.success('Email de réinitialisation envoyé');
    } catch (err) {
      toast.error('Impossible d\'envoyer l\'email. Vérifiez votre adresse.');
      console.error(err);
    }
  };

  if (forgotMode) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="bg-[#1a1a1a]/80 backdrop-blur-xl border-white/10">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-[#44D92C]/20 rounded-2xl flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-[#44D92C]" />
              </div>
              <CardTitle className="text-2xl font-bold">Mot de passe oublié</CardTitle>
              <CardDescription className="text-gray-400">
                {forgotSent 
                  ? "Un email vous a été envoyé avec les instructions de réinitialisation."
                  : "Entrez votre email pour recevoir un lien de réinitialisation"
                }
              </CardDescription>
            </CardHeader>

            {!forgotSent ? (
              <form onSubmit={handleForgotPassword}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="pl-11 bg-white/5 border-white/10 focus:border-[#44D92C] h-12"
                        required
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Envoi...' : 'Envoyer le lien'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>

                  <button
                    type="button"
                    onClick={() => setForgotMode(false)}
                    className="text-gray-400 hover:text-[#44D92C] transition-colors text-sm"
                  >
                    Retour à la connexion
                  </button>
                </CardFooter>
              </form>
            ) : (
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  onClick={() => { setForgotMode(false); setForgotSent(false); }}
                  className="w-full h-12 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold"
                >
                  Retour à la connexion
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#44D92C] to-[#2da31e] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#44D92C]/20">
            <LogIn className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Bon retour !</h1>
          <p className="text-gray-400">Connectez-vous à votre compte Raven Industries</p>
        </div>

        <Card className="bg-[#1a1a1a]/80 backdrop-blur-xl border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6 space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="pl-11 bg-white/5 border-white/10 focus:border-[#44D92C] h-12 transition-colors"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password" className="text-gray-300">Mot de passe</Label>
                  <button
                    type="button"
                    onClick={() => setForgotMode(true)}
                    className="text-sm text-[#44D92C] hover:text-[#3bc425] transition-colors"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-11 pr-11 bg-white/5 border-white/10 focus:border-[#44D92C] h-12 transition-colors"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-6 pb-6">
              <Button 
                type="submit" 
                className="w-full h-12 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold text-lg transition-all hover:shadow-lg hover:shadow-[#44D92C]/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion...
                  </span>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#1a1a1a] text-gray-500">Pas encore de compte ?</span>
                </div>
              </div>

              <Link href="/inscription" className="w-full">
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full h-12 border-white/10 hover:border-[#44D92C] hover:bg-[#44D92C]/10 transition-all"
                >
                  Créer un compte
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>

        {/* Avantages */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center text-sm text-gray-500">
          <div className="p-3 rounded-lg bg-white/5">
            <p className="text-[#44D92C] font-semibold">Livraison rapide</p>
            <p>24-48h en France</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <p className="text-[#44D92C] font-semibold">Paiement sécurisé</p>
            <p>100% sécurisé</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#44D92C]" />
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ConnexionForm />
    </Suspense>
  );
}
