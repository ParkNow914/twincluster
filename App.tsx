import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from './src/screens/HomeScreen';
import { SquadScreen } from './src/screens/SquadScreen';
import { MatchesScreen } from './src/screens/MatchesScreen';
import { StandingsScreen } from './src/screens/StandingsScreen';
import { TacticsScreen } from './src/screens/TacticsScreen';
import { TransferMarketScreen } from './src/screens/TransferMarketScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#1a237e',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: () => null,
          }}
        />
        <Tab.Screen
          name="Squad"
          component={SquadScreen}
          options={{
            tabBarLabel: 'Squad',
            tabBarIcon: () => null,
          }}
        />
        <Tab.Screen
          name="Transfer"
          component={TransferMarketScreen}
          options={{
            tabBarLabel: 'Market',
            tabBarIcon: () => null,
          }}
        />
        <Tab.Screen
          name="Matches"
          component={MatchesScreen}
          options={{
            tabBarLabel: 'Matches',
            tabBarIcon: () => null,
          }}
        />
        <Tab.Screen
          name="Tactics"
          component={TacticsScreen}
          options={{
            tabBarLabel: 'Tactics',
            tabBarIcon: () => null,
          }}
        />
        <Tab.Screen
          name="Standings"
          component={StandingsScreen}
          options={{
            tabBarLabel: 'Table',
            tabBarIcon: () => null,
          }}
        />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
