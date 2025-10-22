import { InteractionManager } from 'react-native';

// Utility to defer expensive operations
export const deferExpensiveOperation = (callback: () => void) => {
  InteractionManager.runAfterInteractions(() => {
    callback();
  });
};

// Memory-efficient image size calculator
export const calculateOptimalImageSize = (originalSize: { width: number; height: number }, maxSize: number) => {
  const { width, height } = originalSize;
  
  if (width <= maxSize && height <= maxSize) {
    return { width, height };
  }
  
  const aspectRatio = width / height;
  
  if (width > height) {
    return {
      width: maxSize,
      height: Math.round(maxSize / aspectRatio),
    };
  } else {
    return {
      width: Math.round(maxSize * aspectRatio),
      height: maxSize,
    };
  }
};

// Debounce function for performance
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function for performance
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// Check if device has enough memory for operations
export const hasEnoughMemory = (): boolean => {
  // This is a simple heuristic - in a real app you might want to use
  // react-native-device-info to get actual memory information
  return true;
};

// Create a memory-efficient array chunking function
export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};
