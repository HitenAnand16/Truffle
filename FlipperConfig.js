/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {FlipperDevicePlugin, FlipperPlugin} from 'flipper';

if (__DEV__) {
  import('flipper-plugin-react-native-performance').then(
    ({reactNativePerformancePlugin}) => {
      // Add the plugin
    }
  );
}

export default null;
