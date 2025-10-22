import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, AppState } from 'react-native';
import Video from 'react-native-video';
import { videoPerformanceManager } from '../utils/videoPerformance';

interface VideoBackgroundProps {
  source: any;
  style?: any;
  opacity?: number;
  resizeMode?: 'cover' | 'contain' | 'stretch';
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const VideoBackground: React.FC<VideoBackgroundProps> = ({
  source,
  style,
  opacity = 0.7,
  resizeMode = 'cover'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<any>(null);
  const optimalSettings = videoPerformanceManager.getOptimalVideoSettings();

  // Handle app state changes for performance
  useEffect(() => {
    // Register this video instance
    videoPerformanceManager.registerVideo();

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        setPaused(true);
      } else if (nextAppState === 'active') {
        setPaused(false);
      }
    };

    const handleMemoryWarning = () => {
      setPaused(true);
      setTimeout(() => setPaused(false), 1000); // Brief pause to free memory
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    videoPerformanceManager.addMemoryWarningCallback(handleMemoryWarning);

    return () => {
      subscription?.remove();
      videoPerformanceManager.unregisterVideo();
      videoPerformanceManager.removeMemoryWarningCallback(handleMemoryWarning);
    };
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (error: any) => {
    console.warn('Video Background Error:', error);
    setIsLoading(false);
  };

  return (
    <View style={[styles.container, style]}>
      <Video
        ref={videoRef}
        source={source}
        style={[
          styles.video,
          { opacity: isLoading ? 0 : (opacity || optimalSettings.opacity) }
        ]}
        resizeMode={resizeMode}
        repeat={true}
        muted={true}
        paused={paused}
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
        onLoad={handleLoad}
        onError={handleError}
        // Performance optimizations
        bufferConfig={optimalSettings.bufferConfig}
        maxBitRate={optimalSettings.maxBitRate}
        disableFocus={true}
        hideShutterView={true}
        shutterColor="transparent"
        poster="" // No poster to reduce memory usage
        progressUpdateInterval={2000} // Reduce progress updates
        reportBandwidth={false} // Disable bandwidth reporting for performance
      />
      
      {/* Overlay to ensure content readability */}
      <View style={styles.overlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Light overlay for readability
  },
});

export default VideoBackground;
