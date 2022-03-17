import React, {Component} from 'react';
import {Text, TextInput, View, SafeAreaView,
  Button, ActivityIndicator, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dimensions} from 'react-native';
import styles from '../style/Styles';
import {Card} from 'react-native-elements';

class EditProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      friendCount: '',
      loading: true,
    };
  }

  async componentDidMount() {
    this.setState({
      token: await AsyncStorage.getItem('token'),
      id: await AsyncStorage.getItem('id'),
      loading: true,
    });
    this.getProfile();
    this.setState({loading: false});

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getProfile();
    });
  }


  getProfile = async () => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-authorization': this.state.token,
      },
    })
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            email: response.email,
            firstName: response.first_name,
            lastName: response.last_name,
          });
        })
        .catch((error) => {
          console.log(error);
        });
  };

  takePhoto = async () => {
    this.props.navigation.navigate('Camera');
  };

  saveProfile = () => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-authorization': this.state.token,
      },
      body: JSON.stringify({
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email: this.state.email,
        password: this.state.password}),
    })
        .then((response) => {
          if (response.status == 200) {
            console.log(response);
            this.props.navigation.goBack(null);
          } else {
            console.log(response);
          }
        })
        .catch((error) => {
          alert(response.status);
          console.log(error);
        });
  };

  render() {
  if (this.state.loading) {
    return (
      <View>
        <ActivityIndicator
          size="large"
          color="#00ff00"
        />
      </View>
    )
  } else {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <Card containerStyle={{padding: 5}}>
          <View style={styles.centralButton}>
            <Button
              title="Update profile picture"
              onPress={() => this.takePhoto()}
              color="#7649fe"
            />
          </View>
          <View style={styles.horizontalContainer}>
            <View style={styles.textContainer}>
              <Text>First name:</Text>
            </View>
            <View style={styles.textContainer2}>
              <TextInput
                style={{height: 40}}
                placeholder={this.state.firstName}
                onChangeText={(firstName) => this.setState({firstName})}
                value={this.state.firstName}
              />
            </View>
          </View>
          <Card.Divider style={styles.cardDivider} />
          <View style={styles.horizontalContainer}>
            <View style={styles.textContainer}>
              <Text>Last name:</Text>
            </View>
            <View style={styles.textContainer2}>
              <TextInput
                style={{height: 40}}
                placeholder={this.state.lastName}
                onChangeText={(lastName) => this.setState({lastName})}
                value={this.state.lastName}
              />
            </View>
          </View>
          <Card.Divider style={styles.cardDivider} />
          <View style={styles.horizontalContainer}>
            <View style={styles.textContainer}>
              <Text>Email:</Text>
            </View>
            <View style={styles.textContainer2}>
              <TextInput
                style={{height: 40}}
                placeholder={this.state.email}
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}
              />
            </View>
          </View>
          <Card.Divider style={styles.cardDivider} />
          <View style={styles.horizontalContainer}>
            <View style={styles.textContainer}>
              <Text>Password</Text>
            </View>
            <View style={styles.textContainer2}>
              <TextInput
                style={{height: 40}}
                placeholder="Password"
                onChangeText={(password) => this.setState({password})}
                value={this.state.password}
                secureTextEntry='true'
              />
            </View>
          </View>
          <Card.Divider style={styles.cardDivider} />
          <View style={styles.centralButton}>
            <Button
              title="Save"
              onPress={() => this.saveProfile()}
              color="#5643fd"
            />
          </View>
        </Card>
      </SafeAreaView>
    );
  }
}
};

export default EditProfileScreen;
