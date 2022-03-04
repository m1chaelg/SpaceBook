import React, { Component, useState, useEffect } from 'react';
import { Button, View, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    var token = await AsyncStorage.getItem('token')
    if(token) {
      navigation.navigate('Home')
    }
  })

  const handleLogin = () => {
    loginReq();
  }

  const loginReq = () => {
    setLoading(true);
    return fetch("http://localhost:3333/api/1.0.0/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: email, password: password})
    })
      .then((response) => response.json())
      .then((response) => {
        setLoading(false);
        if(response.token) {
          AsyncStorage.setItem('token', response.token);
          AsyncStorage.setItem('id', response.id);
          navigation.navigate('Home');
        } else {
          console.log(response)
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: '' }}>

      <TextInput
        style={{ height: 40 }}
        placeholder="Email"
        onChangeText={value => setEmail(value)}
        value={email}
      />
      <TextInput
        style={{ height: 40 }}
        placeholder="Password"
        onChangeText={value => setPassword(value)}
        value={password}
        secureTextEntry='true'
      />

      <Button
        title="Login"
        onPress={() => handleLogin()}
      />

      <Button
        title="Register"
        onPress={() => navigation.navigate('Register')}
      />

    </View>
  );
}