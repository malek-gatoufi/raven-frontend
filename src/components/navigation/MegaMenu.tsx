'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ChevronDown, 
  ChevronRight, 
  Bike, 
  Car, 
  Waves, 
  Snowflake,
  Settings,
  Wrench,
  Shield,
  Sparkles,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/prestashop';

const API_BASE = process.env.NEXT_PUBLIC_PRESTASHOP_URL || 'https://ravenindustries.fr';

// Icons par type de catégorie
const categoryIcons: Record<string, React.ElementType> = {
  moto: Bike,
  quad: Car,
  'jet-ski': Waves,
  motoneige: Snowflake,
  accessoires: Settings,
  pieces: Wrench,
  equipement: Shield,
  default: Package,
};

interface MegaMenuProps {
  className?: string;
}

export function MegaMenu({ className }: MegaMenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(
          `${API_BASE}/index.php?fc=module&module=ravenapi&controller=categories&depth=3`,
          { credentials: 'include' }
        );
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setActiveCategory(null);
    }, 150);
  };

  const getIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    for (const [key, Icon] of Object.entries(categoryIcons)) {
      if (name.includes(key)) return Icon;
    }
    return categoryIcons.default;
  };

  // Get root categories (depth 1)
  const rootCategories = categories.filter(c => c.level_depth === 1 || !c.id_parent || c.id_parent === 2);

  return (
    <div 
      ref={menuRef}
      className={cn("relative", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger button */}
      <button
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
          isOpen 
            ? "bg-[#44D92C] text-black" 
            : "bg-white/5 text-white hover:bg-white/10"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="font-medium">Catégories</span>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Mega menu dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-screen max-w-5xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-[#44D92C] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-400 mt-4">Chargement des catégories...</p>
              </div>
            ) : (
              <div className="flex">
                {/* Left sidebar - Main categories */}
                <div className="w-64 bg-[#111] border-r border-white/5 p-2">
                  {rootCategories.map((category) => {
                    const Icon = getIcon(category.name);
                    const hasChildren = categories.some(c => c.id_parent === category.id);
                    
                    return (
                      <button
                        key={category.id}
                        onMouseEnter={() => setActiveCategory(category.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
                          activeCategory === category.id
                            ? "bg-[#44D92C] text-black"
                            : "text-white hover:bg-white/5"
                        )}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="flex-1 font-medium truncate">{category.name}</span>
                        {hasChildren && (
                          <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right panel - Subcategories */}
                <div className="flex-1 p-6">
                  {activeCategory ? (
                    <CategoryPanel 
                      category={categories.find(c => c.id === activeCategory)!}
                      allCategories={categories}
                      onClose={() => setIsOpen(false)}
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                      <Sparkles className="w-12 h-12 text-[#44D92C] mb-4" />
                      <h3 className="text-xl font-bold mb-2">Explorez nos catégories</h3>
                      <p className="text-gray-400 max-w-xs">
                        Survolez une catégorie pour découvrir nos sous-catégories et produits
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="bg-[#111] border-t border-white/5 p-4">
              <div className="flex items-center justify-between">
                <Link 
                  href="/categories"
                  className="text-[#44D92C] hover:underline font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Voir toutes les catégories →
                </Link>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>🚚 Livraison gratuite dès 50€</span>
                  <span>⚡ Expédition sous 24h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CategoryPanelProps {
  category: Category;
  allCategories: Category[];
  onClose: () => void;
}

function CategoryPanel({ category, allCategories, onClose }: CategoryPanelProps) {
  const subcategories = allCategories.filter(c => c.id_parent === category.id);
  
  // Group subcategories by their first letter or by chunks
  const groupedSubcategories: Category[][] = [];
  for (let i = 0; i < subcategories.length; i += 8) {
    groupedSubcategories.push(subcategories.slice(i, i + 8));
  }

  return (
    <div className="animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold">{category.name}</h3>
          {category.description && (
            <p className="text-gray-400 text-sm mt-1 line-clamp-1">
              {category.description.replace(/<[^>]*>/g, '')}
            </p>
          )}
        </div>
        <Link
          href={`/category/${category.id}-${category.link_rewrite}`}
          className="px-4 py-2 bg-[#44D92C] text-black font-medium rounded-lg hover:bg-[#3bc425] transition-colors"
          onClick={onClose}
        >
          Tout voir
        </Link>
      </div>

      {/* Subcategories grid */}
      {subcategories.length > 0 ? (
        <div className="grid grid-cols-3 gap-x-8 gap-y-2">
          {groupedSubcategories.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-1">
              {group.map((subcat) => (
                <Link
                  key={subcat.id}
                  href={`/category/${subcat.id}-${subcat.link_rewrite}`}
                  className="block py-2 px-3 -mx-3 rounded-lg text-gray-300 hover:text-[#44D92C] hover:bg-white/5 transition-colors"
                  onClick={onClose}
                >
                  {subcat.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">
            Consultez directement cette catégorie pour voir tous les produits
          </p>
        </div>
      )}

      {/* View all link */}
      <div className="mt-8 pt-6 border-t border-white/5 text-center">
        <Link
          href={`/category/${category.id}-${category.link_rewrite}`}
          className="inline-flex items-center gap-2 text-[#44D92C] hover:underline font-medium"
          onClick={onClose}
        >
          Voir tous les produits de {category.name}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default MegaMenu;
