import React, {Component} from 'react';
import {
  Text, TextInput, View, Button, ActivityIndicator,
  Image, FlatList, SafeAreaView, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {Card} from 'react-native-elements';
import styles from '../style/Styles';

class FriendProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      id: 0,
      friendId: 0,
      firstName: '',
      lastName: '',
      email: '',
      friendCount: '',
      photo: null,
      loading: true,
      posts: [],
      likes: [],
      newPost: '',
      status: '',
    };
  }

  async componentDidMount() {
    this.setState({
      token: await AsyncStorage.getItem('token'),
      id: await AsyncStorage.getItem('id'),
      friendId: this.props.route.params.user_id,
      loading: true,
    });
    this.getProfile();
    this.getProfilePic();
    this.getPosts();
    this.setState({loading: false});

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getProfile();
      this.getProfilePic();
      this.getPosts();
    });
  }

  getProfile = async () => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.friendId, {
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
    fetch('http://localhost:3333/api/1.0.0/user/' + this.state.friendId + '/photo', {
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
        })
        .catch((err) => {
          console.log('error', err);
        });
  };

  editPost(item) {
    this.props.navigation.navigate('Post', {
      post_id: item.post_id,
      wall_id: this.state.friendId,
      post: item,
    });
  }

  deletePost = async (postId) => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.friendId + '/post/' + postId, {
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
          this.getPosts();
        });
  };

  likeOrUnlikePost = async (item, method) => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.friendId + '/post/' + item.post_id + '/like', {
      method: method,
      headers: {
        'X-authorization': this.state.token,
      },
    })
        .then(() => {
          this.getPosts();
        })
        .catch((error) => {
          console.log(error);
        });
  };

  postCard = (item) => {
    const dateTime = moment(item.timestamp).format('MMMM Do YYYY, h:mm:ss a');
    return (
      <Card containerStyle={styles.cardContainer}>
        <Text style={styles.wallPost}>{item.text}</Text>
        <Card.Divider style={styles.cardDivider} />
        <View style={styles.horizontalContainer}>
          <View style={styles.textContainer2}>
            <Text>{item.author.first_name} {item.author.last_name}</Text>
            <Text>{dateTime}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text>{item.numLikes} Likes</Text>
          </View>
        </View>
        <Card.Divider style={styles.cardDivider} />
        {this.state.id == item.author.user_id ?
        <View style={styles.horizontalContainer}>
          <View style={styles.buttonContainer}>
            <Button
              title="Edit post"
              onPress={() => this.editPost(item)}
              color="#7649fe"
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Delete post"
              onPress={() => this.deletePost(item.post_id)}
              color="#ba1e68"
            />
          </View>
        </View> :
        <View style={styles.horizontalContainer}>
          <View style={styles.buttonContainer}>
            <Button
              title="Like"
              onPress={() => this.likeOrUnlikePost(item, 'POST')}
              color="#5643fd"
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Unlike"
              onPress={() => this.likeOrUnlikePost(item, 'DELETE')}
              color="#7649fe"
            />
          </View>
        </View>}
      </Card>
    );
  };

  getPosts = async () => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.friendId + '/post', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-authorization': this.state.token,
      },
    })
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            posts: response,
          });
        })
        .catch((error) => {
          console.log(error);
        });
  };

  newPost = async () => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.friendId + '/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-authorization': this.state.token,
      },
      body: JSON.stringify({text: this.state.newPost}),
    })
        .then((response) => {
          if (response.status == 200) {
            this.setState({status: 'Posted.'});
          }
        })
        .catch((error) => {
          this.setState({status: error});
          console.log(error);
        })
        .finally(() => {
          this.setState({newPost: ''});
          this.getPosts();
        });
  };

  myItemSeparator = () => {
    return <View style={{
      height: 1, backgroundColor: 'grey',
      marginHorizontal: 10, marginTop: 5,
    }} />;
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
          <ScrollView>
            <Card containerStyle={{padding: 5}}>
              <Image
                source={{
                  uri: this.state.photo,
                }}
                style={{
                  width: '100%',
                  height: 300,
                }}
              />
              <Text>{this.state.firstName} {this.state.lastName}</Text>
              <Text>Email: {this.state.email}</Text>
              <Text>Friends: {this.state.friendCount}</Text>
            </Card>
            <Card containerStyle={{padding: 5}}>
              <Card.Title style={styles.wallPost}>Post something:</Card.Title>
              <Card.Divider style={styles.cardDivider} />
              <TextInput
                style={styles.textInput}
                onChangeText={(newPost) => this.setState({newPost})}
                multiline
                numberOfLines={4}
                value={this.state.newPost}
                placeholder="Enter message here..."
              />
              <Card.Divider style={styles.cardDivider} />
              <View style={styles.centralButton}>
                <Button
                  title="Submit"
                  onPress={() => this.newPost()}
                  color="#5643fd"
                />
              </View>
              <Text>{this.state.status}</Text>
            </Card>
            <FlatList
              data={this.state.posts}
              ListHeaderComponent={() => (
                <Text style={styles.cardTitle}>Posts</Text>
              )}
              renderItem={(item) => this.postCard(item.item)}
              keyExtractor={(item) => item.post_id}
            />
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}

export default FriendProfileScreen;
