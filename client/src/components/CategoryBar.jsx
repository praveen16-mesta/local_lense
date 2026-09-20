import React from 'react';
import { Layers, AlertTriangle, Droplet, Zap, Trash2, Shield, Compass, Navigation } from 'lucide-react';

const CATEGORIES = [
  { id: 'All', label: 'All Issues', icon: Layers },
  { id: 'Potholes', label: 'Potholes', icon: AlertTriangle },
  { id: 'Water Supply', label: 'Water Supply', icon: Droplet },
  { id: 'Electricity', label: 'Electricity', icon: Zap },
  { id: 'Waste Management', label: 'Waste', icon: Trash2 },
  { id: 'Safety', label: 'Safety', icon: Shield },
  { id: 'Roads', label: 'Roads', icon: Navigation },
  { id: 'Other', label: 'Other', icon: Compass }
];

export default function CategoryBar({ activeCategory, setActiveCategory }) {
  return (
    <div className="category-bar">
      <div className="category-scroll">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              className={`category-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <Icon size={16} />
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
