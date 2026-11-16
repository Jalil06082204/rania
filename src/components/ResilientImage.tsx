import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  priority?: boolean;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF9F6] via-[#F4DDE3]/60 to-[#F3E9DD] text-[#51434A] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Heart className="w-8 h-8 text-[#C97A92] stroke-[1.5] mb-2 opacity-80" />
        {fallbackTitle && (
          <span className="font-serif-editorial text-sm italic text-[#51434A]/80">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#FFF9F6]">
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#FFF9F6] via-[#F3E9DD]/70 to-[#F4DDE3]/40 animate-pulse"
          aria-hidden="true"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
