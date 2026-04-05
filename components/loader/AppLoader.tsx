import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppLoaderLogo from './AppLoaderLogo';
import AppLoaderRays from './AppLoaderRays';

const AppLoader = () => {
  return (
    <View style={styles.mainContainer}>
      {/* Rayos */}
      <AppLoaderRays />
      
      {/* El logo encima de los rayos */}
      <AppLoaderLogo />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppLoader;