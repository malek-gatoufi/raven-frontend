'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { customerApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Order, Address } from '@/types/prestashop';
import {
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Eye,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Check,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Shield,
} from 'lucide-react';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { customer, isAuthenticated, isLoading: authLoading, logout, refreshCustomer } = useAuth();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(searchParams.get('welcome') === 'true');

  // Formulaire profil
  const [profileForm, setProfileForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    birthday: '',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Formulaire mot de passe
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/connexion?redirect=/compte');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (customer) {
      setProfileForm({
        firstname: customer.firstname || '',
        lastname: customer.lastname || '',
        email: customer.email || '',
        birthday: customer.birthday || '',
      });
    }
  }, [customer]);

  async function loadData() {
    setIsLoadingData(true);
    try {
      const [ordersRes, addressesRes] = await Promise.all([
        customerApi.getOrders(),
        customerApi.getAddresses(),
      ]);
      setOrders(ordersRes.data);
      setAddresses(addressesRes);
    } catch (err) {
      console.error('Failed to load account data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoadingData(false);
    }
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccess(false);
    
    try {
      await customerApi.updateProfile(profileForm);
      await refreshCustomer();
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
      console.error(err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }
    
    setIsSavingPassword(true);
    
    try {
      await customerApi.changePassword(passwordForm.current, passwordForm.new);
      setPasswordForm({ current: '', new: '', confirm: '' });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setPasswordError('Mot de passe actuel incorrect');
      console.error(err);
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) return;
    
    try {
      await customerApi.deleteAddress(id);
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error(err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getOrderStatusIcon = (state: number) => {
    switch (state) {
      case 1: // En attente
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 2: // Paiement accepté
        return <Check className="w-4 h-4 text-green-500" />;
      case 3: // Préparation
        return <Package className="w-4 h-4 text-blue-500" />;
      case 4: // Expédié
        return <Truck className="w-4 h-4 text-purple-500" />;
      case 5: // Livré
        return <CheckCircle className="w-4 h-4 text-[#44D92C]" />;
      case 6: // Annulé
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
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

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome message */}
      {showWelcome && (
        <div className="bg-[#44D92C]/10 border border-[#44D92C]/20 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-[#44D92C]" />
            <p className="text-[#44D92C]">Bienvenue {customer?.firstname} ! Votre compte a été créé avec succès.</p>
          </div>
          <button onClick={() => setShowWelcome(false)} className="text-gray-500 hover:text-white">×</button>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-400">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-gray-500 hover:text-white">×</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#44D92C] to-[#2da31e] rounded-xl flex items-center justify-center">
            <User className="w-8 h-8 text-black" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Bonjour, {customer?.firstname} !
            </h1>
            <p className="text-gray-400">{customer?.email}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#1a1a1a] border border-white/10 p-1 flex-wrap h-auto">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#44D92C] data-[state=active]:text-black">
            <User className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-[#44D92C] data-[state=active]:text-black">
            <Package className="w-4 h-4 mr-2" />
            Commandes
          </TabsTrigger>
          <TabsTrigger value="addresses" className="data-[state=active]:bg-[#44D92C] data-[state=active]:text-black">
            <MapPin className="w-4 h-4 mr-2" />
            Adresses
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-[#44D92C] data-[state=active]:text-black">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dernières commandes */}
            <Card className="md:col-span-2 bg-[#1a1a1a]/80 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Dernières commandes</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setActiveTab('orders')}
                  className="text-[#44D92C] hover:text-[#3bc425]"
                >
                  Voir tout
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                {isLoadingData ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-2 border-[#44D92C] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune commande pour le moment</p>
                    <Link href="/category/2-accueil">
                      <Button className="mt-4 bg-[#44D92C] hover:bg-[#3bc425] text-black">
                        Parcourir les produits
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <Link 
                        key={order.id} 
                        href={`/compte/commandes/${order.reference}`}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {getOrderStatusIcon(order.current_state)}
                          <div>
                            <p className="font-semibold">{order.reference}</p>
                            <p className="text-sm text-gray-500">{formatDate(order.date_add)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#44D92C]">{formatPrice(order.total_paid)}</p>
                          <p className="text-sm text-gray-500">{order.state_name}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Infos rapides */}
            <Card className="bg-[#1a1a1a]/80 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Mes informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-semibold">{customer?.firstname} {customer?.lastname}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{customer?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Adresses enregistrées</p>
                  <p className="font-semibold">{addresses.length}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-white/10 hover:border-[#44D92C]"
                  onClick={() => setActiveTab('settings')}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Modifier mes infos
                </Button>
              </CardContent>
            </Card>

            {/* Raccourcis */}
            <Card className="md:col-span-2 lg:col-span-3 bg-[#1a1a1a]/80 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Raccourcis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link 
                    href="/compte/bons-reduction"
                    className="flex flex-col items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#44D92C]/10 flex items-center justify-center mb-3 group-hover:bg-[#44D92C]/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#44D92C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Bons de réduction</span>
                  </Link>
                  <Link 
                    href="/compte/retours"
                    className="flex flex-col items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#44D92C]/10 flex items-center justify-center mb-3 group-hover:bg-[#44D92C]/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#44D92C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Mes retours</span>
                  </Link>
                  <Link 
                    href="/compte/avoirs"
                    className="flex flex-col items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#44D92C]/10 flex items-center justify-center mb-3 group-hover:bg-[#44D92C]/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#44D92C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Mes avoirs</span>
                  </Link>
                  <Link 
                    href="/contact"
                    className="flex flex-col items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#44D92C]/10 flex items-center justify-center mb-3 group-hover:bg-[#44D92C]/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#44D92C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">Contacter</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Commandes */}
        <TabsContent value="orders">
          <Card className="bg-[#1a1a1a]/80 border-white/10">
            <CardHeader>
              <CardTitle>Historique des commandes</CardTitle>
              <CardDescription>Consultez vos commandes passées</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingData ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#44D92C] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Aucune commande</p>
                  <p className="text-sm mb-4">Vous n&apos;avez pas encore passé de commande</p>
                  <Link href="/category/2-accueil">
                    <Button className="bg-[#44D92C] hover:bg-[#3bc425] text-black">
                      Découvrir nos produits
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-2 text-gray-500 font-medium">Référence</th>
                        <th className="text-left py-3 px-2 text-gray-500 font-medium">Date</th>
                        <th className="text-left py-3 px-2 text-gray-500 font-medium">Statut</th>
                        <th className="text-right py-3 px-2 text-gray-500 font-medium">Total</th>
                        <th className="py-3 px-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-4 px-2 font-mono font-semibold">{order.reference}</td>
                          <td className="py-4 px-2 text-gray-400">{formatDate(order.date_add)}</td>
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-2">
                              {getOrderStatusIcon(order.current_state)}
                              <span className="text-sm">{order.state_name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-right font-bold text-[#44D92C]">
                            {formatPrice(order.total_paid)}
                          </td>
                          <td className="py-4 px-2 text-right">
                            <Link href={`/compte/commandes/${order.reference}`}>
                              <Button variant="ghost" size="sm" className="text-[#44D92C] hover:text-[#3bc425]">
                                <Eye className="w-4 h-4 mr-1" />
                                Voir
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Adresses */}
        <TabsContent value="addresses">
          <Card className="bg-[#1a1a1a]/80 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Mes adresses</CardTitle>
                <CardDescription>Gérez vos adresses de livraison et facturation</CardDescription>
              </div>
              <Link href="/compte/adresses/nouvelle">
                <Button className="bg-[#44D92C] hover:bg-[#3bc425] text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle adresse
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoadingData ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#44D92C] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Aucune adresse enregistrée</p>
                  <p className="text-sm">Ajoutez une adresse pour faciliter vos achats</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <p className="font-semibold text-[#44D92C]">{addr.alias}</p>
                        <div className="flex gap-2">
                          <Link href={`/compte/adresses/${addr.id}`}>
                            <button className="text-gray-500 hover:text-white transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm space-y-1">
                        <p className="font-medium text-white">{addr.firstname} {addr.lastname}</p>
                        {addr.company && <p>{addr.company}</p>}
                        <p>{addr.address1}</p>
                        {addr.address2 && <p>{addr.address2}</p>}
                        <p>{addr.postcode} {addr.city}</p>
                        <p>{addr.country}</p>
                        {addr.phone && <p>Tél: {addr.phone}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres */}
        <TabsContent value="settings">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <Card className="bg-[#1a1a1a]/80 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#44D92C]" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstname">Prénom</Label>
                      <Input
                        id="firstname"
                        value={profileForm.firstname}
                        onChange={(e) => setProfileForm({...profileForm, firstname: e.target.value})}
                        className="bg-white/5 border-white/10 focus:border-[#44D92C]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastname">Nom</Label>
                      <Input
                        id="lastname"
                        value={profileForm.lastname}
                        onChange={(e) => setProfileForm({...profileForm, lastname: e.target.value})}
                        className="bg-white/5 border-white/10 focus:border-[#44D92C]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      className="bg-white/5 border-white/10 focus:border-[#44D92C]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Date de naissance</Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={profileForm.birthday}
                      onChange={(e) => setProfileForm({...profileForm, birthday: e.target.value})}
                      className="bg-white/5 border-white/10 focus:border-[#44D92C]"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#44D92C] hover:bg-[#3bc425] text-black"
                    disabled={isSavingProfile}
                  >
                    {isSavingProfile ? 'Enregistrement...' : profileSuccess ? (
                      <><Check className="w-4 h-4 mr-2" /> Enregistré !</>
                    ) : 'Enregistrer'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Mot de passe */}
            <Card className="bg-[#1a1a1a]/80 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#44D92C]" />
                  Modifier le mot de passe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {passwordError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <p className="text-red-400 text-sm">{passwordError}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <Input
                      id="current-password"
                      type="password"
                      autoComplete="current-password"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                      className="bg-white/5 border-white/10 focus:border-[#44D92C]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                      className="bg-white/5 border-white/10 focus:border-[#44D92C]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                      className="bg-white/5 border-white/10 focus:border-[#44D92C]"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#44D92C] hover:bg-[#3bc425] text-black"
                    disabled={isSavingPassword || !passwordForm.current || !passwordForm.new || !passwordForm.confirm}
                  >
                    {isSavingPassword ? 'Modification...' : 'Modifier le mot de passe'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 border-4 border-[#44D92C] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
