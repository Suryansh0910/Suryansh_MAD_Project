import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import league from '../sample/sample_league';

function formatDate(iso) {
  try {
    const d = new Date(iso);
    const opts = { day: '2-digit', month: 'short', year: 'numeric' };
    return d.toLocaleDateString('en-GB', opts);
  } catch {
    return iso || '';
  }
}

// Simple header that shows basic league info (name, logo, country)
function LeagueHeader({ header }) {
  if (!header) return null;
  const { league: lg, country } = header;
  return (
    <View style={styles.headerCard}>
      <View style={styles.headerRow}>
        {/* League logo on the left if available */}
        {lg?.logo ? (
          <Image source={{ uri: lg.logo }} style={styles.logoLg} />
        ) : null}
        {/* League title and country */}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{lg?.name ?? ''}</Text>
          <Text style={styles.subtitle}>{country?.name ?? ''} {country?.flag ? '•' : ''} {country?.code ?? ''}</Text>
        </View>
      </View>
      <Text style={styles.badgeText}>Type: {lg?.type ?? ''}</Text>
    </View>
  );
}

// Simple season row showing year + start/end dates
function SeasonCard({ season }) {
  if (!season) return null;
  const start = formatDate(season.start);
  const end = formatDate(season.end);
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.seasonYear}>{season.year}</Text>
        {/* Badge to indicate current or past season */}
        <View style={[styles.badge, season.current ? styles.badgeOn : styles.badgeOff]}>
          <Text style={[styles.badgeText, { color: season.current ? '#0a7' : '#666' }]}>{season.current ? 'Current' : 'Past'}</Text>
        </View>
      </View>
      <Text style={styles.meta}>Start: {start}</Text>
      <Text style={styles.meta}>End: {end}</Text>
    </View>
  );
}

export default function Leagues() {
  // Load the league payload from local sample (no network calls)
  const payload = league;
  const item = payload?.response?.[0] ?? {};
  const seasons = item?.seasons ?? [];
  const header = { league: item?.league, country: item?.country };

  const keyExtractor = (s) => String(s?.year ?? Math.random());

  return (
    <SafeAreaView style={styles.container}>
      {/* FlatList to display seasons. Header shows basic league info. */}
      <FlatList
        data={seasons}
        keyExtractor={keyExtractor}
        ListHeaderComponent={<LeagueHeader header={header} />}
        renderItem={({ item: s }) => <SeasonCard season={s} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  headerCard: { backgroundColor: '#fff', padding: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e5e5e5' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  logoLg: { width: 36, height: 36, borderRadius: 18, marginRight: 12, backgroundColor: '#eee' },
  title: { fontSize: 18, fontWeight: '700', color: '#111' },
  subtitle: { marginTop: 2, fontSize: 12, color: '#666' },
  badge: { backgroundColor: '#eef4ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeOn: { backgroundColor: '#e8fff6' },
  badgeOff: { backgroundColor: '#f4f4f4' },
  badgeText: { fontWeight: '600', color: '#2f5aff' },
  card: { backgroundColor: '#fff', marginHorizontal: 12, borderRadius: 10, padding: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  seasonYear: { fontSize: 16, fontWeight: '700', color: '#111' },
  meta: { fontSize: 12, color: '#666', marginTop: 2 },
  separator: { height: 10 },
});


