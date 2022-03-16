import React, {Component} from 'react';
import {Text, View, Button,
  ActivityIndicator, Image, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dimensions} from 'react-native';
import styles from '../style/Styles';
import { Card } from 'react-native-elements';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      friendCount: '',
      photo: null,
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
    this.getProfilePic();
    this.setState({loading: false});

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getProfile();
      this.getProfilePic();
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
            friendCount: response.friend_count,
          });
        })
        .catch((error) => {
          console.log(error);
        });
  };

  getProfilePic = () => {
    fetch('http://localhost:3333/api/1.0.0/user/' + this.state.id + '/photo', {
      method: 'GET',
      headers: {
        'X-Authorization': this.state.token,
      },
    })
        .then((res) => {
          return res.blob();
        })
        .then((resBlob) => {
          const data = URL.createObjectURL(resBlob);
          this.setState({photo: data});
          // setPhoto(data)
        })
        .catch((err) => {
          console.log('error', err);
        });
  };

  handleLogout = () => {
    this.logout();
    this.props.navigation.popToTop();
  };

  logout = () => {
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-authorization': this.state.token,
      },
    })
        .then(async () => {
          await AsyncStorage.setItem('token', '');
          await AsyncStorage.setItem('id', '');
        })
        .catch((error) => {
          console.log(error);
        });
  };

  editProfile = () => {
    this.props.navigation.navigate('Edit Profile');
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
      );
    } else {
      return (
        <SafeAreaView style={styles.safeAreaView}>
        <Card containerStyle={{padding: 5}}>
          <Image
            source={{
              uri: this.state.photo,
            }}
            style={{
              width: "100%",
              height: 300,
            }}
          />
          <Card.Divider style={styles.cardDivider} />
          <Text>{this.state.firstName} {this.state.lastName}</Text>
          <Text>Email: {this.state.email}</Text>
          <Text>Friends: {this.state.friendCount}</Text>
          <Card.Divider style={styles.cardDivider} />
          <View style={styles.centralButton}>
          <Button
            title="Edit Profile"
            onPress={() => this.editProfile()}
            color="#7649fe"
          />
          </View>
          <View style={styles.centralButton}>
          <Button
            title="Logout"
            onPress={() => this.handleLogout()}
            color="#ba1e68"
          />
          </View>
          </Card>
        </SafeAreaView>
      );
    }
  }
}

export default ProfileScreen;
