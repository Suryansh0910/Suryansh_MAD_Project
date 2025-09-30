import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import Matches from './components/matches';
import Leagues from './components/Leagues';

// Matches screen implemented in ./components/matches.jsx

function Pending() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>More</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Matches"
        component={Matches}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('./assets/ifkd.jpg')}
              style={{ width: 30, height: 30 }}
            />
          )
        }}
      />
      <Tab.Screen
        name="Leagues"
        component={Leagues}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('./assets/trophy1.jpg')}
              style={{ width: 50, height: 20 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={Pending}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('./assets/threeLine.png')}
              style={{ width: 20, height: 20 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function Settings1() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={Sett}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function Sett() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>No Settings Available</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={MainStack} />
        <Drawer.Screen name="Settings" component={Settings1} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
