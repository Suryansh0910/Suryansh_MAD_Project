import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import FixturesScreen from './screens/FixturesScreen';
import MatchesScreen from './screens/MatchesScreen';
import StatsScreen from './screens/StatsScreen';
import TableScreen from './screens/TableScreen';

const Tab = createBottomTabNavigator();

export default function App() {
    const MyTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: '#f0f0f0',
        },
    };

    return (
        <NavigationContainer theme={MyTheme}>
            <StatusBar style="dark" />
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: '#fff',
                        borderTopColor: '#e0e0e0',
                        height: 60,
                        paddingBottom: 8,
                        paddingTop: 8,
                    },
                    tabBarActiveTintColor: '#37003c',
                    tabBarInactiveTintColor: 'gray',
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Fixtures') {
                            iconName = focused ? 'calendar' : 'calendar-outline';
                        } else if (route.name === 'Matches') {
                            iconName = focused ? 'football' : 'football-outline';
                        } else if (route.name === 'Stats') {
                            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                        } else if (route.name === 'Table') {
                            iconName = focused ? 'list' : 'list-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
            >
                <Tab.Screen
                    name="Fixtures"
                    component={FixturesScreen}
                    options={{ title: 'Fixtures' }}
                />
                <Tab.Screen
                    name="Matches"
                    component={MatchesScreen}
                    options={{ title: 'Results' }}
                />
                <Tab.Screen
                    name="Table"
                    component={TableScreen}
                    options={{ title: 'Table' }}
                />
                <Tab.Screen
                    name="Stats"
                    component={StatsScreen}
                    options={{ title: 'Stats' }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
