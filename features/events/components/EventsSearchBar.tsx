/*Este componente es un Imput controlado que permite al usuario escribir texto para buscar
cualquier evento que desee.
-No filtra eventos directamente
-Solo gestiona la entrada de texto
-Busca coincidencias en el título del eveto y coincidencias en las etiquetas(tags)
 */

import React from 'react';
import { Text, TextInput, View } from 'react-native';


type Props = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
};

export function EventsSearchBar({
  value,
  onChange,
  placeholder = 'Buscar evento o etiqueta',
}: Props) {//los props manejan el value para el texto actual de la búsqueda y onChange es un callback para actualizar el estado en el componente padre
  return (
    <View className="mt-5 flex-row items-center rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
      
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        className="flex-1 text-sm text-slate-900 dark:text-slate-50"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing" // iOS
      />
    </View>
  );
}
