import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View } from 'react-native';
import { SoundService } from '../../src/services/SoundService';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 88,
          backgroundColor: 'rgba(255, 255, 255, 0.97)',
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          borderTopWidth: 0,
          paddingBottom: 8,
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#1a237e',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        listeners={{
          tabPress: () => {
            SoundService.playKarmanyeva().catch(() => {});
          },
        }}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? '#1a237e' : '#e0e7ff',
                width: 58,
                height: 58,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -22,
                elevation: 6,
                shadowColor: '#1a237e',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: focused ? 0.35 : 0.1,
                shadowRadius: 8,
              }}
            >
              <MaterialIcons name="add" size={32} color={focused ? '#fff' : '#1a237e'} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="insights"
        options={{
          tabBarLabel: 'Insights',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="insights" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
