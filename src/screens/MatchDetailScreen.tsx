import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSportsStore, MatchEvent } from '../store/sportsStore';

const EVENT_ICON: Record<string, string> = {
  goal: '⚽',
  yellow_card: '🟨',
  red_card: '🟥',
  substitution: '🔄',
};

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const match = useSportsStore((s) => s.matches.find((m) => m.id === id));

  if (!match) return null;

  const isLive = match.status === 'live';

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={[styles.header, isLive && styles.headerLive]}>
        <Text style={styles.leagueHeader}>{match.league}</Text>
        {isLive && (
          <View style={styles.liveTag}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE {match.minute}'</Text>
          </View>
        )}
        {match.status === 'finished' && <Text style={styles.ftText}>Full Time</Text>}
        {match.status === 'upcoming' && <Text style={styles.kickoffText}>Kickoff {match.kickoff}</Text>}

        <View style={styles.scoreRow}>
          <Text style={styles.teamLarge}>{match.homeTeam}</Text>
          <Text style={[styles.scoreLarge, isLive && { color: '#FFF' }]}>
            {match.homeScore} - {match.awayScore}
          </Text>
          <Text style={styles.teamLarge}>{match.awayTeam}</Text>
        </View>
      </View>

      {/* Match Events */}
      {match.events && match.events.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Match Events</Text>
          {match.events.map((event: MatchEvent, i: number) => (
            <View key={i} style={[styles.event, event.team === 'away' && styles.eventAway]}>
              {event.team === 'home' && (
                <>
                  <Text style={styles.eventMinute}>{event.minute}'</Text>
                  <Text style={styles.eventIcon}>{EVENT_ICON[event.type]}</Text>
                  <Text style={styles.eventPlayer}>{event.player}</Text>
                </>
              )}
              {event.team === 'away' && (
                <>
                  <Text style={[styles.eventPlayer, { textAlign: 'right' }]}>{event.player}</Text>
                  <Text style={styles.eventIcon}>{EVENT_ICON[event.type]}</Text>
                  <Text style={styles.eventMinute}>{event.minute}'</Text>
                </>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Stats placeholder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Match Stats</Text>
        {[['Possession', '56%', '44%'], ['Shots', '12', '8'], ['Shots on Target', '5', '3'], ['Corners', '6', '4']].map(([label, h, a]) => (
          <View key={label} style={styles.statRow}>
            <Text style={styles.statValue}>{h}</Text>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{a}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#1E3A5F', padding: 24, paddingTop: 60, alignItems: 'center' },
  headerLive: { backgroundColor: '#7F1D1D' },
  leagueHeader: { color: '#94A3B8', fontSize: 13, marginBottom: 8 },
  liveTag: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', marginRight: 6 },
  liveText: { color: '#FCA5A5', fontWeight: '700', fontSize: 13 },
  ftText: { color: '#94A3B8', marginBottom: 8 },
  kickoffText: { color: '#60A5FA', marginBottom: 8 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  teamLarge: { color: '#FFF', fontWeight: '700', fontSize: 15, flex: 1, textAlign: 'center' },
  scoreLarge: { fontSize: 36, fontWeight: '800', color: '#FFF' },
  section: { margin: 16, backgroundColor: '#FFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  sectionTitle: { fontWeight: '700', fontSize: 16, color: '#0F172A', marginBottom: 14 },
  event: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#F1F5F9' },
  eventAway: { justifyContent: 'flex-end' },
  eventMinute: { color: '#64748B', fontSize: 13, width: 36 },
  eventIcon: { fontSize: 16, marginHorizontal: 8 },
  eventPlayer: { flex: 1, color: '#0F172A', fontWeight: '500' },
  statRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  statValue: { width: 50, fontWeight: '700', color: '#0F172A', textAlign: 'center' },
  statLabel: { flex: 1, textAlign: 'center', color: '#64748B', fontSize: 13 },
});
