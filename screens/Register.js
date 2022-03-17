import React, {useState} from 'react';
import {Text, TextInput, SafeAreaView, Button, View} from 'react-native';
import { Card } from 'react-native-elements';
import styles from '../style/Styles';

const RegisterScreen = ({navigation}) => {
  const [firstName, setFirst] = useState('');
  const [lastName, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [regBtn, setRegBtn] = useState('Register');
  const [hasRegistered, setHasRegistered] = useState(false);

  const register = () => {
    if (!hasRegistered) {
      setStatus('Registering...');
      return fetch('http://localhost:3333/api/1.0.0/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password}),
      })
          .then((response) => response.json())
          .then((response) => {
            setStatus('User successfully created.');
            setHasRegistered(true);
            setRegBtn('Go back');
          })
          .catch((error) => {
            console.log(error);
            setStatus('User or email already exists.');
          });
    } else {
      navigation.goBack(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Card containerStyle={{padding: 5}}>
      <TextInput
        style={{height: 40}}
        placeholder="First name"
        onChangeText={ (value) => setFirst(value)}
        value={firstName}
      />
      <TextInput
        style={{height: 40}}
        placeholder="Last name"
        onChangeText={ (value) => setLast(value)}
        value={lastName}
      />
      <TextInput
        style={{height: 40}}
        placeholder="Email"
        onChangeText={ (value) => setEmail(value)}
        value={email}
      />
      <TextInput
        style={{height: 40}}
        placeholder="Password"
        onChangeText={ (value) => setPassword(value)}
        value={password}
        secureTextEntry='true'
      />
      <Card.Divider style={styles.cardDivider} />
      <View style={styles.centralButton}>
      <Button
        title={regBtn}
        onPress={() => register()}
        color="#5643fd"
      />
      </View>
      <Text>{status}</Text>
      </Card>
      </SafeAreaView>
  );
};

export default RegisterScreen;
