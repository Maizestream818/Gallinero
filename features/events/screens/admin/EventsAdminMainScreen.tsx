// features/events/screens/admin/EventsAdminMainScreen.tsx
import { EventCard, type Event } from '@/features/events/components/EventCard';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  SectionList,
  Text,
  TextInput,
  View,
} from 'react-native';

// Modo claro/oscuro
import { useColorScheme } from '@/hooks/use-color-scheme';

// Date / time picker
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

// Cámara + escáner QR
import { CameraView, useCameraPermissions } from 'expo-camera';

// Cliente Back4App (REST)
import {
  parseCreate,
  parseFind,
  type ParseBaseFields,
} from '@/lib/parseClient';

// 🔹 Usuario actual (admin)
import { useAuth } from '@/features/auth/AuthContext';

// 🔹 Logger de actividad
import { logActivity } from '@/utils/activityLogger';

type SectionTitle = 'Hoy' | 'Esta semana' | 'Próximos';

type EventSection = {
  title: SectionTitle;
  data: Event[];
};

// Evento tal como se guarda en Back4App
type EventPayload = {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  section: SectionTitle;
};

// Evento que viene de Back4App (incluye objectId)
type EventRecord = EventPayload & ParseBaseFields;

// Agrupa la lista plana de eventos por sección para el SectionList
function groupEventsBySection(records: EventRecord[]): EventSection[] {
  const bySection: Record<SectionTitle, Event[]> = {
    Hoy: [],
    'Esta semana': [],
    Próximos: [],
  };

  records.forEach((r) => {
    const ev: Event = {
      id: r.objectId, // usamos objectId de Parse como id de la card
      title: r.title,
      date: r.date,
      time: r.time,
      location: r.location,
      description: r.description,
    };

    const section: SectionTitle = r.section ?? 'Próximos';
    bySection[section].push(ev);
  });

  return [
    { title: 'Hoy', data: bySection['Hoy'] },
    { title: 'Esta semana', data: bySection['Esta semana'] },
    { title: 'Próximos', data: bySection['Próximos'] },
  ];
}

