/*-Componente que permite al usuario seleccionar que secciones de eventos desea ver: HOY, ESTA SEMANA, PROXIMOS.
-Emite el estado seleccionado al componente EventsStudentMainScreen y EventsAdminMainScreen

 */
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export type EventsSectionFilter = {
  today: boolean;
  week: boolean;
  upcoming: boolean;
};

type Props = {
  value: EventsSectionFilter;
  onChange: (next: EventsSectionFilter) => void;
};

/*ToogleItem representa una opción individual del checklist
-Es un componente controlado:
    - checked indicando si esta activo o no
    onPress notificando el cambio al componente donde se muestra
 */
function ToggleItem({
  label,
  checked,
  onPress,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center">
      <View
        className={
          checked
            ? 'h-5 w-5 items-center justify-center rounded-md bg-emerald-500 dark:bg-emerald-400'
            : 'h-5 w-5 items-center justify-center rounded-md border border-slate-400 dark:border-slate-500'
        }
      >
        {checked ? <Text className="text-xs font-bold text-white">✓</Text> : null}
      </View>

      <Text className="ml-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </Text>
    </Pressable>
  );
}

export function EventsSectionChecklist({ value, onChange }: Props) {
  return (
    <View className="mt-4 flex-row items-center justify-between">
      <ToggleItem
        label="Hoy"
        checked={value.today}
        onPress={() => onChange({ ...value, today: !value.today })}
      />
      <ToggleItem
        label="Esta semana"
        checked={value.week}
        onPress={() => onChange({ ...value, week: !value.week })}
      />
      <ToggleItem
        label="Próximos"
        checked={value.upcoming}
        onPress={() => onChange({ ...value, upcoming: !value.upcoming })}
      />
    </View>
  );
}
