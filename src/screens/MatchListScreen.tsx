import React, { useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useSportsStore, Match, MatchStatus } from '../store/sportsStore';

const STATUS_COLOR: Record<MatchStatus, string> = {
  live: '#EF4444',
  upcoming: '#2563EB',
  finished: '#6B7280',
};

const LEAGUES = ['All', 'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1'];

export default function MatchListScreen() {
  const router = useRouter();
  const { matches, selectedLeague, setSelectedLeague, refreshMatches, isRefreshing, simulateLive } = useSportsStore();

  // Simulate live score updates every 30s
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  useEffect(() => {
    timerRef.current = setInterval(simulateLive, 30_000);
    return () => clearInterval(timerRef.current);
  }, []);

  const filtered = selectedLeague && selectedLeague !== 'All'
    ? matches.filter((m) => m.league === selectedLeague)
    : matches;

  const renderMatch = ({ item: m }: { item: Match }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/match/${m.id}`)}>
      <View style={styles.league}>
        <Text style={styles.leagueName}>{m.league}</Text>
        <View style={[styles.statusBadge, { backgroundColor: `${STATUS_COLOR[m.status]}20` }]}>
          <Text style={[styles.statusText, { color: STATUS_COLOR[m.status] }]}>
            {m.status === 'live' ? `LIVE ${m.minute}'` : m.status === 'upcoming' ? m.kickoff : 'FT'}
          </Text>
        </View>
      </View>
      <View style={styles.teams}>
        <Text style={styles.teamName}>{m.homeTeam}</Text>
        <View style={styles.scoreBox}>
          <Text style={[styles.score, m.status === 'live' && styles.scoreLive]}>
            {m.homeScore} - {m.awayScore}
          </Text>
        </View>
        <Text style={[styles.teamName, { textAlign: 'right' }]}>{m.awayTeam}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Scores</Text>

      <FlatList
        horizontal
        data={LEAGUES}
        keyExtractor={(l) => l}
        showsHorizontalScrollIndicator={false}
        style={styles.leagueTabs}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tab, (selectedLeague ?? 'All') === item && styles.tabActive]}
            onPress={() => setSelectedLeague(item === 'All' ? null : item)}
          >
            <Text style={[(selectedLeague ?? 'All') === item ? styles.tabTextActive : styles.tabText]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(m) => m.id}
        renderItem={renderMatch}
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshMatches} tintColor="#2563EB" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  title: { fontSize: 24, fontWeight: '700', color: '#0F172A', padding: 20, paddingTop: 60 },
  leagueTabs: { paddingLeft: 16, marginBottom: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: '#F1F5F9' },
  tabActive: { backgroundColor: '#2563EB' },
  tabText: { color: '#475569', fontWeight: '500' },
  tabTextActive: { color: '#FFF', fontWeight: '600' },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  league: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  leagueName: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '700' },
  teams: { flexDirection: 'row', alignItems: 'center' },
  teamName: { flex: 1, fontWeight: '600', color: '#0F172A', fontSize: 15 },
  scoreBox: { paddingHorizontal: 16 },
  score: { fontSize: 22, fontWeight: '700', color: '#334155' },
  scoreLive: { color: '#EF4444' },
});
