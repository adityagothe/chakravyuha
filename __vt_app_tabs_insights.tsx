import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Image,
  SafeAreaView, Dimensions, TouchableOpacity, Modal, Linking
} from 'react-native';
import { useGoalStore } from '../../src/stores/useGoalStore';
import { computeWeeklyVelocity } from '../../src/utils/calculations';
import { Badge } from '../../src/types/models';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

export default function InsightsScreen() {
  const { goalsData, refreshDashboard } = useGoalStore();
  const [showCreatorModal, setShowCreatorModal] = useState(false);

  useEffect(() => {
    refreshDashboard();
  }, []);

  if (goalsData.length === 0) {
    return (
      <SafeAreaView style={styles.emptyOuter}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No Insights Yet</Text>
          <Text style={styles.emptySubtitle}>
            Create a goal and add some entries to unlock your financial insights.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const allTransactions = goalsData.flatMap(g => g.transactions);
  const weekly = computeWeeklyVelocity(allTransactions);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.infoIconBtn}
              onPress={() => setShowCreatorModal(true)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="info-outline" size={24} color="#1a237e" />
            </TouchableOpacity>
            <Text style={styles.headerLogo}>Vittora</Text>
          </View>
          <MaterialIcons name="notifications" size={24} color="#000666" />
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.pageTitle}>Insights</Text>
          <Text style={styles.eyebrowText}>Your financial sanctuary at a glance.</Text>
        </View>

        {goalsData.map((data) => {
          const { goal, progress, insights } = data;
          
          // Helper for formatting big numbers
          const fmt = (num: number) => {
            if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
            return num.toFixed(0);
          };

          return (
            <View key={goal.id} style={{ marginBottom: 32 }}>
              
              {/* Savings Personality */}
              <View style={[styles.cardGoal, { backgroundColor: '#e0e7ff', borderWidth: 1, borderColor: '#1a237e' }]}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.labelMini, { color: '#1a237e' }]}>YOUR ARCHETYPE</Text>
                  <MaterialIcons name="psychology" size={20} color="#1a237e" />
                </View>
                <Text style={styles.personalityTitle}>{insights.personality}</Text>
                <Text style={styles.personalityDesc}>Based on your saving patterns, this is your Vittora persona.</Text>
              </View>

              {/* ── 8 New Insight Cards ── */}
              <View style={styles.masonryGrid}>
                {/* 1. Velocity / Pace */}
                <View style={styles.insightCard}>
                  <Text style={styles.insightTitle}>Current Pace</Text>
                  <Text style={styles.insightValue}>
                     {goal.target_currency} {insights.weekly_actual.toFixed(0)} <Text style={{fontSize: 12, color: '#767683', fontWeight: '500'}}>/ wk</Text>
                  </Text>
                  <Text style={styles.insightDesc}>
                    {insights.status === 'on_track' ? 'You are ahead! 🟢' : insights.status === 'completed' ? 'Goal complete 👑' : 'Slightly behind 🔴'}
                  </Text>
                </View>

                {/* 2. Streak */}
                <View style={styles.insightCard}>
                  <Text style={styles.insightTitle}>Consistency</Text>
                  <Text style={styles.insightValue}>{insights.saving_streak} <Text style={{fontSize: 12, color: '#767683', fontWeight: '500'}}>wks</Text></Text>
                  <Text style={styles.insightDesc}>Your uninterrupted discipline.</Text>
                </View>

                {/* 3. Best Week */}
                <View style={[styles.insightCard, { backgroundColor: '#ffddb8' }]}>
                  <Text style={styles.insightTitle}>Best Week</Text>
                  <Text style={styles.insightValue}>{goal.target_currency} {fmt(insights.personal_bests.best_week)}</Text>
                  <Text style={styles.insightDesc}>Your highest weekly saving.</Text>
                </View>

                {/* 4. M/M Growth */}
                <View style={[styles.insightCard, { backgroundColor: '#dcfce7' }]}>
                  <Text style={styles.insightTitle}>M/M Growth</Text>
                  <Text style={styles.insightValue}>
                    {insights.monthly_comparison.percentage_change}% {insights.monthly_comparison.trend === 'up' ? '↗' : '↘'}
                  </Text>
                  <Text style={styles.insightDesc}>Compared to last month.</Text>
                </View>

                {/* 5. Projected Finished */}
                <View style={styles.insightCardWide}>
                  <MaterialIcons name="event-available" size={24} color="#000666" style={{marginBottom: 8}} />
                  <Text style={styles.insightTitle}>Projected Completion</Text>
                  <Text style={[styles.insightValue, { fontSize: 20 }]}>
                     {insights.projected_completion_date 
                       ? new Date(insights.projected_completion_date).toLocaleDateString(undefined, {month:'long', day:'numeric', year:'numeric'})
                       : 'Need more data'}
                  </Text>
                  <Text style={styles.insightDesc}>
                     {insights.days_ahead_or_behind < 0 
                       ? `${Math.abs(insights.days_ahead_or_behind)} days ahead of deadline ✅`
                       : insights.days_ahead_or_behind > 0 
                         ? `${insights.days_ahead_or_behind} days behind deadline ⚠️`
                         : 'Exactly on schedule 🎯'}
                  </Text>
                </View>
              </View>

              {/* ── Trophy Room Re-design ── */}
              <View style={styles.badgesWrapper}>
                <Text style={styles.sectionHeaderTitle}>Trophy Room</Text>
                <View style={styles.trophyGrid}>
                  {insights.badges.map((b: Badge) => (
                    <View key={b.id} style={[styles.trophyCard, b.locked && styles.badgeLocked]}>
                      <View style={styles.badgeIconWrapper}>
                        <Text style={styles.badgeIcon}>{b.icon}</Text>
                        {b.locked && <MaterialIcons name="lock" size={16} color="#767683" style={{position: 'absolute'}} />}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.badgeName, b.locked && {color: '#767683'}]}>{b.name}</Text>
                        <Text style={styles.badgeDesc}>{b.description}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.cardGoal}>
                <Text style={styles.labelMini}>GOAL COMPLETION · {goal.name.toUpperCase()}</Text>
                <View style={styles.rowBase}>
                  <Text style={styles.percentageText}>{Math.floor(progress.percentage)}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { flex: progress.percentage / 100 }]} />
                </View>
                <View style={styles.rowBetween}>
                  <View>
                    <Text style={styles.infoLabel}>SAVED</Text>
                    <Text style={styles.infoVal}>{goal.target_currency} {progress.total_saved.toFixed(2)}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.infoLabel}>DAYS LEFT</Text>
                    <Text style={[styles.infoVal, { color: '#000666' }]}>{progress.is_overdue ? "Overdue" : progress.days_left}</Text>
                  </View>
                </View>
              </View>

            </View>
          );
        })}

        <View style={styles.graphCard}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.cardTitle}>Weekly Velocity</Text>
              <Text style={styles.cardSubtitle}>Savings this week</Text>
            </View>
          </View>
          <View style={styles.barsContainer}>
            {weekly.normalized.map((day, i) => (
              <View key={i} style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(4, Math.round((day.height_pct ?? 0) / 100 * 120)),
                      backgroundColor: day.is_today ? '#1a237e' : day.total > 0 ? '#6cf8bb' : '#e7e8e9',
                    },
                  ]}
                />
                <Text style={[styles.dayLabel, day.is_today && { color: '#1a237e', fontWeight: 'bold' }]}>
                  {day.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* ℹ️ Creator Info Modal */}
      <Modal
        visible={showCreatorModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCreatorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Image
              source={require('../../assets/images/creator.png')}
              style={styles.creatorPhoto}
              resizeMode="contain"
            />
            <Text style={styles.creatorName}>ADITYA GOTHE</Text>
            <Text style={styles.creatorSanskrit}>धर्मो रक्षति रक्षितः</Text>
            <View style={{ backgroundColor: '#ffe1e1', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 100, marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#cc0000', letterSpacing: 0.5 }}>
                Made in India with LOVE ❤️
              </Text>
            </View>
            <TouchableOpacity
              style={styles.feedbackBtn}
              onPress={() => Linking.openURL('https://forms.gle/YOUR_FORM_ID')}
            >
              <Text style={styles.feedbackBtnText}>Give Feedback 💬</Text>
            </TouchableOpacity>
            <Text style={styles.creatorVersion}>Vittora v2.0.0</Text>
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setShowCreatorModal(false)}
            >
              <Text style={styles.closeModalText}>Close ✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  emptyOuter: { flex: 1, backgroundColor: '#f8f9fa' },
  emptyContainer: { flex: 1, padding: 32, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 56, marginBottom: 20 },
  emptyTitle: { fontSize: 26, fontWeight: '800', color: '#191c1d', marginBottom: 12 },
  emptySubtitle: { fontSize: 15, color: '#454652', textAlign: 'center', lineHeight: 22 },

  headerSafe: { backgroundColor: 'rgba(248,249,250,0.97)' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoIconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center' },
  headerLogo: { fontSize: 22, fontWeight: '800', color: '#1a237e' },

  content: { paddingHorizontal: 20, paddingTop: 20 },
  welcomeSection: { marginBottom: 28 },
  pageTitle: { fontSize: 42, fontWeight: '800', color: '#191c1d', letterSpacing: -1 },
  eyebrowText: { fontSize: 15, color: '#454652', marginTop: 6 },

  cardGoal: {
    backgroundColor: '#fff', borderRadius: 24, padding: 22, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 16, elevation: 3,
  },
  labelMini: { fontSize: 10, fontWeight: '700', color: '#767683', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  rowBase: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  percentageText: { fontSize: 52, fontWeight: '800', color: '#191c1d' },
  progressBarBg: { height: 14, backgroundColor: '#edeeef', borderRadius: 7, overflow: 'hidden', flexDirection: 'row', marginBottom: 20 },
  progressBarFill: { backgroundColor: '#000666' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  infoLabel: { fontSize: 10, color: '#767683', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  infoVal: { fontSize: 15, fontWeight: 'bold', color: '#191c1d' },

  graphCard: { backgroundColor: '#fff', borderRadius: 24, padding: 22, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.06 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#191c1d', marginBottom: 2 },
  cardSubtitle: { fontSize: 12, color: '#767683' },
  barsContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 140, marginTop: 20 },
  barWrapper: { flex: 1, alignItems: 'center', gap: 8 },
  bar: { width: '65%', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  dayLabel: { fontSize: 10, fontWeight: '600', color: '#767683', textTransform: 'uppercase' },

  personalityTitle: { fontSize: 24, fontWeight: 'bold', color: '#1a237e', marginBottom: 4 },
  personalityDesc: { fontSize: 13, color: '#454652' },

  masonryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  insightCard: { backgroundColor: '#fff', width: (width - 40 - 12) / 2, padding: 18, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  insightCardWide: { backgroundColor: '#fff', width: '100%', padding: 22, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  insightTitle: { fontSize: 11, fontWeight: '700', color: '#767683', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  insightValue: { fontSize: 26, fontWeight: '800', color: '#191c1d', marginBottom: 4 },
  insightDesc: { fontSize: 12, color: '#454652', lineHeight: 16 },

  sectionHeaderTitle: { fontSize: 22, fontWeight: '800', color: '#191c1d', marginBottom: 16, marginTop: 8 },
  badgesWrapper: { marginBottom: 32 },
  trophyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  trophyCard: { backgroundColor: '#fff', width: (width - 40 - 12) / 2, padding: 16, borderRadius: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, gap: 8 },
  badgeLocked: { backgroundColor: '#f3f4f5', opacity: 0.7 },
  badgeIconWrapper: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f8f9fa', alignItems: 'center', justifyContent: 'center' },
  badgeIcon: { fontSize: 24 },
  badgeName: { fontSize: 14, fontWeight: 'bold', color: '#191c1d', marginBottom: 2 },
  badgeDesc: { fontSize: 11, color: '#767683', lineHeight: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 32, alignItems: 'center', paddingBottom: 48,
    shadowColor: '#000', shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12, shadowRadius: 20,
  },
  creatorPhoto: { width: 100, height: 100, borderRadius: 50, marginBottom: 16, borderWidth: 3, borderColor: '#e0e7ff' },
  creatorName: { fontSize: 20, fontWeight: '900', color: '#191c1d', letterSpacing: 1, marginBottom: 6 },
  creatorSanskrit: { fontSize: 14, color: '#767683', fontStyle: 'italic', marginBottom: 20 },
  creatorLinkBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#e0e7ff', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 100, marginBottom: 16 },
  creatorLinkText: { fontSize: 14, color: '#1a237e', fontWeight: '700' },
  feedbackBtn: { backgroundColor: '#1a237e', width: '100%', paddingVertical: 16, borderRadius: 100, alignItems: 'center', marginBottom: 24 },
  feedbackBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  creatorMadeWith: { fontSize: 13, color: '#767683', marginBottom: 4 },
  creatorVersion: { fontSize: 12, color: '#9ca3af', marginBottom: 24 },
  closeModalBtn: { backgroundColor: '#f3f4f5', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 100 },
  closeModalText: { fontSize: 14, fontWeight: '700', color: '#454652' },
});
