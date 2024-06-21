import * as React from 'react';

import Layout from './src/layout/Layout.js';
import StoreProvider from './src/context/Provider.js';
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';
import 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { WithSplashScreen } from './src/layout/Splash.js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1da1f2',
  },
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StoreProvider>
        <WithSplashScreen>
          <PaperProvider theme={theme}>
            <Layout />
            <Toast />
          </PaperProvider>
        </WithSplashScreen>
      </StoreProvider>
    </GestureHandlerRootView>
  );
};

export default App;
