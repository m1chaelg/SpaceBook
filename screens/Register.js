import React, { Component, useState } from 'react';
import { Text, TextInput, View, Button } from 'react-native';

const RegisterScreen = () => {
  const [firstName, setFirst] = useState('');
  const [lastName, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <View style={{padding: 10}}>
      <TextInput
        style={{height: 40}}
        placeholder="First name"
        onChangeText={ value => setFirst(value)}
        value={firstName}
      />
      <TextInput
        style={{height: 40}}
        placeholder="Last name"
        onChangeText={ value => setLast(value)}
        value={lastName}
      />
      <TextInput
        style={{height: 40}}
        placeholder="Email"
        onChangeText={ value => setEmail(value)}
        value={email}
      />
      <TextInput
        style={{height: 40}}
        placeholder="Password"
        onChangeText={ value => setPassword(value)}
        value={password}
        secureTextEntry='true'
      />

    </View>
  );
}

export default RegisterScreen;