
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native'; // For loading indicator
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

export default function AppNavigator() {
  const { userToken, isLoading } = useContext(AuthContext); // Use userToken and isLoading from context

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
