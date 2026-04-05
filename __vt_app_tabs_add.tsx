import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGoalStore } from '../../src/stores/useGoalStore';
import { TransactionService } from '../../src/services/TransactionService';
import { CurrencyService, NoCachedRateError } from '../../src/services/CurrencyService';
import { CurrencyCode } from '../../src/types/models';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { SoundService } from '../../src/services/SoundService';

const CATEGORIES = ['salary', 'freelance', 'investment', 'other'] as const;
const CURRENCIES: CurrencyCode[] = ['USD', 'INR', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];

export default function AddTransactionScreen() {
  const router = useRouter();
  const { goalsData, addTransactionOptimistic } = useGoalStore();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(
    goalsData.length > 0 ? goalsData[0].goal.id : null
  );

  const activeGoal = goalsData.find(g => g.goal.id === selectedGoalId)?.goal;

  const [type, setType] = useState<'deposit'|'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [category, setCategory] = useState<string>('salary');
  const [note, setNote] = useState('');
  const [date] = useState<string>(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  });

  const [convertedCurrency, setConvertedCurrency] = useState<string>('USD');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [rate, setRate] = useState<number>(1);
  const [rateSource, setRateSource] = useState<string>('live');
  const [rateWarning, setRateWarning] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [needsManualRate, setNeedsManualRate] = useState(false);
  const [manualRate, setManualRate] = useState('');

  useEffect(() => {
    if (activeGoal) {
      setCurrency(activeGoal.earning_currency as CurrencyCode);
      setConvertedCurrency(activeGoal.target_currency);
    }
  }, [activeGoal]);

  useEffect(() => {
    if (goalsData.length > 0 && !selectedGoalId) {
      setSelectedGoalId(goalsData[0].goal.id);
    }
  }, [goalsData, selectedGoalId]);

  const fetchConversion = useCallback(async (amt: string) => {
    if (!activeGoal) return;
    const numAmt = parseFloat(amt);
    if (isNaN(numAmt) || numAmt <= 0) {
      setConvertedAmount(null);
      return;
    }

    setIsConverting(true);
    setRateWarning(null);
    setNeedsManualRate(false);

    try {
      const result = await CurrencyService.convert(numAmt, currency, activeGoal.target_currency as CurrencyCode);
      setConvertedAmount(result.converted_amount);
      setRate(result.rate);
      setRateSource(result.source);
      if (result.warning) setRateWarning(result.warning);
    } catch (error) {
      if (error instanceof NoCachedRateError) {
        setNeedsManualRate(true);
        setConvertedAmount(null);
      }
    } finally {
      setIsConverting(false);
    }
  }, [currency, activeGoal]);

  useEffect(() => {
    if (!amount) { setConvertedAmount(null); return; }
    const timer = setTimeout(() => fetchConversion(amount), 600);
    return () => clearTimeout(timer);
  }, [amount, fetchConversion]);

  useEffect(() => {
    if (needsManualRate && manualRate) {
      const r = parseFloat(manualRate);
      const numAmt = parseFloat(amount);
      if (!isNaN(r) && r > 0 && !isNaN(numAmt) && numAmt > 0) {
        const converted = Math.round(numAmt * r * 100) / 100;
        setConvertedAmount(converted);
        setRate(r);
        setRateSource('manual');
      }
    }
  }, [manualRate, needsManualRate, amount]);

  const handleAdd = async () => {
    if (!activeGoal) {
      Alert.alert('No active goal', 'Please create a goal first.');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount.');
      return;
    }
    if (convertedAmount === null) {
      Alert.alert('Conversion pending', 'Waiting for exchange rate to load.');
      return;
    }

    const finalAmount = type === 'withdraw' ? -numAmount : numAmount;
    const finalConvertedAmount = type === 'withdraw' ? -convertedAmount : convertedAmount;

    setIsLoading(true);
    try {
      const txn = await TransactionService.addTransaction(
        activeGoal.id,
        finalAmount,
        currency,
        finalConvertedAmount,
        rate,
        rateSource,
        category,
        note || null,
        date
      );
      addTransactionOptimistic(txn);

      // ── Play sound based on transaction type ──────────────────────────
      if (type === 'withdraw') {
        SoundService.playWithdraw().catch(() => {});
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      } else {
        SoundService.playDeposit().catch(() => {});
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }

      const activeData = goalsData.find(g => g.goal.id === activeGoal.id);
      let celebrate = false;
      if (activeData) {
        const target = activeGoal.target_amount;
        const oldTotal = activeData.progress.total_saved;
        const newTotal = oldTotal + finalConvertedAmount;

        const oldPct = (oldTotal / target) * 100;
        const newPct = (newTotal / target) * 100;

        if (oldPct < 25 && newPct >= 25) celebrate = true;
        else if (oldPct < 50 && newPct >= 50) celebrate = true;
        else if (oldPct < 75 && newPct >= 75) celebrate = true;
        else if (oldPct < 100 && newPct >= 100) celebrate = true;
      }

      if (celebrate) {
        router.push({ pathname: '/(tabs)', params: { celebrate: 'true' } });
      } else {
        router.back();
      }
     } catch (error) {
       console.error('Error adding transaction:', error);
       Alert.alert('Error', 'Failed to save entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <MaterialIcons name="arrow-back" size={22} color="#000666" />
          </TouchableOpacity>
          <Text style={styles.appTitle}>Vittora</Text>
        </View>

        <Text style={styles.eyebrow}>Financial Sanctuary</Text>
        <Text style={styles.title}>Add Transaction</Text>
        <Text style={styles.subtitle}>
          Document your growth. Every entry is a step toward your legacy.
        </Text>

        {goalsData.length > 1 && (
          <View style={{ marginBottom: 24, marginTop: 16 }}>
            <Text style={[styles.label, { marginBottom: 12 }]}>WHICH GOAL?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 24 }}>
              {goalsData.map(d => (
                <TouchableOpacity
                  key={d.goal.id}
                  style={[
                    styles.goalPill,
                    selectedGoalId === d.goal.id && styles.goalPillActive
                  ]}
                  onPress={() => setSelectedGoalId(d.goal.id)}
                >
                  <Text style={[
                    styles.goalPillText,
                    selectedGoalId === d.goal.id && styles.goalPillTextActive
                  ]}>
                    {d.goal.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Type selection */}
        <View style={{ marginBottom: 24 }}>
          <Text style={[styles.label, { marginBottom: 12 }]}>TRANSACTION TYPE</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={[
                styles.goalPill,
                type === 'deposit' && { backgroundColor: '#1a237e', borderColor: '#1a237e' }
              ]}
              onPress={() => setType('deposit')}
            >
              <Text style={[styles.goalPillText, type === 'deposit' && styles.goalPillTextActive]}>
                Deposit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
               style={[
                styles.goalPill,
                type === 'withdraw' && { backgroundColor: '#dc2626', borderColor: '#dc2626' }
              ]}
              onPress={() => setType('withdraw')}
            >
              <Text style={[styles.goalPillText, type === 'withdraw' && styles.goalPillTextActive]}>
                Withdraw
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Currency selection */}
        <View style={{ marginBottom: 24 }}>
          <Text style={[styles.label, { marginBottom: 12 }]}>TRANSACTION CURRENCY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 24 }}>
            {CURRENCIES.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.goalPill, currency === c && styles.goalPillActive]}
                onPress={() => setCurrency(c)}
              >
                <Text style={[styles.goalPillText, currency === c && styles.goalPillTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Amount Input */}
        <View style={styles.amountCard}>
          <Text style={styles.label}>TRANSACTION AMOUNT</Text>
          <View style={styles.amountInputRow}>
            <Text style={styles.currencySymbol}>
              {currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'}
            </Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#9ca3af"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              returnKeyType="done"
            />
          </View>

          {isConverting && (
            <View style={styles.conversionRow}>
              <ActivityIndicator size="small" color="#006c49" />
              <Text style={styles.conversionText}>Converting…</Text>
            </View>
          )}
          {!isConverting && convertedAmount !== null && (
            <View style={styles.conversionRow}>
              <MaterialIcons name="sync" size={16} color="#006c49" />
              <Text style={styles.conversionText}>
                = {activeGoal?.target_currency} {convertedAmount.toFixed(2)}
              </Text>
              {rateSource === 'cached' && (
                <Text style={styles.rateBadge}>CACHED</Text>
              )}
            </View>
          )}
          {rateWarning && (
            <Text style={styles.warningText}>⚠ {rateWarning}</Text>
          )}

          {needsManualRate && (
            <View style={styles.manualRateBox}>
              <Text style={styles.manualRateLabel}>
                No cached rate. Enter exchange rate (1 {currency} = ? {activeGoal?.target_currency}):
              </Text>
              <TextInput
                style={styles.manualRateInput}
                placeholder="e.g. 0.012"
                placeholderTextColor="#9ca3af"
                keyboardType="decimal-pad"
                value={manualRate}
                onChangeText={setManualRate}
              />
            </View>
          )}
        </View>

        {/* Currency & Date Row */}
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>EARNING IN</Text>
            <View style={styles.gridItemContent}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="payments" size={16} color="#000666" />
              </View>
              <Text style={styles.gridItemText}>{currency}</Text>
            </View>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>DATE</Text>
            <View style={styles.gridItemContent}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="calendar-today" size={16} color="#000666" />
              </View>
              <Text style={styles.gridItemText}>
                {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </Text>
            </View>
          </View>
        </View>

        {/* Category & Note */}
        <View style={styles.detailsCard}>
          <Text style={styles.label}>SOURCE / CATEGORY</Text>
          <View style={styles.chipsRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, category === cat && styles.chipActive]}
                onPress={() => setCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 24 }]}>NOTE (OPTIONAL)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Project bonus, monthly deposit…"
            placeholderTextColor="#9ca3af"
            value={note}
            onChangeText={setNote}
            multiline
          />
        </View>

        {/* 🕉 Gita Verse Banner */}
        <View style={styles.gitaCard}>
          <Text style={styles.gitaSanskrit}>
            कर्मण्येवाधिकारस्ते{'\n'}मा फलेषु कदाचन
          </Text>
          <Text style={styles.gitaEnglish}>
            "Focus on your duty to save,{'\n'}not the reward."
          </Text>
          <Text style={styles.gitaSource}>— Bhagavad Gita 2.47</Text>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, isLoading && { opacity: 0.7 }]}
          onPress={handleAdd}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="add-circle" size={24} color="#fff" />
              <Text style={styles.submitText}>Add Entry</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 16 },

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 28, marginTop: 8 },
  backBtn: {
    padding: 10,
    backgroundColor: '#e7e8e9',
    borderRadius: 24,
    marginRight: 14,
  },
  appTitle: { fontSize: 22, fontWeight: '800', color: '#1a237e' },

  eyebrow: { fontSize: 11, fontWeight: 'bold', color: '#767683', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6 },
  title: { fontSize: 34, fontWeight: '800', color: '#191c1d', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#454652', maxWidth: 300, marginBottom: 28, lineHeight: 21 },

  amountCard: { backgroundColor: '#e7e8e9', padding: 22, borderRadius: 20, marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '700', color: '#767683', marginBottom: 10, letterSpacing: 0.8, textTransform: 'uppercase' },
  amountInputRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  currencySymbol: { fontSize: 34, fontWeight: 'bold', color: '#000666' },
  amountInput: { fontSize: 44, fontWeight: '800', color: '#191c1d', flex: 1, padding: 0 },
  conversionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 },
  conversionText: { fontSize: 14, fontWeight: '600', color: '#006c49' },
  rateBadge: { fontSize: 9, fontWeight: 'bold', color: '#767683', backgroundColor: '#d9dadb', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  warningText: { fontSize: 12, color: '#653e00', marginTop: 8 },
  manualRateBox: { marginTop: 16, backgroundColor: '#ffddb8', padding: 14, borderRadius: 12 },
  manualRateLabel: { fontSize: 12, color: '#2a1700', marginBottom: 8, lineHeight: 18 },
  manualRateInput: { borderBottomWidth: 1, borderBottomColor: '#000666', fontSize: 16, color: '#191c1d', fontWeight: 'bold', minWidth: 60, textAlign: 'center' },

  goalPill: { backgroundColor: '#e7e8e9', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 100 },
  goalPillActive: { backgroundColor: '#1a237e' },
  goalPillText: { fontSize: 13, fontWeight: 'bold', color: '#454652' },
  goalPillTextActive: { color: '#ffffff' },

  grid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  gridItem: { flex: 1, backgroundColor: '#f3f4f5', padding: 18, borderRadius: 16 },
  gridItemContent: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  iconCircle: { width: 30, height: 30, backgroundColor: '#e1e3e4', borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  gridItemText: { fontSize: 17, fontWeight: 'bold', color: '#191c1d' },

  detailsCard: { backgroundColor: '#f3f4f5', padding: 22, borderRadius: 20, marginBottom: 24 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { backgroundColor: '#e1e3e4', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 32 },
  chipActive: { backgroundColor: '#1a237e' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#454652', textTransform: 'capitalize' },
  chipTextActive: { color: '#fff' },
  noteInput: { backgroundColor: '#e1e3e4', borderRadius: 12, padding: 14, fontSize: 14, color: '#191c1d', minHeight: 64, textAlignVertical: 'top' },

  // 🕉 Gita Card
  gitaCard: {
    backgroundColor: '#1a237e',
    borderRadius: 22,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#1a237e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  gitaSanskrit: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  gitaEnglish: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 10,
  },
  gitaSource: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
  },

  submitBtn: {
    flexDirection: 'row',
    backgroundColor: '#000666',
    padding: 20,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000666',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  submitText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
