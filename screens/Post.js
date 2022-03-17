import React, {Component} from 'react';
import {Text, TextInput, View, Button, ActivityIndicator,
  SafeAreaView, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card} from 'react-native-elements';
import moment from 'moment';
import styles from '../style/Styles';

class PostScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      id: 0,
      loading: true,
      post: null,
      postId: 0,
      editText: '',
      status: 'Click submit when you\'ve finished editing.',
      wallId: 0,
    };
  }

  async componentDidMount() {
    this.setState({
      loading: true,
      token: await AsyncStorage.getItem('token'),
      id: await AsyncStorage.getItem('id'),
      postId: this.props.route.params.post_id,
      post: this.props.route.params.post,
      editText: this.props.route.params.post.text,
      status: '',
      wallId: this.props.route.params.wall_id,
    });

    this.fetchPost();

    this.setState({loading: false});

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.fetchPost();
    });
  }

  fetchPost = async () => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.wallId + '/post/' + this.state.postId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-authorization': this.state.token,
      },
    })
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            post: response,
          });
        })
        .catch((error) => {
          console.log(error);
        });
  };

  updatePost = async () => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.wallId + '/post/' + this.state.postId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-authorization': this.state.token,
      },
      body: JSON.stringify({text: this.state.editText}),
    })
        .then((response) => {
          if (response.status == 200) {
            console.log(response);
            this.setState({status: 'Updated.'});
          }
        })
        .catch((error) => {
          this.setState({status: error});
          console.log(error);
        });
  };

  deletePost = async () => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.wallId + '/post/' + this.state.postId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-authorization': this.state.token,
      },
    })
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            status: response,
          });
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.props.navigation.goBack(null);
        });
  };

  nameString() {
    return this.state.post.author.first_name + ' ' +
    this.state.post.author.last_name;
  }

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
      const dateTime = moment(this.state.post.timestamp)
          .format('MMMM Do YYYY, h:mm:ss a');
      return (
        <ScrollView style={{flexGrow: 1}}>
          <SafeAreaView style={{padding: 10}}>
            <Card containerStyle={{padding: 5}}>
              <Card.Title>
                <TextInput
                  style={styles.textInput}
                  multiline
                  numberOfLines={4}
                  onChangeText={(editText) => this.setState({editText})}
                  value={this.state.editText}
                  autoFocus={true}
                /></Card.Title>
              <Card.Divider style={styles.cardDivider} />
              <Text>
                {this.nameString()}
              </Text>
              <Text>{dateTime}</Text>
              <Card.Divider style={styles.cardDivider} />
              <View style={styles.horizontalContainer}>
                <View style={styles.buttonContainer}>
                  <Button
                    title="Update"
                    onPress={() => this.updatePost(item)}
                    color="#7649fe"
                  />
                </View>
                {this.state.post.numLikes == 0 ?
              <View style={styles.buttonContainer}>
                <Button
                  title="Delete post"
                  onPress={() => this.deletePost(item.post_id)}
                  color="#ba1e68"
                />
              </View> : <Text></Text>}
              </View>
            </Card>
            <Text>{this.state.status}</Text>
          </SafeAreaView>
        </ScrollView>
      );
    }
  }
}

export default PostScreen;
