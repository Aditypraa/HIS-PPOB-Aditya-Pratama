import React from 'react';
// Update the import
import { Banner } from '../../types';

interface PromoBannerProps {
  banner: Banner;
}

function PromoBanner({ banner }: PromoBannerProps) {
  return (
    <div className="flex-shrink-0 w-64 h-36 rounded-lg shadow-md mr-4 overflow-hidden relative group">
      <img
        src={banner.banner_image}
        alt={banner.banner_name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/256x144/cccccc/ffffff?text=Banner'}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-3 flex flex-col justify-end">
        <h4 className="font-bold text-sm text-white mb-1">{banner.banner_name}</h4>
        <p className="text-xs text-gray-200 line-clamp-2">{banner.description}</p>
      </div>
    </div>
  );
}

export default PromoBanner;
