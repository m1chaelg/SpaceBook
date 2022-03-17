import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';
import {Camera} from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

class CameraScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      id: 0,
      hasPermission: null,
      type: Camera.Constants.Type.back,
    };
  }

  async componentDidMount() {
    const {status} = await Camera.requestCameraPermissionsAsync();
    this.setState({
      hasPermission: status === 'granted',
      token: await AsyncStorage.getItem('token'),
      id: await AsyncStorage.getItem('id'),
    });
  }

  sendToServer = async (data) => {
    const res = await fetch(data.base64);
    const blob = await res.blob();

    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.id + '/photo', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': this.state.token,
      },
      body: blob,
    })
        .then((response) => {
          console.log('Picture added', response);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.sendToServer(data),
      };
      await this.camera.takePictureAsync(options);
    }
  };

  render() {
    if (this.state.hasPermission) {
      return (
        <View style={{flex: 1, width: '100%'}}>
          <Camera
            ref={(ref) => {
              this.camera = ref;
            }}
            style={{
              flex: 1,
              width: '100%',
            }}
          />

          <Button
            title="Take Photo" onPress={() => {
              this.takePicture()
              .then(() => this.props.navigation.goBack(null))
            }}
            color="#5643fd"
          />
        </View>
      );
    } else {
      return (
        <Text>
              No access to camera
        </Text>
      );
    }
  }
}

export default CameraScreen;
