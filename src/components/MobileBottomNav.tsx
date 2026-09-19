import React from 'react';
import { GraduationCap } from 'lucide-react';
import { ModuleNavTab } from '../modules/types';

interface MobileBottomNavProps {
  /** Aktif modülün sekmeleri (registry meta'sından gelir). */
  tabs: ModuleNavTab[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isHub: boolean;
  onSelectHub: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  isHub,
  onSelectHub
}) => {
  const items = [
    { id: 'hub', label: 'Alanlar', icon: GraduationCap, onSelect: onSelectHub, isActive: isHub },
    ...tabs.map((tab) => ({
      id: tab.id,
      label: tab.shortLabel ?? tab.label,
      icon: tab.icon,
      onSelect: () => setActiveTab(tab.id),
      isActive: !isHub && activeTab === tab.id
    }))
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E6E1D8] px-2 py-1 shadow-lg">
      <div
        className="grid items-center justify-around"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={item.onSelect}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all relative ${
                item.isActive
                  ? 'text-rose-700 font-bold'
                  : 'text-[#7A756D] hover:text-[#1F1E1B] font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${item.isActive ? 'text-rose-600 scale-110' : 'text-[#7A756D]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {item.isActive && (
                <span className="w-1 h-1 rounded-full bg-rose-600 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
