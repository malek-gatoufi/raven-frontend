'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { UserPlus, Mail, Lock, User, AlertCircle, Eye, EyeOff, ArrowRight, Check, X } from 'lucide-react';

export default function InscriptionPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    newsletter: false,
    cgv: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Validation du mot de passe
  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
  };
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstname.trim()) errors.firstname = 'Le prénom est requis';
    if (!formData.lastname.trim()) errors.lastname = 'Le nom est requis';
    if (!formData.email.trim()) errors.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email invalide';
    if (!isPasswordValid) errors.password = 'Le mot de passe ne respecte pas les critères';
    if (!passwordsMatch) errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    if (!formData.cgv) errors.cgv = 'Vous devez accepter les CGV';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    try {
      await register({
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        newsletter: formData.newsletter,
      });
      router.push('/compte?welcome=true');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errors' in err) {
        const apiError = err as { errors?: Record<string, string[]> };
        if (apiError.errors) {
          const newFieldErrors: Record<string, string> = {};
          Object.entries(apiError.errors).forEach(([key, messages]) => {
            newFieldErrors[key] = messages[0];
          });
          setFieldErrors(newFieldErrors);
          toast.error('Certains champs contiennent des erreurs');
        }
      }
      // L'erreur générale est déjà affichée via toast dans AuthContext
      console.error(err);
    }
  };

  const PasswordCheck = ({ valid, label }: { valid: boolean; label: string }) => (
    <div className={`flex items-center gap-2 text-sm ${valid ? 'text-[#44D92C]' : 'text-gray-500'}`}>
      {valid ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      <span>{label}</span>
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#44D92C] to-[#2da31e] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#44D92C]/20">
            <UserPlus className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Rejoignez Raven</h1>
          <p className="text-gray-400">Créez votre compte en quelques secondes</p>
        </div>

        <Card className="bg-[#1a1a1a]/80 backdrop-blur-xl border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6 space-y-5">
              {/* Nom et Prénom */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="text-gray-300">Prénom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      id="firstname"
                      name="firstname"
                      type="text"
                      value={formData.firstname}
                      onChange={handleChange}
                      placeholder="Jean"
                      className={`pl-11 bg-white/5 border-white/10 focus:border-[#44D92C] h-12 ${fieldErrors.firstname ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {fieldErrors.firstname && <p className="text-red-400 text-xs">{fieldErrors.firstname}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastname" className="text-gray-300">Nom</Label>
                  <Input
                    id="lastname"
                    name="lastname"
                    type="text"
                    value={formData.lastname}
                    onChange={handleChange}
                    placeholder="Dupont"
                    className={`bg-white/5 border-white/10 focus:border-[#44D92C] h-12 ${fieldErrors.lastname ? 'border-red-500' : ''}`}
                    required
                  />
                  {fieldErrors.lastname && <p className="text-red-400 text-xs">{fieldErrors.lastname}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className={`pl-11 bg-white/5 border-white/10 focus:border-[#44D92C] h-12 ${fieldErrors.email ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {fieldErrors.email && <p className="text-red-400 text-xs">{fieldErrors.email}</p>}
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`pl-11 pr-11 bg-white/5 border-white/10 focus:border-[#44D92C] h-12 ${fieldErrors.password ? 'border-red-500' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="grid grid-cols-2 gap-2 mt-2 p-3 bg-white/5 rounded-lg">
                    <PasswordCheck valid={passwordChecks.length} label="8 caractères min" />
                    <PasswordCheck valid={passwordChecks.uppercase} label="Une majuscule" />
                    <PasswordCheck valid={passwordChecks.lowercase} label="Une minuscule" />
                    <PasswordCheck valid={passwordChecks.number} label="Un chiffre" />
                  </div>
                )}
              </div>

              {/* Confirmer mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`pl-11 bg-white/5 border-white/10 focus:border-[#44D92C] h-12 ${fieldErrors.confirmPassword ? 'border-red-500' : ''}`}
                    required
                  />
                  {formData.confirmPassword && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {passwordsMatch ? (
                        <Check className="w-5 h-5 text-[#44D92C]" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {fieldErrors.confirmPassword && <p className="text-red-400 text-xs">{fieldErrors.confirmPassword}</p>}
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    className="mt-1 rounded border-white/20 bg-white/5 text-[#44D92C] focus:ring-[#44D92C]"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-gray-300">
                    Je souhaite recevoir les offres exclusives et nouveautés par email
                  </span>
                </label>

                <label className={`flex items-start gap-3 cursor-pointer group ${fieldErrors.cgv ? 'text-red-400' : ''}`}>
                  <input
                    type="checkbox"
                    name="cgv"
                    checked={formData.cgv}
                    onChange={handleChange}
                    className="mt-1 rounded border-white/20 bg-white/5 text-[#44D92C] focus:ring-[#44D92C]"
                    required
                  />
                  <span className="text-sm text-gray-400 group-hover:text-gray-300">
                    J&apos;accepte les{' '}
                    <Link href="/cgv" className="text-[#44D92C] hover:underline">
                      conditions générales de vente
                    </Link>{' '}
                    et la{' '}
                    <Link href="/confidentialite" className="text-[#44D92C] hover:underline">
                      politique de confidentialité
                    </Link>
                  </span>
                </label>
                {fieldErrors.cgv && <p className="text-red-400 text-xs">{fieldErrors.cgv}</p>}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-6 pb-6">
              <Button 
                type="submit" 
                className="w-full h-12 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold text-lg transition-all hover:shadow-lg hover:shadow-[#44D92C]/20"
                disabled={isLoading || !isPasswordValid || !passwordsMatch || !formData.cgv}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Création en cours...
                  </span>
                ) : (
                  <>
                    Créer mon compte
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#1a1a1a] text-gray-500">Déjà inscrit ?</span>
                </div>
              </div>

              <Link href="/connexion" className="w-full">
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full h-12 border-white/10 hover:border-[#44D92C] hover:bg-[#44D92C]/10"
                >
                  Se connecter
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
