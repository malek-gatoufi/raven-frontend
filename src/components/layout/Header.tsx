'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  Bike,
  Waves,
  Snowflake,
  Phone,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { LiveSearch } from '@/components/search/LiveSearch';

// Catégories de véhicules avec IDs PrestaShop
const vehicleCategories = [
  { 
    name: 'Moto', 
    slug: '22-motos', 
    icon: Bike,
    color: 'text-[#44D92C]',
    bgColor: 'bg-[#44D92C]/10 hover:bg-[#44D92C]/20',
  },
  { 
    name: 'Quad', 
    slug: '24-quads', 
    icon: Bike,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10 hover:bg-amber-500/20',
  },
  { 
    name: 'Scooter', 
    slug: '25-scooters', 
    icon: Bike,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
  },
  { 
    name: 'Motoneige', 
    slug: '21-motos-neiges', 
    icon: Snowflake,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10 hover:bg-purple-500/20',
  },
];

const mainNav = [
  { name: 'Accueil', href: '/' },
  { name: 'Nouveautés', href: '/nouveautes' },
  { name: 'Promotions', href: '/promotions' },
  { name: 'Marques', href: '/marques' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount, openCart } = useCart();
  const { customer, isAuthenticated, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/recherche?q=${encodeURIComponent(searchQuery)}`;
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full header-glass">
      {/* Top bar */}
      <div className="border-b border-white/5 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center gap-4 text-[#999]">
              <a href="tel:+33123456789" className="flex items-center gap-1 hover:text-[#44D92C] transition-colors">
                <Phone className="h-3 w-3" />
                <span className="hidden sm:inline">01 23 45 67 89</span>
              </a>
              <span className="hidden md:inline">Livraison rapide 24-48h</span>
            </div>
            <div className="flex items-center gap-4 text-[#999]">
              <Link href="/suivi-commande" className="hover:text-[#44D92C] transition-colors">
                Suivi commande
              </Link>
              <Link href="/aide" className="hover:text-[#44D92C] transition-colors">
                Aide
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
              <Image
                src="/raven.png?v=2"
                alt="Raven Industries"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-white">RAVEN</span>
              <span className="text-xl font-light text-[#999] ml-1">INDUSTRIES</span>
            </div>
          </Link>

          {/* Search bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <LiveSearch 
              placeholder="Rechercher une pièce, une référence..."
              debounceDelay={300}
              minSearchLength={2}
              maxResults={8}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search toggle mobile */}
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden text-[#999] hover:text-[#44D92C] hover:bg-white/5"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-[#999] hover:text-[#44D92C] hover:bg-white/5"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-[#1a1a1a] border-white/10 text-white"
              >
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="font-medium">{customer?.firstname} {customer?.lastname}</p>
                      <p className="text-sm text-[#999]">{customer?.email}</p>
                    </div>
                    <DropdownMenuItem asChild className="hover:bg-white/5 focus:bg-white/5">
                      <Link href="/compte">Mon compte</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-white/5 focus:bg-white/5">
                      <Link href="/compte/commandes">Mes commandes</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-white/5 focus:bg-white/5">
                      <Link href="/compte/adresses">Mes adresses</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-white/5 focus:bg-white/5">
                      <Link href="/compte/favoris">Mes favoris</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem 
                      onClick={logout}
                      className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
                    >
                      Déconnexion
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild className="hover:bg-white/5 focus:bg-white/5">
                      <Link href="/connexion">Connexion</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-white/5 focus:bg-white/5">
                      <Link href="/inscription">Créer un compte</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link href="/compte/favoris">
                <Button 
                  variant="ghost" 
                  className="relative text-[#999] hover:text-red-500 hover:bg-white/5"
                  size="icon"
                >
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold">
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Button 
              variant="ghost" 
              className="relative text-[#999] hover:text-[#44D92C] hover:bg-white/5 gap-2"
              onClick={openCart}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Panier</span>
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#44D92C] text-black text-xs font-bold animate-pulse-green">
                  {itemCount}
                </Badge>
              )}
            </Button>
            <CartDrawer />

            {/* Mobile menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="lg:hidden text-[#999] hover:text-[#44D92C] hover:bg-white/5"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-80 bg-[#0a0a0a] border-white/10 p-0"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile menu header */}
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-[#44D92C]/20 rounded-lg flex items-center justify-center">
                        <span className="text-xl font-black text-[#44D92C]">R</span>
                      </div>
                      <span className="font-bold text-white">RAVEN INDUSTRIES</span>
                    </div>
                  </div>

                  {/* Vehicle categories */}
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-3">
                      Catégories
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {vehicleCategories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/category/${cat.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-2 p-3 rounded-lg ${cat.bgColor} transition-colors`}
                        >
                          <cat.icon className={`h-5 w-5 ${cat.color}`} />
                          <span className="text-white text-sm font-medium">{cat.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 p-4">
                    <ul className="space-y-1">
                      {mainNav.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-4 py-3 rounded-lg text-[#e0e0e0] hover:bg-white/5 hover:text-[#44D92C] transition-colors"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {/* Mobile menu footer */}
                  <div className="p-4 border-t border-white/10">
                    <a 
                      href="tel:+33123456789" 
                      className="flex items-center justify-center gap-2 p-3 bg-[#44D92C] text-black font-semibold rounded-lg hover:bg-[#3bc425] transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      01 23 45 67 89
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile search */}
        {isSearchOpen && (
          <div className="lg:hidden pb-4 animate-fade-in-up">
            <LiveSearch 
              placeholder="Rechercher une pièce..."
              debounceDelay={200}
              minSearchLength={2}
              maxResults={5}
            />
          </div>
        )}
      </div>

      {/* Navigation bar - Desktop */}
      <nav className="hidden lg:block border-t border-white/5 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-14">
            {/* Vehicle categories dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-full px-6 text-white hover:text-[#44D92C] hover:bg-white/5 rounded-none border-r border-white/10 gap-2"
                >
                  <Menu className="h-4 w-4" />
                  Toutes les catégories
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64 bg-[#1a1a1a] border-white/10 p-2"
              >
                {vehicleCategories.map((cat) => (
                  <DropdownMenuItem key={cat.slug} asChild>
                    <Link
                      href={`/category/${cat.slug}`}
                      className={`flex items-center gap-3 p-3 rounded-lg ${cat.bgColor} transition-colors cursor-pointer`}
                    >
                      <cat.icon className={`h-5 w-5 ${cat.color}`} />
                      <span className="text-white font-medium">{cat.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Main navigation */}
            <ul className="flex items-center h-full">
              {mainNav.map((item) => (
                <li key={item.href} className="h-full">
                  <Link
                    href={item.href}
                    className="flex items-center h-full px-5 text-[#999] hover:text-[#44D92C] hover:bg-white/5 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Quick vehicle links */}
            <div className="ml-auto flex items-center gap-1">
              {vehicleCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${cat.bgColor} ${cat.color} transition-colors`}
                >
                  <cat.icon className="h-4 w-4" />
                  <span className="font-medium">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
