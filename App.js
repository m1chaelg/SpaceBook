import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register'
import HomeScreen from './screens/Home'
import CameraScreen from './screens/Camera';
import EditProfileScreen from './screens/EditProfile';
import FriendProfileScreen from './screens/FriendProfile';
import FindFriendsScreen from './screens/FindFriends';
import PostScreen from './screens/Post';
import DraftsScreen from './screens/Drafts';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
        <Stack.Screen name="Friend Profile" component={FriendProfileScreen} options={({ route }) => ({ title: route.params.name })} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Find Friends" component={FindFriendsScreen} />
        <Stack.Screen name="Post" component={PostScreen} />
        <Stack.Screen name="Drafts" component={DraftsScreen} />
        <Stack.Screen name="Home"
          component={HomeScreen}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
