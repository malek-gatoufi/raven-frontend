'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { customerApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Address } from '@/types/prestashop';
import { ArrowLeft, MapPin, AlertCircle, Check } from 'lucide-react';

export default function NewAddressPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, customer } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    alias: '',
    firstname: '',
    lastname: '',
    company: '',
    address1: '',
    address2: '',
    postcode: '',
    city: '',
    country: 'France',
    phone: '',
    phone_mobile: '',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/connexion?redirect=/compte/adresses/nouvelle');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (customer) {
      setFormData(prev => ({
        ...prev,
        firstname: customer.firstname || '',
        lastname: customer.lastname || '',
      }));
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await customerApi.addAddress({
        ...formData,
        alias: formData.alias || 'Mon adresse',
      } as Omit<Address, 'id'>);
      
      router.push('/compte?tab=addresses');
    } catch (err) {
      console.error('Failed to add address:', err);
      setError('Impossible d\'ajouter l\'adresse. Veuillez vérifier les informations.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-[#44D92C] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/compte?tab=addresses" className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Nouvelle adresse</h1>
          <p className="text-gray-400">Ajoutez une adresse de livraison ou facturation</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card className="bg-[#1a1a1a]/80 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#44D92C]" />
              Informations de l&apos;adresse
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="alias">Nom de l&apos;adresse</Label>
                <Input
                  id="alias"
                  placeholder="Ex: Maison, Bureau, Travail..."
                  value={formData.alias}
                  onChange={(e) => setFormData({...formData, alias: e.target.value})}
                  className="mt-1 bg-white/5 border-white/10 focus:border-[#44D92C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstname">Prénom *</Label>
                  <Input
                    id="firstname"
                    required
                    value={formData.firstname}
                    onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                    className="mt-1 bg-white/5 border-white/10 focus:border-[#44D92C]"
                  />
                </div>
                <div>
                  <Label htmlFor="lastname">Nom *</Label>
                  <Input
                    id="lastname"
                    required
                    value={formData.lastname}
                    onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                    className="mt-1 bg-white/5 border-white/10 focus:border-[#44D92C]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company">Société (optionnel)</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="mt-1 bg-white/5 border-white/10 focus:border-[#44D92C]"
                />
              </div>

              <div>
                <Label htmlFor="address1">Adresse *</Label>
                <Input
                  id="address1"
                  required
                  value={formData.address1}
                  onChange={(e) => setFormData({...formData, address1: e.target.value})}
                  className="mt-1 bg-white/5 border-white/10 focus:border-[#44D92C]"
                />
              </div>

              <div>
                <Label htmlFor="address2">Complément d&apos;adresse</Label>
                <Input
                  id="address2"
                  placeholder="Appartement, étage, bâtiment..."
                  value={formData.address2}
                  onChange={(e) => setFormData({...formData, address2: e.target.value})}
                  className="mt-1 bg-white/5 border-white/10 focus:border-[#44D92C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postcode">Code postal *</Label>
                  <Input
                    id="postcode"
                    required
                    value={formData.postcode}
                    onChange={(e) => setFormData({...formData, postcode: e.target.value})}
                    className="mt-1 bg-white/5 border-white/10 focus:border-[#44D92C]"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="mt-1 bg-white/5 border-white/10 focus:border-[#44D92C]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="mt-1 bg-white/5 border-white/10 focus:border-[#44D92C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone fixe</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="mt-1 bg-white/5 border-white/10 focus:border-[#44D92C]"
                  />
                </div>
                <div>
                  <Label htmlFor="phone_mobile">Téléphone mobile</Label>
                  <Input
                    id="phone_mobile"
                    type="tel"
                    value={formData.phone_mobile}
                    onChange={(e) => setFormData({...formData, phone_mobile: e.target.value})}
                    className="mt-1 bg-white/5 border-white/10 focus:border-[#44D92C]"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Link href="/compte?tab=addresses" className="flex-1">
                  <Button type="button" variant="outline" className="w-full border-white/10">
                    Annuler
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  className="flex-1 bg-[#44D92C] hover:bg-[#3bc425] text-black"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enregistrement...' : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Enregistrer
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
