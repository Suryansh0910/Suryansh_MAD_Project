import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const MatchCard = ({ match }) => {
  const { homeTeam, awayTeam, score, status, utcDate } = match;

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.date}>{formatDate(utcDate)}</Text>

      <View style={styles.row}>
        <View style={styles.teamContainer}>
          {homeTeam.crest && <Image source={{ uri: homeTeam.crest }} style={styles.logo} />}
          <Text style={styles.teamName}>{homeTeam.shortName || homeTeam.name}</Text>
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
          <Text style={styles.teamName}>{awayTeam.shortName || awayTeam.name}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
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
    color: '#666',
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
    color: '#333',
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

