
import React from 'react';
import { CivitaiModel } from '../types';

interface ModelCardProps {
  model: CivitaiModel;
  onSelect: (model: CivitaiModel) => void;
  isSelected: boolean;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onSelect, isSelected }) => {
  const thumbnail = model.modelVersions?.[0]?.images?.[0]?.url || 'https://picsum.photos/200/300';
  const baseModel = model.modelVersions?.[0]?.baseModel || 'SDXL';

  return (
    <div 
      onClick={() => onSelect(model)}
      className={`relative group cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 border ${
        isSelected ? 'ring-2 ring-blue-500 border-transparent bg-blue-500/10' : 'border-white/5 bg-gray-900 hover:border-white/10'
      }`}
    >
      <div className="aspect-[3/4] overflow-hidden bg-gray-800">
        <img 
          src={thumbnail} 
          alt={model.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-[11px] font-bold truncate text-white uppercase tracking-tighter">{model.name}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[9px] font-bold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded border border-blue-400/20">
            {baseModel}
          </span>
          <span className="text-[9px] text-gray-400">by {model.creator?.username || 'Civitai'}</span>
        </div>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
      )}
    </div>
  );
};

export default ModelCard;
