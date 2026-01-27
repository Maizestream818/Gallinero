// Componente que muestra un modal para editar los datos del usuario
import React, { useState, useEffect } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';

export function UserEditProfileModal({ visible, onClose, user, onSave }) {

  // Estado para guardar temporalmente los datos que se editan en el formulario
  const [formData, setFormData] = useState(user);

  // Este efecto se ejecuta cada vez que cambia el usuario recibido por props y se actualizan los datos del usuario 
  useEffect(() => {
    setFormData(user);
  }, [user]);

  //  esta funcion que se ejecuta cuando se presiona el botón de guardar
  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    // Modal que aparece desde abajo, nos ayuda a modificar la informacion del usuario
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        
      {/* el fondo es oscuro por defecto del modal */}
      <View className="flex-1 justify-end bg-black/50">

        {/* Contenedor principal */}
        <View className="bg-white rounded-t-2xl p-5 h-[80%]">

          {/* Encabezado del modal */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold">Editar datos</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-red-500">Cancelar</Text>
            </TouchableOpacity>
          </View>

          {/* usamos un scrool para poder ver desplazarnos */}
          <ScrollView>

            {/* Campo para el nombre */}
            <View className="mb-3">
              <Text>Nombre</Text>
              <TextInput
                className="bg-slate-100 p-3 rounded-lg"
                value={formData.nombre}
                // Actualiza solo el campo nombre sin perder los demás datos
                onChangeText={(t) => setFormData({ ...formData, nombre: t })}
              />
            </View>

            {/* Campo para el correo */}
            <View className="mb-3">
              <Text>Correo</Text>
              <TextInput
                className="bg-slate-100 p-3 rounded-lg"
                value={formData.correo}
                keyboardType="email-address"
                // Actualiza el correo dentro del estado
                onChangeText={(t) => setFormData({ ...formData, correo: t })}
              />
            </View>

            {/* Campo para la carrera */}
            <View className="mb-3">
              <Text>Carrera</Text>
              <TextInput
                className="bg-slate-100 p-3 rounded-lg"
                value={formData.carrera}
                onChangeText={(t) => setFormData({ ...formData, carrera: t })}
              />
            </View>

            {/* para reducir espacio grado y grupo en una misma fila */}
            <View className="flex-row gap-3 mb-3">

              {/* Campo grado */}
              <View className="flex-1">
                <Text>Grado</Text>
                <TextInput
                  className="bg-slate-100 p-3 rounded-lg"
                  value={formData.grado}
                  onChangeText={(t) => setFormData({ ...formData, grado: t })}
                />
              </View>

              {/* Campo grupo */}
              <View className="flex-1">
                <Text>Grupo</Text>
                <TextInput
                  className="bg-slate-100 p-3 rounded-lg"
                  value={formData.grupo}
                  onChangeText={(t) => setFormData({ ...formData, grupo: t })}
                />
              </View>
            </View>

            {/* Campo para nivel academico */}
            <View className="mb-5">
              <Text>Nivel académico</Text>
              <TextInput
                className="bg-slate-100 p-3 rounded-lg"
                value={formData.nivel_academico}
                onChangeText={(t) =>
                  setFormData({ ...formData, nivel_academico: t })
                }
              />
            </View>

            {/* Boton para guardar los cambios */}
            <TouchableOpacity
              className="bg-blue-600 p-3 rounded-lg items-center"
              onPress={handleSave}
            >
              <Text className="text-white font-bold">Guardar</Text>
            </TouchableOpacity>

            <View className="h-6" />

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
