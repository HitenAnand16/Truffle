import { Platform } from 'react-native';

export class VideoPerformanceManager {
  private static instance: VideoPerformanceManager;
  private activeVideoCount = 0;
  private memoryWarningCallbacks: (() => void)[] = [];

  static getInstance(): VideoPerformanceManager {
    if (!VideoPerformanceManager.instance) {
      VideoPerformanceManager.instance = new VideoPerformanceManager();
    }
    return VideoPerformanceManager.instance;
  }

  registerVideo(): void {
    this.activeVideoCount++;
    if (this.activeVideoCount > 2) {
      console.warn('Multiple videos detected. Consider optimizing for performance.');
    }
  }

  unregisterVideo(): void {
    this.activeVideoCount = Math.max(0, this.activeVideoCount - 1);
  }

  addMemoryWarningCallback(callback: () => void): void {
    this.memoryWarningCallbacks.push(callback);
  }

  removeMemoryWarningCallback(callback: () => void): void {
    const index = this.memoryWarningCallbacks.indexOf(callback);
    if (index > -1) {
      this.memoryWarningCallbacks.splice(index, 1);
    }
  }

  handleMemoryWarning(): void {
    this.memoryWarningCallbacks.forEach(callback => callback());
  }

  getOptimalVideoSettings() {
    const isLowEnd = Platform.OS === 'android' && Platform.Version < 26;
    
    return {
      maxBitRate: isLowEnd ? 150000 : 200000,
      bufferConfig: {
        minBufferMs: isLowEnd ? 500 : 1000,
        maxBufferMs: isLowEnd ? 3000 : 5000,
        bufferForPlaybackMs: isLowEnd ? 500 : 1000,
        bufferForPlaybackAfterRebufferMs: isLowEnd ? 500 : 1000,
      },
      opacity: isLowEnd ? 0.5 : 0.6,
    };
  }
}

export const videoPerformanceManager = VideoPerformanceManager.getInstance();
