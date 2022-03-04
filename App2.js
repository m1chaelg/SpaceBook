import * as React from 'react';

import { Text, TextInput, View, StyleSheet, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Constants from 'expo-constants';

import Home from './screens/Home'

const Stack = createNativeStackNavigator();

const Auth = React.createContext(null);

export function Login() {
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  
  const { setToken } = React.useContext(Auth)

  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        value={email}
        style={styles.input}
        onChangeText={(email) => setEmail(email)}
      />

      <TextInput
        label="Password"
        value={pass}
        style={styles.input}
        onChangeText={(password) => setPass(password)}
      />

      <Button mode="contained" onPress={() => setToken('Get the token and save!')}>Login</Button>
    </View>
  );
}

/*export function Home() {
const { setToken } = React.useContext(Auth)

  return (
    <View>
      <Text>Home</Text>
      <Button mode="contained" onPress={() => setToken(null)}>Signout</Button>
    </View>
  );
}*/

export default function App() {
  const [token, setToken] = React.useState(null);

  return (
    <Auth.Provider value={{token, setToken}}>
      <NavigationContainer>
        <Stack.Navigator>
          {!token ? (
            <Stack.Screen name="Login" component={Login} />
          ) : (
            <Stack.Screen name="Home" component={Home} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </Auth.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  input: {
    marginBottom: 20,
  },
});