import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { GoalService } from '../src/services/GoalService';
import { useGoalStore } from '../src/stores/useGoalStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';

export default function GoalSetupScreen() {
  const router = useRouter();
  const refreshDashboard = useGoalStore(s => s.refreshDashboard);
  
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [deadline, setDeadline] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const currencies = ['USD', 'EUR', 'GBP', 'INR'];

  const getCurrencySymbol = (code: string) => {
    switch (code) {
      case 'INR': return '₹';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '$';
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleCreateGoal = async () => {
    if (!name || !amount || !deadline) {
      Alert.alert('Missing Info', 'Please fill out all fields.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid target amount.');
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(deadline)) {
      Alert.alert('Invalid Date', 'Please enter a date in YYYY-MM-DD format.');
      return;
    }
    const parsedDate = new Date(deadline);
    if (isNaN(parsedDate.getTime())) {
      Alert.alert('Invalid Date', 'That date doesn\'t exist. Please check and try again.');
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate < today) {
      Alert.alert('Invalid Date', 'Deadline must be in the future.');
      return;
    }

    const earningCurrency = currency === 'INR' ? 'USD' : 'INR';

    try {
      await GoalService.createGoal(name, numAmount, currency, earningCurrency, deadline, imageUri.trim() || undefined);
      await refreshDashboard();
      router.back();
    } catch (error: any) {
      console.error('[GoalSetup] Creation failed:', error);
      Alert.alert('Error', error?.message || 'Failed to create goal.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={24} color="#1a237e" />
        <Text style={styles.backText}>Vittora</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>Curating Your Future</Text>
        <Text style={styles.title}>Define your next <Text style={{fontStyle: 'italic', color: '#000666'}}>milestone.</Text></Text>
        <Text style={styles.subtitle}>Financial clarity begins with intention. Set your goal and let Vittora guide the journey.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>What are you dreaming of?</Text>
        <TextInput 
          style={styles.inputHero}
          placeholder="e.g., New Car, Dream Home, Travel"
          placeholderTextColor="#767683"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.card, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.labelMini}>TARGET AMOUNT</Text>
          <View style={styles.amountInputRow}>
            <Text style={styles.currencySymbol}>{getCurrencySymbol(currency)}</Text>
            <TextInput 
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#767683"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        <View style={[styles.card, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.labelMini}>CURRENCY</Text>
          <View style={styles.currencyRow}>
            {currencies.map(cur => (
              <TouchableOpacity 
                key={cur} 
                style={[styles.curBtn, currency === cur && styles.curBtnActive]}
                onPress={() => setCurrency(cur)}
              >
                <Text style={[styles.curBtnText, currency === cur && styles.curBtnTextActive]}>{cur}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.labelMini}>DEADLINE</Text>
        <Text style={styles.descText}>When do you want to reach this goal?</Text>
        {Platform.OS === 'web' ? (
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            style={{
              backgroundColor: '#f3f4f5',
              borderRadius: 12,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 16,
              paddingBottom: 16,
              fontSize: 18,
              fontWeight: 500,
              color: '#191c1d',
              border: 'none',
              width: '100%',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
        ) : (
          <>
            <TouchableOpacity onPress={() => setShowPicker(true)} activeOpacity={0.8}>
              <View pointerEvents="none">
                <TextInput 
                  style={styles.inputHero}
                  placeholder="Select Date"
                  placeholderTextColor="#767683"
                  value={deadline}
                  editable={false}
                />
              </View>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={deadline ? new Date(deadline) : new Date()}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(event: any, selectedDate?: Date) => {
                  setShowPicker(Platform.OS === 'ios');
                  if (event.type !== 'dismissed' && selectedDate) {
                    const offsetDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000));
                    setDeadline(offsetDate.toISOString().split('T')[0]);
                  }
                }}
              />
            )}
          </>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.labelMini}>VISION BOARD IMAGE (OPTIONAL)</Text>
        <Text style={styles.descText}>Select an image to represent your goal.</Text>
        
        {imageUri ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImageUri('')}>
              <MaterialIcons name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage} activeOpacity={0.8}>
            <MaterialIcons name="add-photo-alternate" size={32} color="#1a237e" />
            <Text style={styles.imagePickerText}>Tap to choose your vision image</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleCreateGoal}>
        <Text style={styles.submitText}>Create Goal</Text>
        <MaterialIcons name="trending-up" size={20} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 24, paddingBottom: 64 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 32 },
  backText: { fontSize: 20, fontWeight: '800', color: '#1a237e', marginLeft: 8 },
  
  header: { marginBottom: 32 },
  eyebrow: { fontSize: 10, fontWeight: 'bold', color: '#1a237e', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  title: { fontSize: 32, fontWeight: '800', color: '#191c1d', lineHeight: 40 },
  subtitle: { fontSize: 14, color: '#454652', marginTop: 16, lineHeight: 22 },
  
  card: { backgroundColor: '#ffffff', padding: 24, borderRadius: 24, marginBottom: 16, shadowColor: '#191c1d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 16, elevation: 2 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#000666', marginBottom: 16 },
  labelMini: { fontSize: 12, fontWeight: 'bold', color: '#000666', letterSpacing: 1, marginBottom: 12 },
  inputHero: { backgroundColor: '#f3f4f5', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 16, fontSize: 18, fontWeight: '500', color: '#191c1d' },
  descText: { fontSize: 12, color: '#454652', marginBottom: 16 },
  
  row: { flexDirection: 'row' },
  amountInputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#e1e3e4', paddingBottom: 8 },
  currencySymbol: { fontSize: 24, fontWeight: 'bold', color: '#454652', marginRight: 8 },
  amountInput: { flex: 1, fontSize: 28, fontWeight: 'bold', color: '#191c1d', padding: 0 },
  
  currencyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  curBtn: { backgroundColor: '#e7e8e9', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, flexGrow: 1, alignItems: 'center' },
  curBtnActive: { backgroundColor: '#000666' },
  curBtnText: { fontSize: 12, fontWeight: 'bold', color: '#454652' },
  curBtnTextActive: { color: '#ffffff' },

  // Image Picker Styles
  imagePickerBtn: { backgroundColor: '#f3f4f5', borderRadius: 12, padding: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#e1e3e4', borderStyle: 'dashed' },
  imagePickerText: { fontSize: 14, fontWeight: '600', color: '#1a237e', marginTop: 12 },
  imagePreviewContainer: { borderRadius: 12, overflow: 'hidden', height: 160, backgroundColor: '#f3f4f5', position: 'relative' },
  imagePreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  removeImageBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.6)', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },

  submitBtn: { backgroundColor: '#1a237e', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 20, borderRadius: 100, marginTop: 24, gap: 12, shadowColor: '#1a237e', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 5 },
  submitText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
});
