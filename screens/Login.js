import React, {useState, useEffect} from 'react';
import {Button, View, TextInput, SafeAreaView, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from 'react-native-elements';
import styles from '../style/Styles';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      navigation.navigate('Home');
    }
  });

  const handleLogin = () => {
    loginReq();
  };

  const loginReq = () => {
    return fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email: email, password: password}),
    })
        .then((response) => response.json())
        .then((response) => {
          if (response.token) {
            AsyncStorage.setItem('token', response.token);
            AsyncStorage.setItem('id', response.id);
            navigation.navigate('Home');
          } else {
            console.log(response);
          }
        })
        .catch((error) => {
          console.log(error);
        });
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
        <Card containerStyle={{padding: 5}}>
        <View style={styles.horizontalContainer}>
        <View style={styles.textContainer}>
        <Text>Email:</Text>
        </View>
        <View style={styles.textContainer2}>
        <TextInput
          style={{height: 40}}
          placeholder="Email"
          onChangeText={(value) => setEmail(value)}
          value={email}
        />
        </View>
        </View>
        <View style={styles.horizontalContainer}>
        <View style={styles.textContainer}>
        <Text>Password:</Text>
        </View>
        <View style={styles.textContainer2}>
        <TextInput
          style={{height: 40}}
          placeholder="Password"
          onChangeText={(value) => setPassword(value)}
          value={password}
          secureTextEntry='true'
        />
        </View>
        </View>
        <Card.Divider style={styles.cardDivider} />
        <View style={styles.horizontalContainer}>
        <View style={styles.buttonContainer}>
        <Button
          title="Login"
          onPress={() => handleLogin()}
          color="#5643fd"
        />
        </View>
        <View style={styles.buttonContainer}>
        <Button
          title="Register"
          onPress={() => navigation.navigate('Register')}
          color="#7649fe"
        />
        </View>
        </View>
        </Card>
        </SafeAreaView>
  );
}
