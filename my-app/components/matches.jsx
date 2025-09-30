import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import matches from '../sample/sample_matches';

// We will compute summary stats from the perspective of Manchester United (team id 33)
const TEAM_ID = 33;

// Small helper to tidy venue names (e.g. normalize apostrophes and remove suffixes)
function normalizeVenueName(name) {
  if (!name) return '';
  let n = name.replace(/\s*\$$.*\$$$/,''); // drop any trailing markers like $(...)
  n = n.replace(/St\.\s*/,'St '); // "St." -> "St "
  n = n.replace(/James[’']/,'James’'); // normalize apostrophe for St James’ Park
  return n.trim();
}

// Turn the ISO date into a readable date string (kept simple and consistent)
function formatDate(iso, tz) {
  try {
    const d = new Date(iso);
    const opts = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' };
    return `${d.toLocaleString('en-GB', opts)} ${tz || 'UTC'}`;
  } catch {
    return iso || '';
  }
}

// Build W/D/L and goals for/against from finished fixtures only
function computeSummary(fixtures) {
  let played = 0, wins = 0, draws = 0, losses = 0, gf = 0, ga = 0;
  fixtures?.forEach(item => {
    const { teams, goals } = item || {};
    if (goals?.home == null || goals?.away == null) return; // skip if score missing
    played += 1;
    const isHome = teams?.home?.id === TEAM_ID;
    const forGoals = isHome ? goals.home : goals.away;
    const againstGoals = isHome ? goals.away : goals.home;
    gf += forGoals || 0;
    ga += againstGoals || 0;
    const homeWin = teams?.home?.winner === true;
    const awayWin = teams?.away?.winner === true;
    const isDraw = teams?.home?.winner == null && teams?.away?.winner == null && goals.home === goals.away;
    if (isDraw) draws += 1;
    else if ((isHome && homeWin) || (!isHome && awayWin)) wins += 1;
    else losses += 1;
  });
  return { played, wins, draws, losses, gf, ga };
}

export default function Matches() {
  // Load fixtures from the local sample file (no network calls)
  const fixtures = matches?.response ?? [];
  const h2h = matches?.parameters?.h2h ?? 'Head-to-Head';
  const resultsCount = matches?.results ?? fixtures.length;
  const summary = useMemo(() => computeSummary(fixtures), [fixtures]);

  return (
    // Safe area so content doesn't clash with device notches
    <View style={styles.container}>
      {/* FlatList to render all fixtures efficiently */}
      <FlatList
        data={fixtures}
        keyExtractor={(item) => String(item?.fixture?.id ?? Math.random())}
        // Simple header that shows the H2H info and our computed summary
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{h2h}</Text>
            <Text style={styles.headerSub}>
              Matches: {resultsCount} -  Played: {summary.played} -  W {summary.wins} D {summary.draws} L {summary.losses} -  GF {summary.gf} GA {summary.ga}
            </Text>
          </View>
        }
        // Render each fixture inline to keep it very simple and obvious
        renderItem={({ item }) => {
          const { fixture, league, teams, goals, score } = item || {};
          const dateText = formatDate(fixture?.date, fixture?.timezone);
          const venueText = [normalizeVenueName(fixture?.venue?.name), fixture?.venue?.city].filter(Boolean).join(', ');

          // Determine colors for the big fulltime score based on winners
          const ftHome = goals?.home ?? '-';
          const ftAway = goals?.away ?? '-';
          const winnerHome = teams?.home?.winner === true;
          const winnerAway = teams?.away?.winner === true;
          const colorHome = winnerHome ? '#0a7' : winnerAway ? '#c33' : '#222';
          const colorAway = winnerAway ? '#0a7' : winnerHome ? '#c33' : '#222';

          return (
            <View style={styles.card}>
              {/* Home and Away team rows with logo and name */}
              <View style={styles.teamsRow}>
                <View style={styles.teamCell}>
                  {teams?.home?.logo ? <Image source={{ uri: teams.home.logo }} style={styles.logo} /> : null}
                  <Text style={styles.teamName}>{teams?.home?.name ?? ''}</Text>
                </View>
                <View style={styles.teamCell}>
                  {teams?.away?.logo ? <Image source={{ uri: teams.away.logo }} style={styles.logo} /> : null}
                  <Text style={styles.teamName}>{teams?.away?.name ?? ''}</Text>
                </View>
              </View>

              {/* Score + status row */}
              <View style={styles.rowBetween}>
                <View style={styles.scoreBlock}>
                  <Text style={[styles.scoreText, { color: colorHome }]}>{ftHome}</Text>
                  <Text style={styles.scoreDash}>–</Text>
                  <Text style={[styles.scoreText, { color: colorAway }]}>{ftAway}</Text>
                  {score?.halftime ? (
                    <Text style={styles.subText}> HT {score.halftime.home ?? 0}–{score.halftime.away ?? 0}</Text>
                  ) : null}
                </View>
                {/* Compact status badge showing short and long labels if present */}
                {fixture?.status ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{fixture.status.short ?? ''}</Text>
                    {fixture.status.long ? <Text style={styles.badgeSub}> {fixture.status.long}</Text> : null}
                  </View>
                ) : null}
              </View>

              {/* Meta information: date, venue, optional referee */}
              {dateText ? <Text style={styles.meta}>{dateText}</Text> : null}
              {venueText ? <Text style={styles.meta}>{venueText}</Text> : null}
              {fixture?.referee ? <Text style={styles.meta}>{`Ref: ${fixture.referee}`}</Text> : null}

              {/* League chip with simple text */}
              {league ? (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>
                    {(league.name ?? '')} - {(league.round ?? '')} - {(league.season ?? '')}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        }}
        // Space between cards
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

// Kept styles small and readable; only essentials included
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e5e5e5' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111', marginBottom: 4 },
  headerSub: { fontSize: 12, color: '#555' },
  card: { backgroundColor: '#fff', marginHorizontal: 12, marginTop: 12, borderRadius: 10, padding: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  teamsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  teamCell: { flexDirection: 'row', alignItems: 'center', width: '48%' },
  logo: { width: 22, height: 22, borderRadius: 11, marginRight: 8, backgroundColor: '#eee' },
  teamName: { fontSize: 14, color: '#222', flexShrink: 1 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  scoreBlock: { flexDirection: 'row', alignItems: 'center' },
  scoreText: { fontSize: 22, fontWeight: '700' },
  scoreDash: { fontSize: 18, color: '#333', marginHorizontal: 6 },
  subText: { marginLeft: 8, fontSize: 12, color: '#666' },
  badge: { backgroundColor: '#eef4ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, flexDirection: 'row', alignItems: 'center' },
  badgeText: { fontWeight: '700', color: '#2f5aff' },
  badgeSub: { fontSize: 12, color: '#2f5aff' },
  meta: { fontSize: 12, color: '#666', marginTop: 2 },
  chip: { marginTop: 8, alignSelf: 'flex-start', backgroundColor: '#f0f0f0', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  chipText: { fontSize: 12, color: '#333' },
  separator: { height: 10 },
});

