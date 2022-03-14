import React, {useState, useEffect} from 'react';
import {Text, TextInput, View,
  Button, ActivityIndicator, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dimensions} from 'react-native';

const EditProfileScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [id, setId] = useState(null);
  const [photo, setPhoto] = useState();
  const [password, setPassword] = useState('');

  useEffect(async () => {
    setToken(await AsyncStorage.getItem('token'));
    setId(await AsyncStorage.getItem('id'));

    if (loading) {
      getProfile();
      getProfilePic();
      setLoading(false);
    }
  });

  const getProfile = async () => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-authorization': token,
      },
    })
        .then((response) => response.json())
        .then((response) => {
          setEmail(response.email);
          setFirstName(response.first_name);
          setLastName(response.last_name);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  const getProfilePic = () => {
    fetch('http://localhost:3333/api/1.0.0/user/' + id + '/photo', {
      method: 'GET',
      headers: {
        'X-Authorization': token,
      },
    })
        .then((res) => {
          return res.blob();
        })
        .then((resBlob) => {
          const data = URL.createObjectURL(resBlob);
          setPhoto(data);
        })
        .catch((err) => {
          console.log('error', err);
        });
  };

  const takePhoto = async () => {
    navigation.navigate('Camera');
  };

  const saveProfile = () => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-authorization': token,
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password}),
    })
        .then((response) => {
          if (response.status == 200) {
            console.log(response);
            alert('Updated');
            navigation.goBack(null);
          } else {
            console.log(response);
          }
        })
        .catch((error) => {
          alert(response.status);
          console.log(error);
        });
  };

  if (loading) {
    return (
      <View>
        <ActivityIndicator
          size="large"
          color="#00ff00"
        />
      </View>
    );
  } else {
    return (
      <View style={{padding: 5}}>
        <Image
          source={{
            uri: photo,
          }}
          style={{
            width: (Dimensions.get('window').width) - 10,
            height: (Dimensions.get('window').width) - 10,
          }}
        />
        <Button
          title="Update profile picture"
          onPress={() => takePhoto()}
        />
        <Text>First name:</Text>
        <TextInput
          style={{height: 40}}
          placeholder={firstName}
          onChangeText={(value) => setFirstName(value)}
          value={firstName}
        />
        <Text>Last name:</Text>
        <TextInput
          style={{height: 40}}
          placeholder={lastName}
          onChangeText={(value) => setLastName(value)}
          value={lastName}
        />
        <Text>Email:</Text>
        <TextInput
          style={{height: 40}}
          placeholder={email}
          onChangeText={(value) => setEmail(value)}
          value={email}
        />
        <Text>Enter a new password only if you wish to change,
            otherwise leave blank:</Text>
        <TextInput
          style={{height: 40}}
          placeholder="Password"
          onChangeText={(value) => setPassword(value)}
          value={password}
          secureTextEntry='true'
        />
        <Button
          title="Save"
          onPress={() => saveProfile()}
        />
      </View>
    );
  }
};

export default EditProfileScreen;
