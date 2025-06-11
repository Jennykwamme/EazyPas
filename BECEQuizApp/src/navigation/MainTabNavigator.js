
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import PracticeScreen from '../screens/PracticeScreen';
import MockExamScreen from '../screens/MockExamScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import ProfileScreen from '../screens/ProfileScreen';
// Import an icon library, e.g., MaterialCommunityIcons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

// Example Stack Navigators for tabs that might need them
const PracticeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="PracticeList" component={PracticeScreen} options={{ title: 'Practice' }}/>
    {/* Add QuestionViewerScreen here later, e.g., <Stack.Screen name="QuestionViewer" component={QuestionViewerScreen} /> */}
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Profile' }}/>
    {/* Add EditProfileScreen here later, e.g., <Stack.Screen name="EditProfile" component={EditProfileScreen} /> */}
  </Stack.Navigator>
);


export default function MainTabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home" activeColor="#fff">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Practice"
        component={PracticeStack} // Using PracticeStack
        options={{
          tabBarLabel: 'Practice',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="book-open-variant" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="MockExams"
        component={MockExamScreen}
        options={{
          tabBarLabel: 'Mock Exams',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clipboard-text-clock" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarLabel: 'Analytics',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-line" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack} // Using ProfileStack
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
