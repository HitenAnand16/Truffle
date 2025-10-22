import React, { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface PerformanceMonitorProps {
  visible?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ visible = __DEV__ }) => {
  const [fps, setFps] = React.useState(60);
  const [memoryUsage, setMemoryUsage] = React.useState(0);

  useEffect(() => {
    if (!visible) return;

    let frameCount = 0;
    let lastTime = Date.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = Date.now();
      
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    measureFPS();

    // Memory monitoring (simplified)
    const memoryInterval = setInterval(() => {
      // In a real app, you'd use react-native-device-info
      // This is just a placeholder for memory monitoring
      setMemoryUsage(Math.round(Math.random() * 100)); // Mock value
    }, 2000);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(memoryInterval);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>FPS: {fps}</Text>
      <Text style={styles.text}>Memory: {memoryUsage}MB</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 8,
    borderRadius: 4,
    zIndex: 9999,
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});

export default PerformanceMonitor;
