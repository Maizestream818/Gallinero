import { useFonts } from 'expo-font';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const AppLoaderLogo = () => {
  const [fontsLoaded, fontError] = useFonts({
    'Cooper-Black': require('../../assets/fonts/Fredoka-Bold.ttf'),
  });

  if (fontError) {
    console.error("Error al cargar fuente:", fontError);
  }

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      
      <View style={styles.centerWrapper}>
        
        {/* Textos */}
        <View style={styles.textRow}>
          <Text style={styles.culturaText}>Cultura </Text>
          <Text style={styles.uaappText}>UAAPP</Text>
        </View>

        {/* Corazon */}
        <View style={styles.heartWrapper}>
          <Svg width="350" height="350" viewBox="0 0 400 400">
            <Path
              d="
                M 170,180 
                C 170,150 160,130 140,125
                C 100,120 60,150 50,190
                C 40,240 70,280 110,305
                C 140,320 170,335 195,350
                C 205,355 210,360 215,365
                C 225,350 240,335 260,320
                C 290,300 325,270 345,230
                C 355,200 360,180 350,150
                C 335,120 285,115 250,135
                C 220,150 205,185 210,210
                C 212,225 220,235 230,240
              "
              fill="none"           
              stroke="white"        
              strokeWidth="35"      
              strokeLinecap="round"  
              strokeLinejoin="round" 
            />
          </Svg>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'transparent', 
  },
  centerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textRow: {
    position: 'absolute', 
    top: -20, // Esta es la posición "base" desde donde empiezan a bajar
    zIndex: 10,
    flexDirection: 'row', 
    
  },
  culturaText: {
    marginTop: 48, 
    color: 'white',
    fontSize: 30, 
    fontFamily: 'Cooper-Black',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 3, height: 4 },
    textShadowRadius: 4,
  },
  uaappText: {
    marginTop: 58, 
    color: 'white',
    fontSize: 40, 
    fontFamily: 'Cooper-Black',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 3, height: 4 },
    textShadowRadius: 4,
  },
  heartWrapper: {
    width: 350,
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 4, 
  },
});

export default AppLoaderLogo;