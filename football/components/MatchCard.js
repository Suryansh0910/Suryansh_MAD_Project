import React from 'react';
import { View, Text, StyleSheet, Image, useColorScheme } from 'react-native';

const MatchCard = ({ match }) => {
  const { homeTeam, awayTeam, score, status, utcDate } = match;
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const cardBg = isDark ? '#1e1e1e' : '#fff';
  const textColor = isDark ? '#ddd' : '#333';
  const dateColor = isDark ? '#aaa' : '#666';

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <Text style={[styles.date, { color: dateColor }]}>{formatDate(utcDate)}</Text>
      
      <View style={styles.row}>
        <View style={styles.teamContainer}>
          {homeTeam.crest && <Image source={{ uri: homeTeam.crest }} style={styles.logo} />}
          <Text style={[styles.teamName, { color: textColor }]}>{homeTeam.shortName || homeTeam.name}</Text>
        </View>

        <View style={styles.scoreContainer}>
          {status === 'FINISHED' ? (
            <Text style={styles.score}>
              {score.fullTime.home} - {score.fullTime.away}
            </Text>
          ) : (
            <Text style={styles.vs}>VS</Text>
          )}
        </View>

        <View style={styles.teamContainer}>
          {awayTeam.crest && <Image source={{ uri: awayTeam.crest }} style={styles.logo} />}
          <Text style={[styles.teamName, { color: textColor }]}>{awayTeam.shortName || awayTeam.name}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#37003c', // Premier League Purple
  },
  date: {
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 4,
  },
  teamName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scoreContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#37003c',
  },
  vs: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
  },
});

export default MatchCard;

