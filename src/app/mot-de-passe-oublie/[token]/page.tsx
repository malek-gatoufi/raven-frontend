'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, AlertCircle, Check, X, ArrowRight, KeyRound, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validation du mot de passe
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      setError('Le mot de passe ne respecte pas les critères de sécurité');
      return;
    }

    if (!passwordsMatch) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);

    try {
      const { authApi } = await import('@/lib/api');
      await authApi.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Le lien de réinitialisation est invalide ou a expiré. Veuillez refaire une demande.');
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordCheck = ({ valid, label }: { valid: boolean; label: string }) => (
    <div className={`flex items-center gap-2 text-sm ${valid ? 'text-[#44D92C]' : 'text-gray-500'}`}>
      {valid ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      <span>{label}</span>
    </div>
  );

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="bg-[#1a1a1a]/80 backdrop-blur-xl border-white/10">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-[#44D92C]/20 rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-[#44D92C]" />
              </div>
              <CardTitle className="text-2xl font-bold">Mot de passe modifié !</CardTitle>
              <CardDescription className="text-gray-400">
                Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex flex-col gap-4">
              <Link href="/connexion" className="w-full">
                <Button className="w-full h-12 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold">
                  Se connecter
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardFooter>
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
            <KeyRound className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Nouveau mot de passe</h1>
          <p className="text-gray-400">Choisissez un mot de passe sécurisé</p>
        </div>

        <Card className="bg-[#1a1a1a]/80 backdrop-blur-xl border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6 space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Nouveau mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Nouveau mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-11 pr-11 bg-white/5 border-white/10 focus:border-[#44D92C] h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                  </button>
                </div>

                {/* Indicateurs de force */}
                {password && (
                  <div className="mt-3 p-3 bg-white/5 rounded-lg space-y-2">
                    <PasswordCheck valid={passwordChecks.length} label="Au moins 8 caractères" />
                    <PasswordCheck valid={passwordChecks.uppercase} label="Une majuscule" />
                    <PasswordCheck valid={passwordChecks.lowercase} label="Une minuscule" />
                    <PasswordCheck valid={passwordChecks.number} label="Un chiffre" />
                  </div>
                )}
              </div>

              {/* Confirmation */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`pl-11 bg-white/5 border-white/10 focus:border-[#44D92C] h-12 ${
                      confirmPassword && !passwordsMatch ? 'border-red-500' : ''
                    }`}
                    required
                  />
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-red-400 text-xs">Les mots de passe ne correspondent pas</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full h-12 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold"
                disabled={isLoading || !isPasswordValid || !passwordsMatch}
              >
                {isLoading ? 'Modification...' : 'Modifier le mot de passe'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Link 
                href="/connexion"
                className="text-gray-400 hover:text-[#44D92C] transition-colors text-sm"
              >
                Retour à la connexion
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
