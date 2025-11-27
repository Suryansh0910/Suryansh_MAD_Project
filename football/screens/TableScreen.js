import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Image, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TableScreen = () => {
    const [table, setTable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';

    const fetchTable = async () => {
        try {
            const response = await fetch('https://api.football-data.org/v4/competitions/PL/standings', {
                headers: {
                    'X-Auth-Token': '5356e64139c347e4b186a871a20d5cd6'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch table');
            }

            const data = await response.json();
            const totalStandings = data.standings.find(s => s.type === 'TOTAL')?.table || [];
            setTable(totalStandings);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTable();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchTable();
    }, []);

    const backgroundColor = isDark ? '#121212' : '#f0f0f0';
    const rowBg = isDark ? '#1e1e1e' : '#fff';
    const headerBg = isDark ? '#333' : '#e0e0e0';
    const textColor = isDark ? '#fff' : '#333';
    const headerTextColor = isDark ? '#ccc' : '#555';
    const borderColor = isDark ? '#333' : '#f0f0f0';

    const renderHeader = () => (
        <View style={[styles.tableHeader, { backgroundColor: headerBg, borderBottomColor: borderColor }]}>
            <Text style={[styles.headerText, styles.posCol, { color: headerTextColor }]}>#</Text>
            <Text style={[styles.headerText, styles.teamCol, { color: headerTextColor }]}>Team</Text>
            <Text style={[styles.headerText, styles.statCol, { color: headerTextColor }]}>P</Text>
            <Text style={[styles.headerText, styles.statCol, { color: headerTextColor }]}>GD</Text>
            <Text style={[styles.headerText, styles.ptsCol, { color: headerTextColor }]}>Pts</Text>
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={[styles.row, { backgroundColor: rowBg, borderBottomColor: borderColor }]}>
            <Text style={[styles.cellText, styles.posCol, { color: textColor }]}>{item.position}</Text>
            <View style={[styles.teamCol, styles.teamCell]}>
                <Image source={{ uri: item.team.crest }} style={styles.crest} />
                <Text style={[styles.teamName, { color: textColor }]} numberOfLines={1}>{item.team.shortName || item.team.name}</Text>
            </View>
            <Text style={[styles.cellText, styles.statCol, { color: textColor }]}>{item.playedGames}</Text>
            <Text style={[styles.cellText, styles.statCol, { color: textColor }]}>{item.goalDifference}</Text>
            <Text style={[styles.cellText, styles.ptsCol, styles.bold, { color: textColor }]}>{item.points}</Text>
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
                    <Text style={styles.screenTitle}>League Table</Text>
                </View>
                <FlatList
                    data={table}
                    keyExtractor={(item) => item.team.id.toString()}
                    renderItem={renderItem}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#37003c" />
                    }
                    stickyHeaderIndices={[0]}
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
        paddingBottom: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    cellText: {
        fontSize: 14,
    },
    posCol: {
        width: 30,
        textAlign: 'center',
    },
    teamCol: {
        flex: 1,
        paddingHorizontal: 8,
    },
    teamCell: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    crest: {
        width: 24,
        height: 24,
        marginRight: 8,
        resizeMode: 'contain',
    },
    teamName: {
        fontSize: 14,
        fontWeight: '500',
    },
    statCol: {
        width: 35,
        textAlign: 'center',
    },
    ptsCol: {
        width: 35,
        textAlign: 'center',
    },
    bold: {
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 16,
    },
});

export default TableScreen;