export function EventsAdminMainScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Admin logueado
  const { user } = useAuth();

  // Lista de eventos cargados desde Back4App
  const [sections, setSections] = useState<EventSection[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [savingEvent, setSavingEvent] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Formulario "crear"
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState<{
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    section: SectionTitle;
  }>({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    section: 'Hoy',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isTodaySelected, setIsTodaySelected] = useState(false);

  // Cámara / escáner QR
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [hasScanned, setHasScanned] = useState(false);

  // Invitados por evento
  const [scannedGuestsByEvent, setScannedGuestsByEvent] = useState<
    Record<string, string[]>
  >({});

  const closeDetail = () => setSelectedEvent(null);

  const resetNewEvent = () => {
    setNewEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      section: 'Hoy',
    });
    setIsTodaySelected(false);
  };

  const handleOpenCreate = () => {
    resetNewEvent();
    setShowCreateModal(true);
  };

  const handleCancelCreate = () => {
    resetNewEvent();
    setShowCreateModal(false);
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  // Leer eventos desde Back4App
  const loadEventsFromDatabase = async () => {
    try {
      setEventsError(null);
      setLoadingEvents(true);

      const records = (await parseFind<EventPayload>('Event')) as EventRecord[];

      if (!records || records.length === 0) {
        setSections([
          { title: 'Hoy', data: [] },
          { title: 'Esta semana', data: [] },
          { title: 'Próximos', data: [] },
        ]);
      } else {
        setSections(groupEventsBySection(records));
      }
    } catch (err) {
      console.error('Error cargando eventos', err);
      setEventsError(
        err instanceof Error ? err.message : 'Error al cargar eventos.',
      );
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    loadEventsFromDatabase();
  }, []);

  // Guardar (valida y guarda en Back4App)
  const handleCreateEvent = async () => {
    if (!newEvent.date || !newEvent.time) {
      Alert.alert(
        'Datos incompletos',
        'Seleccione la fecha y la hora del evento.',
      );
      return;
    }

    if (isTodaySelected) {
      const now = new Date();
      const [hourStr, minuteStr] = newEvent.time.split(':');
      const hours = Number(hourStr);
      const minutes = Number(minuteStr);

      if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
      ) {
        Alert.alert('Hora inválida', 'Seleccione una hora válida.');
        return;
      }

      const eventTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        0,
        0,
      );

      if (eventTime.getTime() < now.getTime()) {
        Alert.alert(
          'Hora en el pasado',
          'La hora seleccionada ya pasó. Elija una hora posterior a la actual.',
        );
        return;
      }
    }

    try {
      setSavingEvent(true);

      const payload: EventPayload = {
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
        location: newEvent.location,
        description: newEvent.description,
        section: newEvent.section,
      };

      // Guardar en Back4App
      await parseCreate('Event', payload);

      // 🔹 Registrar en ActivityLog quién creó el evento
      try {
        await logActivity(`Creó el evento "${payload.title}"`, {
          userId: (user as any)?.objectId,
          email: user?.email,
          fullName: user?.fullName,
        });
      } catch (logErr) {
        console.error(
          'Error registrando actividad de creación de evento',
          logErr,
        );
        // No bloqueamos la creación del evento si falla el log
      }

      // Recargar eventos
      await loadEventsFromDatabase();

      Alert.alert('Evento guardado', 'Evento guardado exitosamente.');
      setShowCreateModal(false);
      resetNewEvent();
      setShowDatePicker(false);
      setShowTimePicker(false);
    } catch (err) {
      console.error('Error guardando evento', err);
      Alert.alert(
        'Error',
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al guardar el evento.',
      );
    } finally {
      setSavingEvent(false);
    }
  };

  // Fecha → calcula sección automática
  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (event.type === 'dismissed' || !selectedDate) {
      setShowDatePicker(false);
      return;
    }

    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const startOfSelected = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
    );

    const diffMs = startOfSelected.getTime() - startOfToday.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    let autoSection: SectionTitle;
    if (diffDays === 0) {
      autoSection = 'Hoy';
    } else if (diffDays > 0 && diffDays <= 7) {
      autoSection = 'Esta semana';
    } else {
      autoSection = 'Próximos';
    }

    setIsTodaySelected(diffDays === 0);

    const formatted = selectedDate.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    setShowDatePicker(false);
    setNewEvent((prev) => ({
      ...prev,
      date: formatted,
      section: autoSection,
    }));
  };

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (event.type === 'dismissed' || !selectedDate) {
      setShowTimePicker(false);
      return;
    }

    const formatted = selectedDate.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    setShowTimePicker(false);
    setNewEvent((prev) => ({ ...prev, time: formatted }));
  };

  // --- Escáner QR ---
  const handleOpenScanner = async () => {
    if (!cameraPermission || cameraPermission.status !== 'granted') {
      const permission = await requestCameraPermission();

      if (!permission.granted) {
        Alert.alert(
          'Permiso de cámara',
          'Necesita otorgar permiso a la cámara para escanear invitaciones.',
        );
        return;
      }
    }

    setLastScannedCode(null);
    setHasScanned(false);
    setIsScannerVisible(true);
  };

  const handleCloseScanner = () => {
    setIsScannerVisible(false);
    setHasScanned(false);
  };

  const handleBarcodeScanned = (result: { data?: string }) => {
    if (!result?.data) return;
    if (hasScanned) return;

    const raw = result.data as string;
    let displayText = raw;

    try {
      const maybeJson = JSON.parse(raw);

      if (maybeJson && typeof maybeJson === 'object') {
        const nombre =
          (maybeJson as any).nombre ?? (maybeJson as any).name ?? undefined;
        const id =
          (maybeJson as any).id ?? (maybeJson as any).matricula ?? undefined;
        const correo =
          (maybeJson as any).correo ?? (maybeJson as any).email ?? undefined;

        const parts: string[] = [];
        if (nombre) parts.push(`Nombre: ${nombre}`);
        if (id) parts.push(`ID: ${id}`);
        if (correo) parts.push(`Correo: ${correo}`);

        if (parts.length > 0) {
          displayText = parts.join(' • ');
        }
      }
    } catch {
      // no era JSON
    }

    setHasScanned(true);
    setLastScannedCode(displayText);

    if (selectedEvent?.id) {
      setScannedGuestsByEvent((prev) => {
        const prevList = prev[selectedEvent.id] ?? [];
        if (prevList.includes(displayText)) {
          return prev;
        }

        return {
          ...prev,
          [selectedEvent.id]: [...prevList, displayText],
        };
      });
    }
  };

  const currentEventGuests =
    selectedEvent && scannedGuestsByEvent[selectedEvent.id]
      ? scannedGuestsByEvent[selectedEvent.id]
      : [];

  return (
    <View className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-sky-100'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 32,
          paddingTop: 40,
        }}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={(event) => {
              setSelectedEvent(event);
            }}
          />
        )}
        renderSectionHeader={({ section }) => (
          <Text
            className={`mt-4 mb-2 text-sm font-bold ${
              isDark ? 'text-slate-200' : 'text-slate-700'
            }`}
          >
            {section.title}
          </Text>
        )}
        // 🔹 AQUÍ vive el título y el botón "Agregar evento"
        ListHeaderComponent={
          <View className="mb-2">
            <Text
              className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Eventos (Admin)
            </Text>
            <Text
              className={`mt-1 text-xs ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Hoy, esta semana y próximos eventos.
            </Text>

            {loadingEvents && (
              <View className="mt-2 flex-row items-center gap-2">
                <ActivityIndicator size="small" />
                <Text
                  className={`text-[11px] ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Cargando eventos desde Back4App...
                </Text>
              </View>
            )}

            {eventsError && (
              <Text className="mt-2 text-[11px] text-red-400">
                Error al cargar eventos: {eventsError}
              </Text>
            )}

            <Pressable
              onPress={handleOpenCreate}
              className="mt-3 self-start rounded-full bg-emerald-600 px-4 py-2 active:opacity-80"
            >
              <Text className="text-xs font-semibold text-white">
                Agregar evento
              </Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-16">
            {loadingEvents ? (
              <>
                <ActivityIndicator />
                <Text
                  className={`mt-2 text-base ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Cargando eventos...
                </Text>
              </>
            ) : eventsError ? (
              <Text className="text-base text-red-400">
                Error al cargar eventos.
              </Text>
            ) : (
              <Text
                className={`text-base ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                No hay eventos programados.
              </Text>
            )}
          </View>
        }
      />

      {/* VENTANA DETALLE DEL EVENTO */}
      {!showCreateModal && selectedEvent && (
        <View
          className={`absolute inset-0 ${
            isDark ? 'bg-slate-950/95' : 'bg-sky-100/95'
          }`}
        >
          <View className="flex-1 justify-center px-4">
            <View
              className={`rounded-2xl border ${
                isDark
                  ? 'border-slate-700 bg-slate-900'
                  : 'border-sky-200 bg-white'
              }`}
              style={{ maxHeight: 520 }}
            >
              <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Pressable
                  onPress={closeDetail}
                  className={`mb-2 self-end rounded-full px-4 py-2 active:opacity-80 ${
                    isDark ? 'bg-slate-800' : 'bg-slate-200'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      isDark ? 'text-slate-100' : 'text-slate-800'
                    }`}
                  >
                    Cerrar
                  </Text>
                </Pressable>

                <Text className="text-xs font-semibold text-sky-400">
                  {selectedEvent.time
                    ? `${selectedEvent.date} • ${selectedEvent.time}`
                    : selectedEvent.date}
                </Text>

                <Text
                  className={`mt-2 text-2xl font-bold ${
                    isDark ? 'text-slate-50' : 'text-slate-900'
                  }`}
                >
                  {selectedEvent.title}
                </Text>

                {selectedEvent.location ? (
                  <Text
                    className={`mt-1 text-sm font-semibold ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {selectedEvent.location}
                  </Text>
                ) : null}

                <Text
                  className={`mt-4 text-sm leading-relaxed ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  {selectedEvent.description ?? 'Sin descripción disponible.'}
                </Text>

                <View
                  className={`mt-6 rounded-2xl border p-4 ${
                    isDark
                      ? 'border-slate-700 bg-slate-800'
                      : 'border-sky-200 bg-sky-50'
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      isDark ? 'text-slate-100' : 'text-slate-800'
                    }`}
                  >
                    Información adicional
                  </Text>
                  <Text
                    className={`mt-2 text-xs ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    Aquí después puede agregar más campos: profesor, tipo de
                    evento, enlace a videollamada, etc.
                  </Text>
                </View>

                {/* Botón escanear invitados */}
                <View className="mt-6">
                  <Pressable
                    onPress={handleOpenScanner}
                    className="w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-3 active:opacity-80"
                  >
                    <Text className="text-xs font-semibold text-white">
                      Escanear invitados
                    </Text>
                  </Pressable>

                  {currentEventGuests.length > 0 && (
                    <View
                      className={`mt-4 rounded-2xl border p-3 ${
                        isDark
                          ? 'border-slate-700 bg-slate-800'
                          : 'border-sky-200 bg-sky-50'
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          isDark ? 'text-slate-100' : 'text-slate-800'
                        }`}
                      >
                        Invitados escaneados ({currentEventGuests.length})
                      </Text>
                      <View className="mt-2 gap-1">
                        {currentEventGuests.map((code, index) => (
                          <View
                            key={`${code}-${index}`}
                            className="flex-row items-center gap-2"
                          >
                            <View className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <Text
                              className={`flex-1 text-[11px] ${
                                isDark ? 'text-slate-200' : 'text-slate-700'
                              }`}
                              numberOfLines={1}
                            >
                              {code}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      )}

      {/* VENTANA FORMULARIO CREAR EVENTO */}
      {showCreateModal && (
        <View
          className={`absolute inset-0 ${
            isDark ? 'bg-slate-950/95' : 'bg-sky-100/95'
          }`}
        >
          <View className="flex-1 justify-center px-4">
            <View
              className={`rounded-2xl border ${
                isDark
                  ? 'border-slate-700 bg-slate-900'
                  : 'border-sky-200 bg-white'
              }`}
              style={{ maxHeight: 620 }}
            >
              <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View className="mb-3 flex-row items-center justify-between">
                  <Text
                    className={`text-base font-semibold ${
                      isDark ? 'text-slate-50' : 'text-slate-900'
                    }`}
                  >
                    Crear nuevo evento
                  </Text>
                  <Pressable
                    onPress={handleCancelCreate}
                    className={`rounded-full px-3 py-1 active:opacity-80 ${
                      isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        isDark ? 'text-slate-100' : 'text-slate-800'
                      }`}
                    >
                      Cerrar
                    </Text>
                  </Pressable>
                </View>

                <Text
                  className={`mb-1 text-xs font-semibold ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  Título
                </Text>
                <TextInput
                  className={`mb-3 rounded-xl border px-3 py-2 text-sm ${
                    isDark
                      ? 'border-slate-700 bg-slate-800 text-slate-50'
                      : 'border-sky-200 bg-sky-50 text-slate-900'
                  }`}
                  placeholder="Nombre del evento"
                  placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                  value={newEvent.title}
                  onChangeText={(text) =>
                    setNewEvent((prev) => ({ ...prev, title: text }))
                  }
                />

                <Text
                  className={`mb-1 text-xs font-semibold ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  Fecha
                </Text>
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  className={`mb-3 rounded-xl border px-3 py-2 ${
                    isDark
                      ? 'border-slate-700 bg-slate-800'
                      : 'border-sky-200 bg-sky-50'
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      newEvent.date
                        ? isDark
                          ? 'text-slate-50'
                          : 'text-slate-900'
                        : isDark
                          ? 'text-slate-400'
                          : 'text-slate-500'
                    }`}
                  >
                    {newEvent.date || 'Seleccionar fecha'}
                  </Text>
                </Pressable>

                <Text
                  className={`mb-1 text-xs font-semibold ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  Hora
                </Text>
                <Pressable
                  onPress={() => setShowTimePicker(true)}
                  className={`mb-3 rounded-xl border px-3 py-2 ${
                    isDark
                      ? 'border-slate-700 bg-slate-800'
                      : 'border-sky-200 bg-sky-50'
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      newEvent.time
                        ? isDark
                          ? 'text-slate-50'
                          : 'text-slate-900'
                        : isDark
                          ? 'text-slate-400'
                          : 'text-slate-500'
                    }`}
                  >
                    {newEvent.time || 'Seleccionar hora'}
                  </Text>
                </Pressable>

                <Text
                  className={`mb-1 text-xs font-semibold ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  Lugar
                </Text>
                <TextInput
                  className={`mb-3 rounded-xl border px-3 py-2 text-sm ${
                    isDark
                      ? 'border-slate-700 bg-slate-800 text-slate-50'
                      : 'border-sky-200 bg-sky-50 text-slate-900'
                  }`}
                  placeholder="Ej. Aula 2, Auditorio, etc."
                  placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                  value={newEvent.location}
                  onChangeText={(text) =>
                    setNewEvent((prev) => ({ ...prev, location: text }))
                  }
                />

                <Text
                  className={`mb-1 text-xs font-semibold ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  Descripción
                </Text>
                <TextInput
                  className={`mb-3 h-24 rounded-xl border px-3 py-2 text-sm ${
                    isDark
                      ? 'border-slate-700 bg-slate-800 text-slate-50'
                      : 'border-sky-200 bg-sky-50 text-slate-900'
                  }`}
                  placeholder="Detalles del evento..."
                  placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                  value={newEvent.description}
                  multiline
                  textAlignVertical="top"
                  onChangeText={(text) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      description: text,
                    }))
                  }
                />

                <View className="mt-6 flex-row justify-end gap-3">
                  <Pressable
                    onPress={handleCancelCreate}
                    className={`rounded-full border px-4 py-2 active:opacity-80 ${
                      isDark ? 'border-slate-600' : 'border-slate-300'
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        isDark ? 'text-slate-200' : 'text-slate-700'
                      }`}
                    >
                      Cancelar
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleCreateEvent}
                    disabled={savingEvent}
                    className={`rounded-full px-4 py-2 active:opacity-80 ${
                      savingEvent ? 'bg-emerald-400/60' : 'bg-emerald-600'
                    }`}
                  >
                    <Text className="text-xs font-semibold text-white">
                      {savingEvent ? 'Guardando...' : 'Guardar'}
                    </Text>
                  </Pressable>
                </View>
              </ScrollView>

              {showDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  display="default"
                  onChange={handleTimeChange}
                />
              )}
            </View>
          </View>
        </View>
      )}

      {/* OVERLAY DEL ESCÁNER QR */}
      {isScannerVisible && (
        <View className="absolute inset-0 bg-black/95">
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={handleBarcodeScanned}
          />

          <View className="absolute inset-x-4 bottom-10 rounded-3xl border border-emerald-500/40 bg-slate-900/90 px-4 py-3 shadow-lg shadow-black/70">
            {lastScannedCode ? (
              <>
                <Text className="text-[11px] font-semibold tracking-wide text-emerald-300 uppercase">
                  Invitado escaneado
                </Text>
                <Text className="mt-1 text-xs text-slate-100" numberOfLines={2}>
                  {lastScannedCode}
                </Text>

                <View className="mt-3 flex-row justify-between gap-2">
                  <Pressable
                    onPress={() => {
                      setHasScanned(false);
                      setLastScannedCode(null);
                    }}
                    className="flex-1 items-center rounded-full bg-emerald-600 px-3 py-2 active:opacity-80"
                  >
                    <Text className="text-[11px] font-semibold text-white">
                      Escanear sig. invitado
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleCloseScanner}
                    className="flex-1 items-center rounded-full border border-slate-500 bg-slate-800/80 px-3 py-2 active:opacity-80"
                  >
                    <Text className="text-[11px] font-semibold text-slate-100">
                      Cerrar
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Text className="text-[11px] font-semibold tracking-wide text-slate-300 uppercase">
                  Apunte la cámara al código QR del invitado
                </Text>
                <Text className="mt-1 text-[11px] text-slate-400">
                  El contenido se mostrará aquí cuando se detecte un código.
                </Text>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
