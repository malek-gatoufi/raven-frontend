'use client';

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SuiviCommandePage() {
  const [orderRef, setOrderRef] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setIsSearching(true);
    // TODO: Implémenter la recherche de commande via API
    setTimeout(() => setIsSearching(false), 1000);
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Suivi de commande</h1>
          <p className="text-[#999]">
            Entrez votre numéro de commande et votre email pour suivre votre colis
          </p>
        </div>

        <Card className="bg-[#1a1a1a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="h-5 w-5 text-[#44D92C]" />
              Rechercher ma commande
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="text-sm text-[#999] mb-2 block">
                  Numéro de commande
                </label>
                <Input
                  type="text"
                  placeholder="Ex: RAVEN-2024-12345"
                  value={orderRef}
                  onChange={(e) => setOrderRef(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-[#999] mb-2 block">
                  Email de la commande
                </label>
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#44D92C] hover:bg-[#3bc425] text-black"
                disabled={isSearching}
              >
                {isSearching ? 'Recherche...' : 'Suivre ma commande'}
                <Search className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Exemple de statut */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-white">États possibles</h3>
          <div className="grid gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
              <Package className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-white font-medium">En préparation</p>
                <p className="text-sm text-[#999]">Votre commande est en cours de préparation</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
              <Truck className="h-6 w-6 text-amber-400" />
              <div>
                <p className="text-white font-medium">En cours de livraison</p>
                <p className="text-sm text-[#999]">Votre colis est en route</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
              <CheckCircle className="h-6 w-6 text-[#44D92C]" />
              <div>
                <p className="text-white font-medium">Livré</p>
                <p className="text-sm text-[#999]">Votre commande a été livrée</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
