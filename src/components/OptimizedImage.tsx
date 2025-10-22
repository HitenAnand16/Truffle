import React, { memo } from 'react';
import { Image, ImageProps, ImageBackground, ImageBackgroundProps } from 'react-native';

// Optimized Image component
export const OptimizedImage = memo<ImageProps>(({ 
  source, 
  ...props 
}) => {
  return (
    <Image
      {...props}
      source={source}
      fadeDuration={150}
      resizeMethod="resize"
    />
  );
});

// Optimized ImageBackground component
export const OptimizedImageBackground = memo<ImageBackgroundProps>(({ 
  source, 
  children,
  ...props 
}) => {
  return (
    <ImageBackground
      {...props}
      source={source}
      fadeDuration={150}
      resizeMethod="resize"
    >
      {children}
    </ImageBackground>
  );
});

OptimizedImage.displayName = 'OptimizedImage';
OptimizedImageBackground.displayName = 'OptimizedImageBackground';
