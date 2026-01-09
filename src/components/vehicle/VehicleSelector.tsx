'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Car, 
  Bike, 
  Waves, 
  Snowflake, 
  ChevronRight,
  Search,
  X,
  Check,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_PRESTASHOP_URL || 'https://ravenindustries.fr';

// Types de véhicules supportés
const vehicleTypes = [
  { id: 'moto', name: 'Moto', icon: Bike, color: 'from-blue-500 to-blue-600' },
  { id: 'quad', name: 'Quad', icon: Car, color: 'from-orange-500 to-orange-600' },
  { id: 'jet-ski', name: 'Jet-ski', icon: Waves, color: 'from-cyan-500 to-cyan-600' },
  { id: 'motoneige', name: 'Motoneige', icon: Snowflake, color: 'from-purple-500 to-purple-600' },
];

interface VehicleSelection {
  type: string | null;
  brand: string | null;
  model: string | null;
  year: string | null;
}

interface VehicleSelectorProps {
  onSelect?: (selection: VehicleSelection) => void;
  variant?: 'full' | 'compact' | 'inline';
  className?: string;
}

export function VehicleSelector({ 
  onSelect, 
  variant = 'full',
  className 
}: VehicleSelectorProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<VehicleSelection>({
    type: null,
    brand: null,
    model: null,
    year: null,
  });
  
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch brands when type is selected
  useEffect(() => {
    if (selection.type) {
      fetchBrands(selection.type);
    }
  }, [selection.type]);

  // Fetch models when brand is selected
  useEffect(() => {
    if (selection.type && selection.brand) {
      fetchModels(selection.type, selection.brand);
    }
  }, [selection.type, selection.brand]);

  // Fetch years when model is selected
  useEffect(() => {
    if (selection.type && selection.brand && selection.model) {
      fetchYears(selection.type, selection.brand, selection.model);
    }
  }, [selection.type, selection.brand, selection.model]);

  async function fetchBrands(type: string) {
    setIsLoading(true);
    try {
      // En production, appeler l'API
      // const response = await fetch(`${API_BASE}/index.php?fc=module&module=ravenapi&controller=vehicles&type=${type}`);
      // Pour la démo, utilisons des données statiques
      const mockBrands: Record<string, string[]> = {
        moto: ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'BMW', 'Ducati', 'KTM', 'Harley-Davidson'],
        quad: ['Yamaha', 'Can-Am', 'Polaris', 'Honda', 'Kawasaki', 'Arctic Cat'],
        'jet-ski': ['Yamaha', 'Sea-Doo', 'Kawasaki', 'Honda'],
        motoneige: ['Ski-Doo', 'Polaris', 'Arctic Cat', 'Yamaha'],
      };
      setBrands(mockBrands[type] || []);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchModels(type: string, brand: string) {
    setIsLoading(true);
    try {
      // Mock models
      const mockModels: Record<string, string[]> = {
        Honda: ['CBR600RR', 'CBR1000RR', 'CB650R', 'Africa Twin', 'Goldwing', 'Forza 750'],
        Yamaha: ['YZF-R1', 'YZF-R6', 'MT-07', 'MT-09', 'Tracer 900', 'TMAX 560'],
        Kawasaki: ['Ninja ZX-6R', 'Ninja ZX-10R', 'Z900', 'Z650', 'Versys 1000'],
        default: ['Modèle A', 'Modèle B', 'Modèle C', 'Modèle D'],
      };
      setModels(mockModels[brand] || mockModels.default);
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchYears(type: string, brand: string, model: string) {
    setIsLoading(true);
    try {
      // Generate years from current year back to 2000
      const currentYear = new Date().getFullYear();
      const yearList = [];
      for (let y = currentYear; y >= 2000; y--) {
        yearList.push(y.toString());
      }
      setYears(yearList);
    } catch (error) {
      console.error('Failed to fetch years:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleTypeSelect(type: string) {
    setSelection({ type, brand: null, model: null, year: null });
    setStep(2);
  }

  function handleBrandSelect(brand: string) {
    setSelection(prev => ({ ...prev, brand, model: null, year: null }));
    setStep(3);
  }

  function handleModelSelect(model: string) {
    setSelection(prev => ({ ...prev, model, year: null }));
    setStep(4);
  }

  function handleYearSelect(year: string) {
    const finalSelection = { ...selection, year };
    setSelection(finalSelection);
    onSelect?.(finalSelection);
    
    // Navigate to results
    const params = new URLSearchParams({
      type: finalSelection.type || '',
      brand: finalSelection.brand || '',
      model: finalSelection.model || '',
      year: year,
    });
    router.push(`/pieces-compatibles?${params.toString()}`);
  }

  function reset() {
    setSelection({ type: null, brand: null, model: null, year: null });
    setStep(1);
    setBrands([]);
    setModels([]);
    setYears([]);
  }

  if (variant === 'inline') {
    return (
      <InlineVehicleSelector 
        selection={selection}
        onSelect={(sel) => {
          onSelect?.(sel);
          const params = new URLSearchParams();
          if (sel.type) params.set('type', sel.type);
          if (sel.brand) params.set('brand', sel.brand);
          if (sel.model) params.set('model', sel.model);
          if (sel.year) params.set('year', sel.year);
          router.push(`/pieces-compatibles?${params.toString()}`);
        }}
        className={className}
      />
    );
  }

  if (variant === 'compact') {
    return (
      <CompactVehicleSelector 
        selection={selection}
        onTypeSelect={handleTypeSelect}
        onBrandSelect={handleBrandSelect}
        onModelSelect={handleModelSelect}
        onYearSelect={handleYearSelect}
        brands={brands}
        models={models}
        years={years}
        isLoading={isLoading}
        onReset={reset}
        className={className}
      />
    );
  }

  // Full variant
  return (
    <div className={cn("bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden", className)}>
      {/* Progress steps */}
      <div className="flex items-center gap-2 p-4 bg-black/30">
        {['Type', 'Marque', 'Modèle', 'Année'].map((label, index) => (
          <div key={label} className="flex items-center">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors",
              step > index + 1
                ? "bg-[#44D92C] text-black"
                : step === index + 1
                  ? "bg-[#44D92C]/20 text-[#44D92C] border-2 border-[#44D92C]"
                  : "bg-white/5 text-gray-500"
            )}>
              {step > index + 1 ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <span className={cn(
              "ml-2 text-sm hidden md:block",
              step === index + 1 ? "text-white font-medium" : "text-gray-500"
            )}>
              {label}
            </span>
            {index < 3 && (
              <ChevronRight className="w-4 h-4 text-gray-600 mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Step 1: Vehicle Type */}
        {step === 1 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vehicleTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 hover:border-[#44D92C]/50 transition-all hover:scale-105"
              >
                <div className={cn(
                  "w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center",
                  type.color
                )}>
                  <type.icon className="w-8 h-8 text-white" />
                </div>
                <span className="font-semibold group-hover:text-[#44D92C] transition-colors">
                  {type.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Brand */}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Choisissez une marque</h3>
              <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-white">
                ← Retour
              </button>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#44D92C]" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => handleBrandSelect(brand)}
                    className="p-4 text-center rounded-xl bg-white/5 hover:bg-[#44D92C]/10 border border-white/5 hover:border-[#44D92C]/50 transition-all"
                  >
                    {brand}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Model */}
        {step === 3 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Choisissez un modèle</h3>
              <button onClick={() => setStep(2)} className="text-sm text-gray-400 hover:text-white">
                ← Retour
              </button>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#44D92C]" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {models.map((model) => (
                  <button
                    key={model}
                    onClick={() => handleModelSelect(model)}
                    className="p-4 text-center rounded-xl bg-white/5 hover:bg-[#44D92C]/10 border border-white/5 hover:border-[#44D92C]/50 transition-all"
                  >
                    {model}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Year */}
        {step === 4 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Choisissez l'année</h3>
              <button onClick={() => setStep(3)} className="text-sm text-gray-400 hover:text-white">
                ← Retour
              </button>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#44D92C]" />
              </div>
            ) : (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-64 overflow-y-auto">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className="p-3 text-center rounded-lg bg-white/5 hover:bg-[#44D92C]/10 border border-white/5 hover:border-[#44D92C]/50 transition-all font-mono"
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selection summary */}
      {(selection.type || selection.brand || selection.model) && (
        <div className="px-6 pb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Sélection:</span>
            {selection.type && (
              <span className="px-2 py-1 bg-white/5 rounded">{selection.type}</span>
            )}
            {selection.brand && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="px-2 py-1 bg-white/5 rounded">{selection.brand}</span>
              </>
            )}
            {selection.model && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="px-2 py-1 bg-white/5 rounded">{selection.model}</span>
              </>
            )}
            <button onClick={reset} className="ml-auto text-gray-400 hover:text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline selector for header/hero
function InlineVehicleSelector({ 
  selection, 
  onSelect,
  className 
}: {
  selection: VehicleSelection;
  onSelect: (selection: VehicleSelection) => void;
  className?: string;
}) {
  return (
    <div className={cn(
      "flex flex-wrap items-center gap-2 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10",
      className
    )}>
      <select 
        className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm focus:border-[#44D92C] outline-none"
        value={selection.type || ''}
        onChange={(e) => onSelect({ ...selection, type: e.target.value, brand: null, model: null, year: null })}
      >
        <option value="">Type de véhicule</option>
        {vehicleTypes.map(type => (
          <option key={type.id} value={type.id}>{type.name}</option>
        ))}
      </select>

      <select 
        className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm focus:border-[#44D92C] outline-none disabled:opacity-50"
        disabled={!selection.type}
      >
        <option value="">Marque</option>
      </select>

      <select 
        className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm focus:border-[#44D92C] outline-none disabled:opacity-50"
        disabled={!selection.brand}
      >
        <option value="">Modèle</option>
      </select>

      <select 
        className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm focus:border-[#44D92C] outline-none disabled:opacity-50"
        disabled={!selection.model}
      >
        <option value="">Année</option>
      </select>

      <Button className="bg-[#44D92C] hover:bg-[#3bc425] text-black font-bold">
        <Search className="w-4 h-4 mr-2" />
        Rechercher
      </Button>
    </div>
  );
}

// Compact selector
function CompactVehicleSelector({
  selection,
  onTypeSelect,
  onBrandSelect,
  onModelSelect,
  onYearSelect,
  brands,
  models,
  years,
  isLoading,
  onReset,
  className,
}: {
  selection: VehicleSelection;
  onTypeSelect: (type: string) => void;
  onBrandSelect: (brand: string) => void;
  onModelSelect: (model: string) => void;
  onYearSelect: (year: string) => void;
  brands: string[];
  models: string[];
  years: string[];
  isLoading: boolean;
  onReset: () => void;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-2 gap-2">
        {vehicleTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onTypeSelect(type.id)}
            className={cn(
              "flex items-center gap-2 p-3 rounded-xl border transition-all",
              selection.type === type.id
                ? "bg-[#44D92C]/10 border-[#44D92C] text-[#44D92C]"
                : "border-white/10 hover:border-white/20"
            )}
          >
            <type.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{type.name}</span>
          </button>
        ))}
      </div>

      {selection.type && brands.length > 0 && (
        <select
          value={selection.brand || ''}
          onChange={(e) => onBrandSelect(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#44D92C] outline-none"
        >
          <option value="">Sélectionner une marque</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      )}

      {selection.brand && models.length > 0 && (
        <select
          value={selection.model || ''}
          onChange={(e) => onModelSelect(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#44D92C] outline-none"
        >
          <option value="">Sélectionner un modèle</option>
          {models.map(model => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      )}

      {selection.model && years.length > 0 && (
        <select
          value={selection.year || ''}
          onChange={(e) => onYearSelect(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-[#44D92C] outline-none"
        >
          <option value="">Sélectionner l'année</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      )}
    </div>
  );
}

export default VehicleSelector;
