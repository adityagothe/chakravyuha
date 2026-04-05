import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Required on Android before any notification operations
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

interface SettingsState {
  isDarkMode: boolean;
  remindersEnabled: boolean;
  initialize: () => Promise<void>;
  toggleDarkMode: () => Promise<void>;
  toggleReminders: () => Promise<void>;
}

const STORAGE_KEY_DARK_MODE = '@vittora_dark_mode';
const STORAGE_KEY_REMINDERS = '@vittora_reminders';

export const useSettingsStore = create<SettingsState>((set, get) => ({
  isDarkMode: false,
  remindersEnabled: false,

  initialize: async () => {
    try {
      const darkToggle = await AsyncStorage.getItem(STORAGE_KEY_DARK_MODE);
      const remindersToggle = await AsyncStorage.getItem(STORAGE_KEY_REMINDERS);
      
      set({ 
        isDarkMode: darkToggle === 'true',
        remindersEnabled: remindersToggle === 'true'
      });
      
      // If reminders are enabled, make sure to register them on app start if they got cleared
      if (remindersToggle === 'true') {
        await scheduleReminder().catch((err) => console.warn('[Vittora] scheduleReminder failed:', err));
      } else {
        await cancelReminders().catch((err) => console.warn('[Vittora] cancelReminders failed:', err));
      }

    } catch (e) {
      console.error('Failed to load settings', e);
    }
  },

  toggleDarkMode: async () => {
    const newVal = !get().isDarkMode;
    set({ isDarkMode: newVal });
    await AsyncStorage.setItem(STORAGE_KEY_DARK_MODE, String(newVal));
  },

  toggleReminders: async () => {
    const newVal = !get().remindersEnabled;
    set({ remindersEnabled: newVal });
    await AsyncStorage.setItem(STORAGE_KEY_REMINDERS, String(newVal));

    try {
      if (newVal) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          // Automatically turn off if denied
          set({ remindersEnabled: false });
          await AsyncStorage.setItem(STORAGE_KEY_REMINDERS, 'false');
          alert('Permission denied for notifications.');
          return;
        }
        await scheduleReminder();
        alert('Daily reminders enabled for 9:00 AM!');
      } else {
        await cancelReminders();
        alert('Reminders disabled.');
      }
    } catch (err) {
      console.warn('[Vittora] toggleReminders error:', err);
      alert('Could not update reminder settings.');
    }
  }
}));

async function scheduleReminder() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to Save! 💰',
      body: "Consistency beats intensity. Have you logged your savings today?",
    },
    trigger: {
      hour: 9, 
      minute: 0, 
      type: Notifications.SchedulableTriggerInputTypes.DAILY
    },
  });
}

async function cancelReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
