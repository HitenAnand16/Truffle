/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Ignore specific warnings for better performance
LogBox.ignoreLogs([
  'Animated: `useNativeDriver` was not specified. This is a required option and will default to `false` in a future release.',
  'VirtualizedLists should never be nested inside plain ScrollViews',
  'Warning: Cannot update during an existing state transition',
]);

AppRegistry.registerComponent(appName, () => App);
