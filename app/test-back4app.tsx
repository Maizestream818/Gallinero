// app/test-back4app.tsx
import { ParseBaseFields, parseCreate, parseFind } from '@/lib/parseClient';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

type GameScore = {
  score: number;
  playerName: string;
  cheatMode: boolean;
} & ParseBaseFields;

export default function TestBack4AppScreen() {
  const [scores, setScores] = useState<GameScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadScores() {
    try {
      setLoading(true);
      setError(null);
      const data =
        await parseFind<Omit<GameScore, keyof ParseBaseFields>>('GameScore');
      setScores(data as GameScore[]);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function addDemoScore() {
    try {
      setLoading(true);
      setError(null);
      await parseCreate('GameScore', {
        score: Math.floor(Math.random() * 2000),
        playerName: 'Señor Jaime',
        cheatMode: false,
      });
      await loadScores();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadScores();
  }, []);

  return (
    <View className="flex-1 bg-slate-950 px-4 pt-12">
      <StatusBar style="light" />
      <Text className="mb-4 text-2xl font-bold text-white">
        Test Back4App (GameScore)
      </Text>

      {loading && (
        <View className="mb-4 flex-row items-center">
          <ActivityIndicator />
          <Text className="ml-2 text-slate-200">Cargando...</Text>
        </View>
      )}

      {error && <Text className="mb-4 text-red-400">Error: {error}</Text>}

      <View className="mb-4 flex-row">
        <Pressable
          onPress={addDemoScore}
          className="mr-2 rounded-lg bg-emerald-500 px-4 py-2"
        >
          <Text className="font-semibold text-white">Agregar score demo</Text>
        </Pressable>

        <Pressable
          onPress={loadScores}
          className="rounded-lg bg-sky-500 px-4 py-2"
        >
          <Text className="font-semibold text-white">Recargar</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1">
        {scores.length === 0 ? (
          <Text className="text-slate-300">No hay registros todavía.</Text>
        ) : (
          scores.map((item) => (
            <View
              key={item.objectId}
              className="mb-3 rounded-xl border border-slate-700 p-3"
            >
              <Text className="font-semibold text-white">
                {item.playerName} — {item.score}
              </Text>
              <Text className="text-xs text-slate-400">
                ID: {item.objectId}
              </Text>
              <Text className="text-xs text-slate-400">
                cheatMode: {String(item.cheatMode)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
