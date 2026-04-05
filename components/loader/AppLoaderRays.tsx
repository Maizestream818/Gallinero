import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const AppLoaderRays = () => {

  
  const raysConfig = [

    { id: 0,  color: '#33CC33', angle: 0,   innerRadius: 160, label: 'Centro Derecha' },
    { id: 1,  color: '#FFFF33', angle: 30,  innerRadius: 150, label: 'Abajo Derecha' },
    { id: 2,  color: '#FF9933', angle: 60,  innerRadius: 165, label: 'Abajo Derecha (Cerca punta)' },
    { id: 3,  color: '#FF3333', angle: 90,  innerRadius: 185, label: 'Abajo Centro (Punta del corazón)' },
    { id: 4,  color: '#FF66CC', angle: 120, innerRadius: 165, label: 'Abajo Izquierda' },
    { id: 5,  color: '#FF33CC', angle: 150, innerRadius: 150, label: 'Abajo Izquierda' },
    { id: 6,  color: '#33CC33', angle: 180, innerRadius: 165, label: 'Centro Izquierda (Lóbulo gordo)' },
    { id: 7,  color: '#FFFF33', angle: 210, innerRadius: 160, label: 'Arriba Izquierda' },
    { id: 8,  color: '#FF9933', angle: 240, innerRadius: 190, label: 'Arriba Izquierda (Cerca texto)' },
    { id: 9,  color: '#FF3333', angle: 270, innerRadius: 210, label: 'Arriba Centro (TEXTO CULTURA UAAPP)' },
    { id: 10, color: '#FF66CC', angle: 300, innerRadius: 190, label: 'Arriba Derecha (Cerca texto)' },
    { id: 11, color: '#FF33CC', angle: 330, innerRadius: 160, label: 'Arriba Derecha' },
  ];
  // Grosor de cada rayo en grados
  const rayAngleWidth = 10; 

  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%" viewBox={`0 0 ${width} ${height}`}>
       
        <G transform={`translate(${width / 2}, ${height / 2})`}>
          
          {raysConfig.map((ray) => {
            
          
            const drawRayPath = () => {
              const startRadius = ray.innerRadius; 
              const endRadius = Math.max(width, height) * 1.5; // Termina fuera de la pantalla
              
              // Convertimos el ángulo a radianes
              const startAngleRad = (ray.angle - rayAngleWidth / 2) * (Math.PI / 180);
              const endAngleRad = (ray.angle + rayAngleWidth / 2) * (Math.PI / 180);

              // Coordenadas de los 4 puntos
              const startX1 = Math.cos(startAngleRad) * startRadius;
              const startY1 = Math.sin(startAngleRad) * startRadius;
              const startX2 = Math.cos(endAngleRad) * startRadius;
              const startY2 = Math.sin(endAngleRad) * startRadius;

              const endX1 = Math.cos(startAngleRad) * endRadius;
              const endY1 = Math.sin(startAngleRad) * endRadius;
              const endX2 = Math.cos(endAngleRad) * endRadius;
              const endY2 = Math.sin(endAngleRad) * endRadius;

              // Dibuja la forma
              return `M${startX1},${startY1} L${startX2},${startY2} L${endX2},${endY2} L${endX1},${endY1} Z`;
            };

            return (
              <Path
                key={ray.id}
                d={drawRayPath()}
                fill={ray.color}
                opacity={0.9} 
              />
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent', 
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppLoaderRays;