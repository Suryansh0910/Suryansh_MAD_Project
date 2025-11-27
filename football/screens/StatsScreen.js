import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Image, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const StatsScreen = () => {
    const [scorers, setScorers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';

    const fetchScorers = async () => {
        try {
            const response = await fetch('https://api.football-data.org/v4/competitions/PL/scorers', {
                headers: {
                    'X-Auth-Token': '5356e64139c347e4b186a871a20d5cd6'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }

            const data = await response.json();
            setScorers(data.scorers || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchScorers();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchScorers();
    }, []);

    const backgroundColor = isDark ? '#121212' : '#f0f0f0';
    const cardBg = isDark ? '#1e1e1e' : '#fff';
    const textColor = isDark ? '#fff' : '#333';
    const subTextColor = isDark ? '#aaa' : '#666';

    const renderItem = ({ item, index }) => (
        <View style={[styles.card, { backgroundColor: cardBg }]}>
            <View style={styles.rankContainer}>
                <Text style={styles.rank}>{index + 1}</Text>
            </View>
            <View style={styles.playerInfo}>
                <Text style={[styles.playerName, { color: textColor }]}>{item.player.name}</Text>
                <View style={styles.teamRow}>
                    {item.team.crest && <Image source={{ uri: item.team.crest }} style={styles.teamLogo} />}
                    <Text style={[styles.teamName, { color: subTextColor }]}>{item.team.shortName || item.team.name}</Text>
                </View>
            </View>
            <View style={styles.goalsContainer}>
                <Text style={styles.goals}>{item.goals}</Text>
                <Text style={[styles.goalsLabel, { color: subTextColor }]}>Goals</Text>
            </View>
        </View>
    );

    if (loading && !refreshing) {
        return (
            <View style={[styles.center, { backgroundColor }]}>
                <ActivityIndicator size="large" color="#37003c" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.center, { backgroundColor }]}>
                <Text style={[styles.errorText, { color: textColor }]}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#37003c' }]} edges={['top']}>
            <View style={[styles.contentContainer, { backgroundColor }]}>
                <View style={styles.headerContainer}>
                    <Text style={styles.screenTitle}>Top Scorers</Text>
                </View>
                <FlatList
                    data={scorers}
                    keyExtractor={(item) => item.player.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#37003c" />
                    }
                    ListEmptyComponent={<Text style={[styles.emptyText, { color: subTextColor }]}>No stats available.</Text>}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        backgroundColor: '#37003c',
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        paddingTop: 10,
    },
    screenTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    list: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    rankContainer: {
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    rank: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#37003c',
    },
    playerInfo: {
        flex: 1,
    },
    playerName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    teamRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    teamLogo: {
        width: 20,
        height: 20,
        marginRight: 6,
        resizeMode: 'contain',
    },
    teamName: {
        fontSize: 14,
    },
    goalsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 50,
    },
    goals: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#37003c',
    },
    goalsLabel: {
        fontSize: 10,
    },
    errorText: {
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});

export default StatsScreen;
