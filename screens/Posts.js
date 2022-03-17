import React, {Component} from 'react';
import {Text, TextInput, View, Button, ActivityIndicator,
  FlatList, SafeAreaView, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card} from 'react-native-elements';
import moment from 'moment';
import styles from '../style/Styles'

class PostsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      id: 0,
      loading: true,
      posts: [],
      likes: [],
      newPost: '',
      status: '',
      drafts: [],
    };
  }

  async componentDidMount() {
    this.setState({
      loading: true,
      token: await AsyncStorage.getItem('token'),
      id: await AsyncStorage.getItem('id'),
    });

    this.updateDrafts();

    this.getPosts();

    this.setState({loading: false});

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getPosts();
      this.updateDrafts();
    });
  }

  async updateDrafts() {
    try {
      this.setState({drafts: JSON.parse(await AsyncStorage.getItem('drafts'))})
    } catch(err) {
      this.setState({drafts: []})
    }
  }

  getPosts = async () => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.id + '/post', {
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

  deletePost = async (postId) => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.id + '/post/' + postId, {
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

  sendLike = async () => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.id + '/post', {
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

  editPost(item) {
    this.props.navigation.navigate('Post', {
      post_id: item.post_id,
      post: item,
      wall_id: this.state.id,
    });
  }

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
        </View> : <Text></Text>}
      </Card>
    );
  };

  newPost = async () => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.id + '/post', {
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

  savePost = async () => {
    if(this.state.drafts === 0) {
      var newArr = new Array()
      newArr.push(this.state.newPost)
      this.setState({drafts: newArr})
    } else {
      this.setState({
        drafts: this.state.drafts.concat(this.state.newPost)
      })
    }
  }

  viewDrafts() {
    this.props.navigation.navigate('Drafts', {
      drafts: this.state.drafts
    });
  }

  async saveDrafts () {
    try {
      await AsyncStorage.setItem('drafts', JSON.stringify(this.state.drafts))
      .then(
        () => AsyncStorage.getItem('drafts')
              .then((result)=>console.log(result))
     )
    } catch(err) {
      this.setState({status: err})
    }
  }

  render() {
    const draftBtn = "View Drafts ( " + this.state.drafts.length + " )"
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
        <ScrollView style={styles.scrollView}>
          <SafeAreaView style={styles.safeAreaView}>
            <Card containerStyle={{padding: 5}}>
              <Card.Title style={styles.wallPost}>Post something:</Card.Title>
              <Card.Divider style={styles.cardDivider}/>
              <TextInput
                style={styles.textInput}
                onChangeText={(newPost) => this.setState({newPost})}
                multiline
                numberOfLines={4}
                value={this.state.newPost}
                placeholder="Enter message here..."
              />
              <Card.Divider style={styles.cardDivider}/>
              <View style={styles.horizontalContainer}>
              <View style={styles.buttonContainer}>
              <Button
                title="Submit post"
                onPress={() => this.newPost()}
                color="#5643fd"
              />
              </View>
              <View style={styles.buttonContainer}>
              <Button
                title="Save as draft"
                onPress={() => this.savePost().then(() => this.saveDrafts())}
                color="#7649fe"
              />
              </View>
              <View style={styles.buttonContainer}>
              <Button
                title={draftBtn} 
                onPress={() => this.viewDrafts()}
                color="#7649fe"
              />
              </View>
            </View>
              <Card.Divider style={styles.cardDivider} />
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
          </SafeAreaView>
        </ScrollView>
      );
    }
  }
}

export default PostsScreen;
