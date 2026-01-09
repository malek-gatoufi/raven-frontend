'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { customerApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Address } from '@/types/prestashop';
import { ArrowLeft, MapPin, AlertCircle, Check, Trash2 } from 'lucide-react';

export default function EditAddressPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
      router.push(`/connexion?redirect=/compte/adresses/${id}`);
    }
  }, [authLoading, isAuthenticated, router, id]);

  useEffect(() => {
    const loadAddress = async () => {
      if (!isAuthenticated || authLoading) return;
      
      try {
        const addresses = await customerApi.getAddresses();
        const address = addresses.find(a => a.id.toString() === id);
        
        if (address) {
          setFormData({
            alias: address.alias || '',
            firstname: address.firstname || '',
            lastname: address.lastname || '',
            company: address.company || '',
            address1: address.address1 || '',
            address2: address.address2 || '',
            postcode: address.postcode || '',
            city: address.city || '',
            country: address.country || 'France',
            phone: address.phone || '',
            phone_mobile: address.phone_mobile || '',
          });
        } else {
          setError('Adresse non trouvée');
        }
      } catch (err) {
        console.error('Failed to load address:', err);
        setError('Impossible de charger l\'adresse');
      } finally {
        setIsLoading(false);
      }
    };

    loadAddress();
  }, [id, isAuthenticated, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await customerApi.updateAddress(parseInt(id), {
        ...formData,
        alias: formData.alias || 'Mon adresse',
      } as Partial<Address>);
      
      router.push('/compte?tab=addresses');
    } catch (err) {
      console.error('Failed to update address:', err);
      setError('Impossible de mettre à jour l\'adresse. Veuillez vérifier les informations.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await customerApi.deleteAddress(parseInt(id));
      router.push('/compte?tab=addresses');
    } catch (err) {
      console.error('Failed to delete address:', err);
      setError('Impossible de supprimer l\'adresse. Elle est peut-être utilisée par une commande.');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-[#44D92C] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error && !formData.address1) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Adresse non trouvée</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/compte?tab=addresses">
            <Button className="bg-[#44D92C] hover:bg-[#3bc425] text-black">
              Retour aux adresses
            </Button>
          </Link>
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
          <h1 className="text-2xl md:text-3xl font-bold">Modifier l&apos;adresse</h1>
          <p className="text-gray-400">{formData.alias || 'Mon adresse'}</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card className="bg-[#1a1a1a]/80 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#44D92C]" />
              Informations de l&apos;adresse
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Delete confirmation */}
            {showDeleteConfirm && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-red-400 mb-4">Êtes-vous sûr de vouloir supprimer cette adresse ?</p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="border-white/10"
                  >
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isDeleting ? 'Suppression...' : 'Confirmer la suppression'}
                  </Button>
                </div>
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
