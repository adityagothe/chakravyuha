import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View, Text, ScrollView, StyleSheet, Image,
  TouchableOpacity, SafeAreaView, ImageBackground, Alert,
  Platform, Modal, Linking, Animated, Switch
} from 'react-native';
import { useGoalStore } from '../../src/stores/useGoalStore';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import { ProgressRing } from '../../src/components/ProgressRing';
import { AnimatedCounter } from '../../src/components/AnimatedCounter';
import { TransactionItem } from '../../src/components/TransactionItem';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';
import { TutorialView } from '../../src/components/TutorialView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { SoundService } from '../../src/services/SoundService';
import ViewShot from 'react-native-view-shot';
import { computeNotifications, AppNotification } from '../../src/utils/notifications';

const phalamPlayedGoals = new Set<string>();

const ALL_QUOTES = [
  { text: 'The habit of saving is itself an education.', author: 'T.T. Munger' },
  { text: 'Do not save what is left after spending, but spend what is left after saving.', author: 'Warren Buffett' },
  { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: null },
  { text: 'Wealth consists not in having great possessions, but in having few wants.', author: 'Epictetus' },
  { text: 'Financial freedom is available to those who learn about it and work for it.', author: 'Robert Kiyosaki' },
  { text: "It's not about how much money you make, but how much money you keep.", author: null },
  { text: 'Rich people stay rich by living like they\'re broke.', author: 'Grant Cardone' },
  { text: 'A penny saved is a penny earned.', author: 'Benjamin Franklin' },
  { text: 'Beware of little expenses; a small leak will sink a great ship.', author: 'B. Franklin' },
  { text: 'An investment in knowledge pays the best interest.', author: 'B. Franklin' },
  { text: 'Discipline is the bridge between goals and accomplishment.', author: 'Jim Rohn' },
  { text: 'We are what we repeatedly do. Excellence is not an act, but a habit.', author: 'Aristotle' },
];

function getTheme(pct: number) {
  if (pct < 25) return { bg: '#1a237e', text: '#fff', progress: '#fff', progressBg: 'rgba(255,255,255,0.2)' };
  if (pct < 50) return { bg: '#006c49', text: '#fff', progress: '#6cf8bb', progressBg: 'rgba(255,255,255,0.1)' };
  if (pct < 75) return { bg: '#653e00', text: '#fff', progress: '#ffddb8', progressBg: 'rgba(255,255,255,0.1)' };
  return { bg: '#004a31', text: '#fff', progress: '#6cf8bb', progressBg: 'rgba(255,255,255,0.2)' };
}

