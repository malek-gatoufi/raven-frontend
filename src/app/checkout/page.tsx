'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { checkoutApi, customerApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Address } from '@/types/prestashop';
import {
  CreditCard,
  Truck,
  MapPin,
  Check,
  ChevronRight,
  ArrowLeft,
  Package,
  Shield,
  Lock,
  AlertCircle,
  Plus,
  Edit2,
  User
} from 'lucide-react';

type CheckoutStep = 'login' | 'address' | 'shipping' | 'payment' | 'confirmation';

interface Carrier {
  id: number;
  name: string;
  price: number;
  delay: string;
}

interface PaymentOption {
  module: string;
  name: string;
  logo?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, customer, isLoading: authLoading } = useAuth();
  const { cart, isLoading: cartLoading } = useCart();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('login');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  
  const [selectedAddressDelivery, setSelectedAddressDelivery] = useState<number | null>(null);
  const [selectedAddressInvoice, setSelectedAddressInvoice] = useState<number | null>(null);
  const [sameAddress, setSameAddress] = useState(true);
  const [selectedCarrier, setSelectedCarrier] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [acceptCGV, setAcceptCGV] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    alias: '',
    firstname: '',
    lastname: '',
    address1: '',
    address2: '',
    postcode: '',
    city: '',
    id_country: 8, // France par défaut
    phone: '',
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingAddress(true);
    setError(null);
    
    try {
      const newAddress = await customerApi.addAddress({
        ...addressFormData,
        alias: addressFormData.alias || 'Mon adresse',
      } as Omit<Address, 'id'>);
      
      setAddresses([...addresses, newAddress]);
      setSelectedAddressDelivery(newAddress.id);
      setShowAddressForm(false);
      setAddressFormData({
        alias: '',
        firstname: '',
        lastname: '',
        address1: '',
        address2: '',
        postcode: '',
        city: '',
        id_country: 8, // France
        phone: '',
      });
    } catch (err: unknown) {
      console.error('Failed to add address:', err);
      const apiError = err as { code?: number; message?: string };
      if (apiError.code === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else {
        setError(apiError.message || 'Impossible d\'ajouter l\'adresse. Veuillez réessayer.');
      }
    } finally {
      setIsAddingAddress(false);
    }
  };

  const steps: { key: CheckoutStep; label: string; icon: React.ReactNode }[] = [
    { key: 'login', label: 'Connexion', icon: <User className="w-5 h-5" /> },
    { key: 'address', label: 'Adresse', icon: <MapPin className="w-5 h-5" /> },
    { key: 'shipping', label: 'Livraison', icon: <Truck className="w-5 h-5" /> },
    { key: 'payment', label: 'Paiement', icon: <CreditCard className="w-5 h-5" /> },
  ];

  // Charger les données checkout
  useEffect(() => {
    if (isAuthenticated) {
      loadCheckoutData();
      setCurrentStep('address');
    }
  }, [isAuthenticated]);

  async function loadCheckoutData() {
    try {
      const [checkoutInfo, addressList] = await Promise.all([
        checkoutApi.getInfo(),
        customerApi.getAddresses(),
      ]);
      
      setAddresses(addressList);
      setCarriers(checkoutInfo.carriers);
      setPaymentOptions(checkoutInfo.payment_options);
      
      if (addressList.length > 0) {
        setSelectedAddressDelivery(addressList[0].id);
        setSelectedAddressInvoice(addressList[0].id);
      }
      if (checkoutInfo.carriers.length > 0) {
        setSelectedCarrier(checkoutInfo.carriers[0].id);
      }
    } catch (err) {
      console.error('Failed to load checkout data:', err);
      setError('Erreur lors du chargement des données');
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const getStepIndex = (step: CheckoutStep) => steps.findIndex(s => s.key === step);

  const canProceed = () => {
    switch (currentStep) {
      case 'login':
        return isAuthenticated;
      case 'address':
        return selectedAddressDelivery !== null && (sameAddress || selectedAddressInvoice !== null);
      case 'shipping':
        return selectedCarrier !== null;
      case 'payment':
        return selectedPayment !== null && acceptCGV;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (!canProceed()) return;
    
    setError(null);
    
    try {
      switch (currentStep) {
        case 'address':
          await checkoutApi.updateStep('address', {
            id_address_delivery: selectedAddressDelivery,
            id_address_invoice: sameAddress ? selectedAddressDelivery : selectedAddressInvoice,
          });
          setCurrentStep('shipping');
          break;
        case 'shipping':
          await checkoutApi.updateStep('shipping', {
            id_carrier: selectedCarrier,
          });
          setCurrentStep('payment');
          break;
        case 'payment':
          setIsProcessing(true);
          const result = await checkoutApi.validate(selectedPayment!, acceptCGV);
          router.push(`/confirmation?order=${result.order_reference}`);
          break;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartLoading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#44D92C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
          <p className="text-gray-400 mb-8">Ajoutez des articles pour passer commande</p>
          <Link href="/category/2-accueil">
            <Button className="h-12 px-8 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold">
              Parcourir les produits
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const selectedCarrierData = carriers.find(c => c.id === selectedCarrier);
  const shippingCost = selectedCarrierData?.price || 0;
  const totalWithShipping = cart.total + shippingCost;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/panier" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">Commande</h1>
      </div>

      {/* Stepper */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[600px]">
          {steps.map((step, index) => {
            const isActive = step.key === currentStep;
            const isCompleted = getStepIndex(step.key) < getStepIndex(currentStep);
            
            return (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div 
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-all
                      ${isCompleted ? 'bg-[#44D92C] text-black' : 
                        isActive ? 'bg-[#44D92C]/20 text-[#44D92C] border-2 border-[#44D92C]' : 
                        'bg-white/5 text-gray-500'}
                    `}
                  >
                    {isCompleted ? <Check className="w-6 h-6" /> : step.icon}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${isActive ? 'text-[#44D92C]' : 'text-gray-500'}`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-[#44D92C]' : 'bg-white/10'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contenu principal */}
        <div className="lg:col-span-2">
          {/* Étape Connexion */}
          {currentStep === 'login' && (
            <Card className="bg-[#1a1a1a]/80 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <User className="w-6 h-6 text-[#44D92C]" />
                  Identification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-400">
                  Connectez-vous pour continuer votre commande
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link href={`/connexion?redirect=/checkout`}>
                    <Button className="w-full h-12 bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold">
                      Se connecter
                    </Button>
                  </Link>
                  <Link href={`/inscription?redirect=/checkout`}>
                    <Button variant="outline" className="w-full h-12 border-white/10 hover:border-[#44D92C]">
                      Créer un compte
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Étape Adresse */}
          {currentStep === 'address' && (
            <Card className="bg-[#1a1a1a]/80 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-[#44D92C]" />
                  Adresse de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAddressForm ? (
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="alias">Nom de l&apos;adresse</Label>
                        <Input
                          id="alias"
                          placeholder="Ex: Maison, Bureau..."
                          value={addressFormData.alias}
                          onChange={(e) => setAddressFormData({...addressFormData, alias: e.target.value})}
                          className="mt-1 bg-white/5 border-white/10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="firstname">Prénom *</Label>
                        <Input
                          id="firstname"
                          required
                          value={addressFormData.firstname}
                          onChange={(e) => setAddressFormData({...addressFormData, firstname: e.target.value})}
                          className="mt-1 bg-white/5 border-white/10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastname">Nom *</Label>
                        <Input
                          id="lastname"
                          required
                          value={addressFormData.lastname}
                          onChange={(e) => setAddressFormData({...addressFormData, lastname: e.target.value})}
                          className="mt-1 bg-white/5 border-white/10"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="address1">Adresse *</Label>
                        <Input
                          id="address1"
                          required
                          value={addressFormData.address1}
                          onChange={(e) => setAddressFormData({...addressFormData, address1: e.target.value})}
                          className="mt-1 bg-white/5 border-white/10"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="address2">Complément d&apos;adresse</Label>
                        <Input
                          id="address2"
                          placeholder="Appartement, étage..."
                          value={addressFormData.address2}
                          onChange={(e) => setAddressFormData({...addressFormData, address2: e.target.value})}
                          className="mt-1 bg-white/5 border-white/10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postcode">Code postal *</Label>
                        <Input
                          id="postcode"
                          required
                          value={addressFormData.postcode}
                          onChange={(e) => setAddressFormData({...addressFormData, postcode: e.target.value})}
                          className="mt-1 bg-white/5 border-white/10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Ville *</Label>
                        <Input
                          id="city"
                          required
                          value={addressFormData.city}
                          onChange={(e) => setAddressFormData({...addressFormData, city: e.target.value})}
                          className="mt-1 bg-white/5 border-white/10"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={addressFormData.phone}
                          onChange={(e) => setAddressFormData({...addressFormData, phone: e.target.value})}
                          className="mt-1 bg-white/5 border-white/10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddressForm(false)}
                        className="flex-1 border-white/10"
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        disabled={isAddingAddress}
                        className="flex-1 bg-[#44D92C] hover:bg-[#3bc425] text-black"
                      >
                        {isAddingAddress ? 'Enregistrement...' : 'Enregistrer'}
                      </Button>
                    </div>
                  </form>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Vous n&apos;avez pas encore d&apos;adresse enregistrée</p>
                    <Button 
                      onClick={() => setShowAddressForm(true)}
                      className="bg-[#44D92C] hover:bg-[#3bc425] text-black"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter une adresse
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4">
                      {addresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`
                            block p-4 rounded-lg border-2 cursor-pointer transition-all
                            ${selectedAddressDelivery === addr.id 
                              ? 'border-[#44D92C] bg-[#44D92C]/10' 
                              : 'border-white/10 hover:border-white/20'}
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="address_delivery"
                              checked={selectedAddressDelivery === addr.id}
                              onChange={() => setSelectedAddressDelivery(addr.id)}
                              className="mt-1 text-[#44D92C] focus:ring-[#44D92C]"
                            />
                            <div className="flex-1">
                              <p className="font-semibold">{addr.alias}</p>
                              <p className="text-gray-400">
                                {addr.firstname} {addr.lastname}
                              </p>
                              <p className="text-gray-400">{addr.address1}</p>
                              {addr.address2 && <p className="text-gray-400">{addr.address2}</p>}
                              <p className="text-gray-400">{addr.postcode} {addr.city}</p>
                              <p className="text-gray-400">{addr.country}</p>
                            </div>
                            <button className="text-gray-500 hover:text-[#44D92C]">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </label>
                      ))}
                    </div>

                    <button 
                      onClick={() => setShowAddressForm(true)}
                      className="flex items-center gap-2 text-[#44D92C] hover:text-[#3bc425] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter une nouvelle adresse
                    </button>

                    <div className="pt-4 border-t border-white/10">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sameAddress}
                          onChange={(e) => setSameAddress(e.target.checked)}
                          className="rounded border-white/20 bg-white/5 text-[#44D92C] focus:ring-[#44D92C]"
                        />
                        <span>Utiliser la même adresse pour la facturation</span>
                      </label>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Étape Livraison */}
          {currentStep === 'shipping' && (
            <Card className="bg-[#1a1a1a]/80 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Truck className="w-6 h-6 text-[#44D92C]" />
                  Mode de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {carriers.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    Aucun mode de livraison disponible pour cette adresse
                  </p>
                ) : (
                  <div className="grid gap-4">
                    {carriers.map((carrier) => (
                      <label
                        key={carrier.id}
                        className={`
                          block p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${selectedCarrier === carrier.id 
                            ? 'border-[#44D92C] bg-[#44D92C]/10' 
                            : 'border-white/10 hover:border-white/20'}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="carrier"
                              checked={selectedCarrier === carrier.id}
                              onChange={() => setSelectedCarrier(carrier.id)}
                              className="text-[#44D92C] focus:ring-[#44D92C]"
                            />
                            <div>
                              <p className="font-semibold">{carrier.name}</p>
                              <p className="text-sm text-gray-400">{carrier.delay}</p>
                            </div>
                          </div>
                          <p className="font-bold text-[#44D92C]">
                            {carrier.price === 0 ? 'Gratuit' : formatPrice(carrier.price)}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Étape Paiement */}
          {currentStep === 'payment' && (
            <Card className="bg-[#1a1a1a]/80 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-[#44D92C]" />
                  Mode de paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {paymentOptions.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    Aucun mode de paiement disponible
                  </p>
                ) : (
                  <div className="grid gap-4">
                    {paymentOptions.map((payment) => (
                      <label
                        key={payment.module}
                        className={`
                          block p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${selectedPayment === payment.module 
                            ? 'border-[#44D92C] bg-[#44D92C]/10' 
                            : 'border-white/10 hover:border-white/20'}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            checked={selectedPayment === payment.module}
                            onChange={() => setSelectedPayment(payment.module)}
                            className="text-[#44D92C] focus:ring-[#44D92C]"
                          />
                          {payment.logo && (
                            <Image src={payment.logo} alt={payment.name} width={60} height={30} />
                          )}
                          <span className="font-semibold">{payment.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-white/10">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptCGV}
                      onChange={(e) => setAcceptCGV(e.target.checked)}
                      className="mt-1 rounded border-white/20 bg-white/5 text-[#44D92C] focus:ring-[#44D92C]"
                    />
                    <span className="text-sm text-gray-400">
                      J&apos;ai lu et j&apos;accepte les{' '}
                      <Link href="/cgv" className="text-[#44D92C] hover:underline">
                        conditions générales de vente
                      </Link>
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                  <Lock className="w-5 h-5 text-[#44D92C]" />
                  <p className="text-sm text-gray-400">
                    Paiement 100% sécurisé par SSL
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          {currentStep !== 'login' && (
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  const stepIndex = getStepIndex(currentStep);
                  if (stepIndex > 1) {
                    setCurrentStep(steps[stepIndex - 1].key);
                  }
                }}
                className="border-white/10 hover:border-white/20"
                disabled={getStepIndex(currentStep) <= 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              
              <Button
                onClick={handleNext}
                className="bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold"
                disabled={!canProceed() || isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement...
                  </span>
                ) : currentStep === 'payment' ? (
                  <>
                    Confirmer la commande
                    <Check className="ml-2 w-4 h-4" />
                  </>
                ) : (
                  <>
                    Continuer
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Résumé commande */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="bg-[#1a1a1a]/80 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Votre commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Articles */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={`${item.id_product}-${item.id_product_attribute}`} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name || 'Produit'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                        <p className="text-sm text-[#44D92C] font-semibold">
                          {formatPrice(item.total || item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Sous-total</span>
                    <span>{formatPrice(cart.total_products)}</span>
                  </div>
                  
                  {cart.total_discounts > 0 && (
                    <div className="flex justify-between text-[#44D92C]">
                      <span>Réductions</span>
                      <span>-{formatPrice(cart.total_discounts)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-400">
                    <span>Livraison</span>
                    <span>{shippingCost > 0 ? formatPrice(shippingCost) : 'Offert'}</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-[#44D92C]">{formatPrice(totalWithShipping)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">TVA incluse</p>
                </div>
              </CardContent>
            </Card>

            {/* Badges de confiance */}
            <div className="mt-4 flex items-center justify-center gap-6 text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#44D92C]" />
                <span className="text-xs">Paiement sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#44D92C]" />
                <span className="text-xs">Livraison 24-48h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
