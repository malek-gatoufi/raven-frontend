'use client';

import { useState, useEffect } from 'react';
import { Bike, X, ChevronDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SavedVehicle {
  id: string;
  type: string;
  brand: string;
  model: string;
  year: string;
  addedAt: Date;
}

const STORAGE_KEY = 'raven_saved_vehicles';
const MAX_VEHICLES = 5;

// Hook pour gérer les véhicules sauvegardés
export function useSavedVehicles() {
  const [vehicles, setVehicles] = useState<SavedVehicle[]>([]);
  const [activeVehicle, setActiveVehicleState] = useState<SavedVehicle | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      setVehicles(data.vehicles || []);
      if (data.activeId) {
        const active = data.vehicles?.find((v: SavedVehicle) => v.id === data.activeId);
        setActiveVehicleState(active || null);
      }
    }
  }, []);

  function saveToStorage(vehicleList: SavedVehicle[], activeId?: string) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      vehicles: vehicleList,
      activeId: activeId || activeVehicle?.id,
    }));
  }

  function addVehicle(vehicle: Omit<SavedVehicle, 'id' | 'addedAt'>) {
    const newVehicle: SavedVehicle = {
      ...vehicle,
      id: `${Date.now()}`,
      addedAt: new Date(),
    };

    const updated = [newVehicle, ...vehicles].slice(0, MAX_VEHICLES);
    setVehicles(updated);
    setActiveVehicleState(newVehicle);
    saveToStorage(updated, newVehicle.id);
    return newVehicle;
  }

  function removeVehicle(id: string) {
    const updated = vehicles.filter(v => v.id !== id);
    setVehicles(updated);
    
    if (activeVehicle?.id === id) {
      const newActive = updated[0] || null;
      setActiveVehicleState(newActive);
      saveToStorage(updated, newActive?.id);
    } else {
      saveToStorage(updated);
    }
  }

  function setActiveVehicle(id: string) {
    const vehicle = vehicles.find(v => v.id === id);
    if (vehicle) {
      setActiveVehicleState(vehicle);
      saveToStorage(vehicles, id);
    }
  }

  function clearAll() {
    setVehicles([]);
    setActiveVehicleState(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    vehicles,
    activeVehicle,
    addVehicle,
    removeVehicle,
    setActiveVehicle,
    clearAll,
  };
}

// Badge véhicule actif pour le header
export function ActiveVehicleBadge({ className }: { className?: string }) {
  const { activeVehicle, vehicles } = useSavedVehicles();
  const [isOpen, setIsOpen] = useState(false);

  if (!activeVehicle && vehicles.length === 0) {
    return (
      <Link
        href="/selecteur-vehicule"
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#44D92C]/50 transition-all text-sm",
          className
        )}
      >
        <Bike className="w-4 h-4 text-[#44D92C]" />
        <span className="hidden md:block">Mon véhicule</span>
        <Plus className="w-3 h-3" />
      </Link>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#44D92C]/10 border border-[#44D92C]/50 hover:bg-[#44D92C]/20 transition-all text-sm"
      >
        <Bike className="w-4 h-4 text-[#44D92C]" />
        <span className="font-medium text-[#44D92C] hidden md:block">
          {activeVehicle ? `${activeVehicle.brand} ${activeVehicle.model}` : 'Véhicule'}
        </span>
        <ChevronDown className={cn(
          "w-3 h-3 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <VehicleDropdown 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </div>
  );
}

// Dropdown des véhicules sauvegardés
function VehicleDropdown({ onClose }: { onClose: () => void }) {
  const { vehicles, activeVehicle, setActiveVehicle, removeVehicle } = useSavedVehicles();

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-72 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
        <div className="p-3 border-b border-white/10">
          <h3 className="font-semibold text-sm">Mes véhicules</h3>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={cn(
                "flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-b-0",
                activeVehicle?.id === vehicle.id && "bg-[#44D92C]/10"
              )}
              onClick={() => {
                setActiveVehicle(vehicle.id);
                onClose();
              }}
            >
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {vehicle.brand} {vehicle.model}
                </div>
                <div className="text-xs text-gray-400">
                  {vehicle.type} • {vehicle.year}
                </div>
              </div>
              {activeVehicle?.id === vehicle.id && (
                <div className="w-2 h-2 bg-[#44D92C] rounded-full" />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeVehicle(vehicle.id);
                }}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-white/10 bg-black/30">
          <Link
            href="/selecteur-vehicule"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2 bg-[#44D92C]/10 hover:bg-[#44D92C]/20 border border-[#44D92C]/50 rounded-lg text-sm text-[#44D92C] font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter un véhicule
          </Link>
        </div>
      </div>
    </>
  );
}

// Carte véhicule pour la page garage
export function VehicleCard({ 
  vehicle,
  isActive,
  onSelect,
  onRemove,
}: {
  vehicle: SavedVehicle;
  isActive: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const typeIcons: Record<string, string> = {
    moto: '🏍️',
    quad: '🚗',
    'jet-ski': '🚤',
    motoneige: '❄️',
  };

  return (
    <div 
      className={cn(
        "relative p-5 rounded-xl border transition-all cursor-pointer",
        isActive 
          ? "bg-[#44D92C]/10 border-[#44D92C]" 
          : "bg-white/5 border-white/10 hover:border-white/20"
      )}
      onClick={onSelect}
    >
      {isActive && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-[#44D92C] text-black text-xs font-bold rounded">
          Actif
        </div>
      )}

      <div className="text-3xl mb-3">{typeIcons[vehicle.type] || '🏍️'}</div>
      
      <h3 className="font-bold text-lg">{vehicle.brand}</h3>
      <p className="text-gray-400">{vehicle.model}</p>
      <p className="text-sm text-gray-500">{vehicle.year}</p>

      <div className="flex gap-2 mt-4">
        <Link
          href={`/pieces-compatibles?type=${vehicle.type}&brand=${vehicle.brand}&model=${vehicle.model}&year=${vehicle.year}`}
          className="flex-1 py-2 text-center bg-[#44D92C] hover:bg-[#3bc425] text-black font-semibold rounded-lg text-sm transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          Voir les pièces
        </Link>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default SavedVehicle;
