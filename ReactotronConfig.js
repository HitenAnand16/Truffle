import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  Reactotron
    .configure({ name: 'Truffle' })
    .useReactNative({
      asyncStorage: false,
      networking: {
        ignoreUrls: /symbolicate/
      },
      editor: false,
      errors: { veto: (stackFrame) => false },
      overlay: false,
    })
    .connect();

  // Clear Reactotron on every time we load the app
  Reactotron.clear();

  // Extend console
  console.tron = Reactotron;
}

export default Reactotron;
