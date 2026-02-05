import React from 'react';
import { View } from 'react-native';
//Compoente que forma el botón del menú 
type Props = {
  size?: number;//Ancho de icono
  lineHeight?: number; //Grosor de lineas
  gap?: number; //Separacion entre lineas
  color?: string; //color manejable del icono
};

export function HamburgerIcon({
  size = 22,
  lineHeight = 2.5,
  gap = 5,
  color = "#000000", 
}: Props) {
  const lineStyle = { //Estilo base reutilizado por cada linea
    height: lineHeight,
    width: size,
    backgroundColor: color,
    borderRadius: 999,
  };

  return (
    <View style={{ width: size }}>
      <View style={lineStyle} />
      <View style={{ height: gap }} />
      <View style={lineStyle} />
      <View style={{ height: gap }} />
      <View style={lineStyle} />
    </View>
  );
}
