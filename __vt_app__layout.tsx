import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { getDB } from '../src/db/database';

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initDB() {
      try {
        await getDB();
        setDbReady(true);
      } catch (e) {
        console.error('[Vittora] DB init failed:', e);
        setError(e instanceof Error ? e.message : 'Unknown error');
      }
    }
    initDB();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f8f9fa', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ba1a1a', marginBottom: 12 }}>Database Error</Text>
        <Text style={{ fontSize: 14, color: '#454652', textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f8f9fa', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: '800', color: '#1a237e', marginBottom: 16 }}>Vittora</Text>
        <ActivityIndicator size="small" color="#1a237e" />
        <Text style={{ marginTop: 12, color: '#767683', fontSize: 13 }}>Preparing your sanctuary…</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="goal-setup"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </>
  );
}