// Inline Milestone Banner Component
function MilestoneBanner({ percentage }: { percentage: number }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-10)).current;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const milestone = percentage >= 75 ? 75 : percentage >= 50 ? 50 : percentage >= 25 ? 25 : 0;
    if (milestone > 0 && percentage < 100) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true })
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 10, duration: 400, useNativeDriver: true })
        ]).start(() => setVisible(false));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [percentage]);

  if (!visible) return null;
  return (
    <Animated.View style={[styles.milestoneBanner, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.milestoneBannerText}>🎉 Amazing! You've crossed the {percentage >= 75 ? 75 : percentage >= 50 ? 50 : 25}% mark!</Text>
    </Animated.View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const { goalsData, completeGoal, deleteGoal, refreshDashboard } = useGoalStore();
  const { isDarkMode, remindersEnabled, toggleDarkMode, toggleReminders, initialize } = useSettingsStore();

  const [showConfetti, setShowConfetti] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);

  const [quoteIdx, setQuoteIdx] = useState(Math.floor(Math.random() * ALL_QUOTES.length));
  const quoteOpacity = useRef(new Animated.Value(1)).current;

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const viewShotRef = useRef<any>(null);

  const themeStyles = {
    bg: isDarkMode ? '#121212' : '#f8f9fa',
    text: isDarkMode ? '#e0e0e0' : '#191c1d',
    cardBg: isDarkMode ? '#1e1e1e' : '#fff',
    subText: isDarkMode ? '#a0a0a0' : '#454652',
    headerBorder: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
    accent: isDarkMode ? '#a5b4fc' : '#1a237e',
  };

  const confirmDelete = async (id: string, name: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Are you sure you want to permanently delete "${name}"? This action cannot be undone.`)) {
        await deleteGoal(id);
      }
      return;
    }
    Alert.alert(
      'Delete Goal',
      `Are you sure you want to permanently delete "${name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteGoal(id) }
      ]
    );
  };

  const exportTransactions = async () => {
    try {
      const allTxns = goalsData.flatMap(g => g.transactions).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      if (allTxns.length === 0) { Alert.alert('No data', 'Provide some entries first!'); return; }
      let csv = 'Date,Goal,Category,Amount,Currency,Converted (Base),Note\\n';
      for (const t of allTxns) {
        const goalName = goalsData.find(g => g.goal.id === t.goal_id)?.goal.name || 'Unknown';
        csv += `${t.entry_date},"${goalName}",${t.category},${t.amount},${t.currency},${t.converted_amount},"${t.note || ''}"\\n`;
      }
      const fileUri = FileSystem.documentDirectory + 'Vittora_Statement.csv';
      await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(fileUri);
    } catch { Alert.alert('Export Failed', 'Could not generate statement.'); }
  };

  const captureAndShare = async () => {
    try {
      if (!viewShotRef.current) {
        Alert.alert('Error', 'Card is not ready yet. Try again.');
        return;
      }
      const uri = await viewShotRef.current.capture();
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Notice', 'Native sharing is not available on this device/web.');
        return;
      }
      await Sharing.shareAsync(uri, { dialogTitle: 'Share your Savings Streak!', mimeType: 'image/jpeg', UTI: 'public.jpeg' });
    } catch (err: any) {
      Alert.alert('Sharing failed', err.message || 'Unable to capture streak card.');
    }
  };

  const params = useLocalSearchParams<{ celebrate?: string }>();

  // Init settings
  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    refreshDashboard();
    AsyncStorage.getItem('@vittora_onboarding_done_v1').then(val => {
      if (val !== 'true') setShowTutorial(true);
    });
  }, []);

  useEffect(() => {
    setNotifications(computeNotifications(goalsData));
  }, [goalsData]);

  useEffect(() => {
    if (params.celebrate === 'true') {
      setShowConfetti(true);
      SoundService.playDeposit().catch(() => {});
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.setParams({ celebrate: '' });
    }
  }, [params.celebrate]);

  // Phalam Audio
  useEffect(() => {
    for (const data of goalsData) {
      if (data.progress.percentage >= 100 && !phalamPlayedGoals.has(data.goal.id)) {
        phalamPlayedGoals.add(data.goal.id);
        SoundService.playPhalam().catch(() => {});
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        setShowConfetti(true);
      }
    }
  }, [goalsData]);

  // Auto-rotating Quotes
  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(() => {
      Animated.timing(quoteOpacity, { toValue: 0, duration: 450, useNativeDriver: true }).start(() => {
        if (!isMounted) return;
        setQuoteIdx(prev => (prev + 1) % ALL_QUOTES.length);
        Animated.timing(quoteOpacity, { toValue: 1, duration: 450, useNativeDriver: true }).start();
      });
    }, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (showTutorial) {
    return (
      <TutorialView
        onComplete={() => {
          setShowTutorial(false);
          // Wait for the state update + re-render to complete before pushing
          setTimeout(() => router.push('/goal-setup'), 50);
        }}
      />
    );
  }

  const quote = ALL_QUOTES[quoteIdx];
  const maxStreak = goalsData.length > 0 ? Math.max(0, ...goalsData.map(g => g.insights.saving_streak)) : 0;
  let flameStr = '🔥';
  if (maxStreak >= 4) flameStr = '🔥🔥';
  if (maxStreak >= 12) flameStr = '🔥🔥🔥';

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.bg }]}>
      <SafeAreaView style={[styles.headerSafe, { backgroundColor: themeStyles.bg }]}>
        <View style={[styles.header, { borderBottomColor: themeStyles.headerBorder }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={[styles.infoIconBtn, {backgroundColor: isDarkMode ? '#2d2d3a' : '#e0e7ff'}]} onPress={() => setShowCreatorModal(true)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="settings" size={24} color={themeStyles.accent} />
            </TouchableOpacity>
            <Text style={[styles.headerLogo, { color: themeStyles.accent }]}>Vittora</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => router.push('/goal-setup')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="add-task" size={24} color={themeStyles.accent} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowNotifModal(true)}>
              <View>
                <MaterialIcons name="notifications" size={24} color={themeStyles.accent} />
                {notifications.length > 0 && (
                  <View style={styles.badgeCount}>
                    <Text style={styles.badgeText}>{notifications.length}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={[styles.eyebrow, { color: themeStyles.subText }]}>Your financial sanctuary</Text>
          <Text style={[styles.pageTitle, { color: themeStyles.text }]}>Your Progress</Text>
        </View>

        {goalsData.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: themeStyles.cardBg }]}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={[styles.title, { color: themeStyles.text }]}>Define your next milestone.</Text>
            <Text style={[styles.subtitle, { color: themeStyles.subText }]}>Financial clarity begins with intention.</Text>
            <TouchableOpacity style={styles.createButton} onPress={() => router.push('/goal-setup')} activeOpacity={0.85}>
              <Text style={styles.createButtonText}>Create Goal</Text>
              <MaterialIcons name="trending-up" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Goals List */}
            {goalsData.map((data) => {
              const { goal, progress, insights } = data;
              const isCompleted = progress.percentage >= 100;
              const bonus = progress.total_saved - goal.target_amount;

              if (isCompleted) {
                return (
                  <View key={goal.id} style={styles.divineCard}>
                    <Text style={styles.divineEmoji}>🪷</Text>
                    <Text style={styles.divineSanskrit}>फलम् ते प्रदत्तम्</Text>
                    <Text style={styles.divineSubtitle}>"Your reward has been bestowed upon you."</Text>
                    <View style={styles.divineStatsRow}>
                      <Text style={styles.divineGoalName}>👑 {goal.name}</Text>
                      <Text style={styles.divineAmount}>{goal.target_currency} {progress.total_saved.toFixed(2)}</Text>
                    </View>
                    {bonus > 0 && (
                      <View style={styles.divineBonusBadge}>
                        <Text style={styles.divineBonusText}>✨ Extra {goal.target_currency} {bonus.toFixed(2)} Bonus Saved!</Text>
                      </View>
                    )}
                    <TouchableOpacity style={styles.acceptBlessingBtn} onPress={async () => {
                        alert('Congratulations! Your blessing is yours. 🪷');
                        await completeGoal(goal.id);
                      }}>
                      <Text style={styles.acceptBlessingText}>Accept Your Blessing 🪷</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => confirmDelete(goal.id, goal.name)} style={{ marginTop: 12 }}>
                      <Text style={{ color: 'rgba(255,200,100,0.7)', fontSize: 12, textAlign: 'center' }}>Delete goal</Text>
                    </TouchableOpacity>
                  </View>
                );
              }

              const theme = getTheme(progress.percentage);

              return (
                <View key={goal.id} style={{ marginBottom: 20 }}>
                  <MilestoneBanner percentage={progress.percentage} />
                  
                  {goal.image_uri ? (
                    <ImageBackground source={{ uri: goal.image_uri }} style={[styles.heroCard, { overflow: 'hidden' }]} imageStyle={{ opacity: 0.35, backgroundColor: theme.bg }}>
                      {renderHeroContent(goal, progress, insights, theme, confirmDelete)}
                    </ImageBackground>
                  ) : (
                    <View style={[styles.heroCard, { backgroundColor: theme.bg }]}>
                      {renderHeroContent(goal, progress, insights, theme, confirmDelete)}
                    </View>
                  )}
                </View>
              );
            })}



            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: themeStyles.text }]}>Recent Savings</Text>
            </View>
            <View style={styles.transactionsList}>
              {(() => {
                const allTxns = goalsData.flatMap(g => g.transactions).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                return (
                  <>
                    {allTxns.slice(0, 5).map(txn => (
                       <View key={txn.id} style={{ backgroundColor: themeStyles.cardBg, borderRadius: 16, padding: 2 }}>
                          <TransactionItem transaction={txn} />
                       </View>
                    ))}
                    {allTxns.length === 0 && (
                      <View style={styles.emptyTxn}>
                        <Text style={styles.emptyTxnIcon}>💰</Text>
                        <Text style={[styles.emptyText, { color: themeStyles.subText }]}>No entries yet. Start saving today!</Text>
                      </View>
                    )}
                  </>
                );
              })()}
            </View>

            <Animated.View style={[styles.quoteCard, { backgroundColor: themeStyles.cardBg, borderColor: themeStyles.headerBorder, opacity: quoteOpacity }]}>
              <Text style={[styles.quoteMarks, { color: themeStyles.accent }]}>"</Text>
              <Text style={[styles.quoteText, { color: themeStyles.accent }]}>{quote.text}</Text>
              {quote.author && <Text style={[styles.quoteAuthor, { color: themeStyles.accent }]}>— {quote.author}</Text>}
            </Animated.View>
          </>
        )}
        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Notifications Modal */}
      <Modal visible={showNotifModal} animationType="fade" transparent={true}>
        <View style={styles.notifOverlay}>
          <SafeAreaView style={[styles.notifModalContainer, { backgroundColor: themeStyles.bg }]}>
            <View style={[styles.notifHeader, { borderBottomColor: themeStyles.headerBorder }]}>
              <Text style={[styles.notifTitle, { color: themeStyles.text }]}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotifModal(false)}>
                 <View style={{ backgroundColor: themeStyles.cardBg, padding: 8, borderRadius: 20 }}>
                   <MaterialIcons name="close" size={24} color={themeStyles.text} />
                 </View>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.notifList}>
              {notifications.length === 0 ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <MaterialIcons name="notifications-none" size={48} color={themeStyles.subText} style={{ marginBottom: 16 }} />
                  <Text style={{ color: themeStyles.subText, fontSize: 16 }}>You're all caught up!</Text>
                </View>
              ) : (
                notifications.map(n => (
                  <View key={n.id} style={[styles.notifItem, { backgroundColor: themeStyles.cardBg }]}>
                    <View style={[styles.notifIconWrap, { backgroundColor: themeStyles.bg }]}>
                       <MaterialIcons name={n.icon as any} size={24} color={themeStyles.accent} />
                    </View>
                    <View style={styles.notifContent}>
                      <Text style={[styles.notifItemTitle, { color: themeStyles.text }]}>{n.title}</Text>
                      <Text style={[styles.notifItemMsg, { color: themeStyles.subText }]}>{n.message}</Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Settings / Creator Modal */}
      <Modal visible={showCreatorModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={[styles.modalCard, { backgroundColor: themeStyles.cardBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalHeaderText, { color: themeStyles.text }]}>Settings</Text>
              <TouchableOpacity onPress={() => setShowCreatorModal(false)}>
                 <MaterialIcons name="close" size={24} color={themeStyles.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ width: '100%' }}>
              
              <View style={[styles.settingsRow, { borderBottomColor: themeStyles.headerBorder }]}>
                <View style={styles.settingsRowLeft}>
                  <MaterialIcons name="dark-mode" size={24} color={themeStyles.accent} />
                  <Text style={[styles.settingsRowText, { color: themeStyles.text }]}>Dark Mode</Text>
                </View>
                <Switch value={isDarkMode} onValueChange={toggleDarkMode} trackColor={{ true: themeStyles.accent }} />
              </View>

              <View style={[styles.settingsRow, { borderBottomColor: themeStyles.headerBorder }]}>
                <View style={styles.settingsRowLeft}>
                  <MaterialIcons name="alarm" size={24} color={themeStyles.accent} />
                  <Text style={[styles.settingsRowText, { color: themeStyles.text }]}>Daily Reminder (9 AM)</Text>
                </View>
                <Switch value={remindersEnabled} onValueChange={toggleReminders} trackColor={{ true: themeStyles.accent }} />
              </View>

              <TouchableOpacity style={[styles.settingsRowBtn, { borderBottomColor: themeStyles.headerBorder }]} onPress={exportTransactions}>
                 <View style={styles.settingsRowLeft}>
                  <MaterialIcons name="file-download" size={24} color={themeStyles.accent} />
                  <Text style={[styles.settingsRowText, { color: themeStyles.text }]}>Export Data (CSV)</Text>
                 </View>
                 <MaterialIcons name="chevron-right" size={24} color={themeStyles.subText} />
              </TouchableOpacity>

              <View style={{ alignItems: 'center', marginTop: 40, paddingBottom: 20 }}>
                <Image source={require('../../assets/images/creator.png')} style={styles.creatorPhoto} resizeMode="contain" />
                <Text style={[styles.creatorName, { color: themeStyles.text }]}>ADITYA GOTHE</Text>
                <Text style={{ color: themeStyles.subText, marginBottom: 16 }}>Software Engineer & Creator</Text>
                
                <View style={{ backgroundColor: isDarkMode ? '#3f1515' : '#ffe1e1', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 100, marginBottom: 16 }}>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: isDarkMode ? '#fca5a5' : '#cc0000', letterSpacing: 0.5 }}>
                    Made in India with LOVE ❤️
                  </Text>
                </View>
                <Text style={styles.creatorVersion}>Vittora v2.0.0</Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

      {showConfetti && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <ConfettiCannon count={220} origin={{ x: -10, y: 0 }} colors={['#ffd700', '#ffb300', '#ff8f00', '#fff176', '#fffde7']} onAnimationEnd={() => setShowConfetti(false)} />
        </View>
      )}
    </View>
  );
}

