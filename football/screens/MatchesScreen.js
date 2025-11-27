import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MatchCard from '../components/MatchCard';

const MatchesScreen = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';

    const fetchMatches = async () => {
        try {
            const response = await fetch('https://api.football-data.org/v4/competitions/PL/matches?status=FINISHED', {
                headers: {
                    'X-Auth-Token': '5356e64139c347e4b186a871a20d5cd6'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch matches');
            }

            const data = await response.json();
            // Sort by date descending (most recent first)
            const sortedMatches = (data.matches || []).sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));
            setMatches(sortedMatches);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchMatches();
    }, []);

    const backgroundColor = isDark ? '#121212' : '#f0f0f0';
    const textColor = isDark ? '#fff' : '#333';

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
                    <Text style={styles.screenTitle}>Recent Results</Text>
                </View>
                <FlatList
                    data={matches}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <MatchCard match={item} />}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#37003c" />
                    }
                    ListEmptyComponent={<Text style={[styles.emptyText, { color: isDark ? '#aaa' : '#666' }]}>No finished matches found.</Text>}
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
    errorText: {
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});

export default MatchesScreen;