function renderHeroContent(goal: any, progress: any, insights: any, theme: any, confirmDelete: any) {
  return (
    <>
      <View style={styles.heroContent}>
        <ProgressRing percentage={progress.percentage} color={theme.progress} backgroundColor={theme.progressBg}>
          <View style={styles.progressCenter}>
            <Text style={[styles.progressText, { color: theme.text }]}>{Math.floor(progress.percentage)}%</Text>
            <Text style={[styles.progressLabel, { color: theme.text, opacity: 0.75 }]}>SAVED</Text>
          </View>
        </ProgressRing>
        <View style={styles.heroDetails}>
          <View style={styles.goalNameRow}>
            <MaterialIcons name="stars" size={18} color={theme.progress} />
            <Text style={[styles.goalName, { color: theme.text }]} numberOfLines={1}>{goal.name}</Text>
            <TouchableOpacity onPress={() => confirmDelete(goal.id, goal.name)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="delete-outline" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.goalAmount, { color: theme.text }]}>
            <AnimatedCounter value={progress.total_saved} prefix={goal.target_currency + ' '} />
            {'  '}
            <Text style={[styles.goalTarget, { color: theme.text, opacity: 0.55 }]}>/ {goal.target_amount.toFixed(2)}</Text>
          </Text>
          <View style={styles.glassInfo}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.text, opacity: 0.65 }]}>REMAINING</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{goal.target_currency} {progress.remaining.toFixed(2)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.text, opacity: 0.65 }]}>DEADLINE</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {progress.is_overdue ? '⚠ Overdue' : progress.days_left === 0 ? 'Due today' : `${progress.days_left} days`}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyContainer: { padding: 32, justifyContent: 'center', borderRadius: 24, marginVertical: 20 },
  emptyIcon: { fontSize: 56, marginBottom: 24, textAlign: 'center' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 40, textAlign: 'center' },
  createButton: { backgroundColor: '#1a237e', padding: 18, borderRadius: 100, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10, elevation: 5 },
  createButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  headerSafe: { },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14, borderBottomWidth: 1 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  infoIconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  headerLogo: { fontSize: 22, fontWeight: '800' },
  badgeCount: { position: 'absolute', top: -4, right: -4, backgroundColor: '#ef4444', minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  welcomeSection: { marginBottom: 24 },
  eyebrow: { fontSize: 11, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase' },
  pageTitle: { fontSize: 26, fontWeight: 'bold', marginTop: 4 },

  divineCard: { backgroundColor: '#b8860b', borderRadius: 28, padding: 28, marginBottom: 28, alignItems: 'center', borderWidth: 2, borderColor: '#ffd700', shadowColor: '#ffd700', elevation: 10 },
  divineEmoji: { fontSize: 52, marginBottom: 12 },
  divineSanskrit: { fontSize: 26, fontWeight: '900', color: '#fffde7', textAlign: 'center', marginBottom: 8, letterSpacing: 1 },
  divineSubtitle: { fontSize: 14, fontStyle: 'italic', color: 'rgba(255,253,231,0.8)', textAlign: 'center', marginBottom: 20 },
  divineStatsRow: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 16, padding: 16, width: '100%', alignItems: 'center', marginBottom: 16 },
  divineGoalName: { fontSize: 14, fontWeight: '800', color: '#fffde7', marginBottom: 4 },
  divineAmount: { fontSize: 28, fontWeight: '900', color: '#ffd700' },
  divineBonusBadge: { backgroundColor: 'rgba(255,215,0,0.2)', borderRadius: 100, paddingHorizontal: 18, paddingVertical: 10, marginBottom: 20 },
  divineBonusText: { fontSize: 13, fontWeight: 'bold', color: '#fffde7' },
  acceptBlessingBtn: { backgroundColor: 'rgba(255,253,231,0.2)', borderWidth: 1, borderColor: 'rgba(255,253,231,0.4)', borderRadius: 100, paddingVertical: 16, paddingHorizontal: 32, width: '100%', alignItems: 'center' },
  acceptBlessingText: { fontSize: 16, fontWeight: '800', color: '#fffde7' },

  heroCard: { borderRadius: 28, padding: 22, elevation: 8 },
  heroContent: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  progressCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  progressText: { fontSize: 22, fontWeight: 'bold' },
  progressLabel: { fontSize: 9, fontWeight: '600', letterSpacing: 1 },
  heroDetails: { flex: 1 },
  goalNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  goalName: { fontSize: 16, fontWeight: 'bold', flex: 1 },
  goalAmount: { fontSize: 26, fontWeight: '800', marginBottom: 14 },
  goalTarget: { fontSize: 14, fontWeight: '500' },
  glassInfo: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 10, gap: 6 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoLabel: { fontSize: 9, fontWeight: '600', letterSpacing: 1 },
  infoValue: { fontSize: 11, fontWeight: 'bold' },

  milestoneBanner: { backgroundColor: '#dcfce7', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16, marginBottom: 12, alignItems: 'center' },
  milestoneBannerText: { color: '#166534', fontWeight: 'bold', fontSize: 13 },

  shareCardContainer: { marginBottom: 28, borderRadius: 24, overflow: 'hidden', elevation: 8, shadowColor: '#000', shadowOffset:{width:0, height:8}, shadowOpacity: 0.15, shadowRadius: 12 },
  streakShareCapture: { width: '100%' },
  streakShareContent: { padding: 32, alignItems: 'center', justifyContent: 'center', minHeight: 220 },
  streakBadgeWrapper: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(249,115,22,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  streakShareTitle: { fontSize: 26, fontWeight: '900', marginBottom: 8 },
  streakShareSubtitle: { fontSize: 13, fontWeight: '600', textAlign: 'center', marginBottom: 20 },
  streakShareFooter: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10, alignItems: 'center' },
  streakBrand: { fontSize: 16, fontWeight: '800', letterSpacing: -0.5 },
  streakTag: { fontSize: 12, fontWeight: '700' },
  shareActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, gap: 8 },
  shareActionText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  transactionsList: { gap: 10 },
  emptyTxn: { alignItems: 'center', paddingVertical: 32 },
  emptyTxnIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { textAlign: 'center', fontSize: 14 },

  quoteCard: { borderRadius: 22, padding: 24, marginTop: 20, marginBottom: 8, borderWidth: 1 },
  quoteMarks: { fontSize: 48, lineHeight: 44, marginBottom: 4, opacity: 0.3 },
  quoteText: { fontSize: 15, fontStyle: 'italic', lineHeight: 24, fontWeight: '600', marginBottom: 10 },
  quoteAuthor: { fontSize: 12, fontWeight: '700', textAlign: 'right' },

  notifOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  notifModalContainer: { height: '80%', borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden' },
  notifHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, borderBottomWidth: 1 },
  notifTitle: { fontSize: 22, fontWeight: '900' },
  notifList: { padding: 16, gap: 12, paddingBottom: 60 },
  notifItem: { flexDirection: 'row', padding: 16, borderRadius: 20, gap: 16, alignItems: 'center', shadowColor: '#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.05, shadowRadius:8, elevation:2 },
  notifIconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  notifContent: { flex: 1 },
  notifItemTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  notifItemMsg: { fontSize: 13, lineHeight: 18 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalCard: { height: '85%', borderTopLeftRadius: 32, borderTopRightRadius: 32, alignItems: 'center' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 24, width: '100%', alignItems: 'center' },
  modalHeaderText: { fontSize: 22, fontWeight: '900' },
  
  settingsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  settingsRowBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  settingsRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  settingsRowText: { fontSize: 16, fontWeight: '600' },

  creatorPhoto: { width: 100, height: 100, borderRadius: 50, marginBottom: 16, borderWidth: 3, borderColor: '#e0e7ff' },
  creatorName: { fontSize: 20, fontWeight: '900', letterSpacing: 1, marginBottom: 6 },
  creatorLinkBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 100, marginBottom: 16 },
  creatorLinkText: { fontSize: 14, fontWeight: '700' },
  creatorVersion: { fontSize: 12, color: '#9ca3af', marginBottom: 24 },
});
