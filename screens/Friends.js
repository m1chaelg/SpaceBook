import React, {Component} from 'react';
import {Text, View, Button, ActivityIndicator, FlatList,
  SafeAreaView, ScrollView} from 'react-native';
import {Card} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SearchBar} from 'react-native-elements';
import styles from '../style/Styles';

class FriendScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      id: 0,
      loading: true,
      friends: [],
      friendrequests: [],
      search: '',
    };
  }

  async componentDidMount() {
    this.setState({
      loading: true,
      token: await AsyncStorage.getItem('token'),
      id: await AsyncStorage.getItem('id'),
    });

    this.getFriends();
    this.getFriendRequests();

    this.setState({loading: false});

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getFriends();
      this.getFriendRequests();
    });
  }

  getFriends = async () => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.id + '/friends', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-authorization': this.state.token,
      },
    })
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            friends: response,
          });
        })
        .catch((error) => {
          console.log(error);
        });
  };

  getFriendRequests = async () => {
    return fetch('http://localhost:3333/api/1.0.0/friendrequests', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-authorization': this.state.token,
      },
    })
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            friendrequests: response,
          });
        })
        .catch((error) => {
          console.log(error);
        });
  };

  friendRequest = async (id, response) => {
    return fetch('http://localhost:3333/api/1.0.0/friendrequests/' + id, {
      method: response,
      headers: {
        'X-authorization': this.state.token,
      },
    })
        .then(() => {
          console.log('Friend request ' + response);
          this.getFriendRequests();
        })
        .then(() => {
          this.getFriends();
        })
        .catch((error) => {
          console.log(error);
        });
  };

  myItemSeparator = () => {
    return <View style={styles.itemSeperator} />;
  };

  goToProfile(id, first, last) {
    this.props.navigation.navigate('Friend Profile', {
      user_id: id,
      name: first + ' ' + last,
    });
  }

  searchFriends() {
    this.props.navigation.navigate('Find Friends', {
      friends: this.state.friends,
    });
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
      return (
        <SafeAreaView style={styles.safeAreaView}>
          <SearchBar
            placeholder="Find friends..."
            onChangeText={this.updateSearch}
            value={this.state.search}
            platform="android"
            onClick={() => this.searchFriends()}
          />
          <ScrollView>
            {this.state.friendrequests.length !== 0 ?
            <FlatList
              data={this.state.friendrequests}
              ListHeaderComponent={() => (
                <Text style={styles.cardTitle}>Friend Requests</Text>
              )}
              renderItem={({item}) =>
                <Card containerStyle={{padding: 5}}>
                  <Text style={styles.wallPost}>
                    {item.first_name} {item.last_name}
                  </Text>
                  <View style={styles.horizontalContainer}>
                    <View style={styles.buttonContainer}>
                      <Button
                        title="Accept"
                        onPress={() => this.friendRequest(item.user_id, 'POST')}
                        color="#5643fd"
                      />
                    </View>
                    <View style={styles.buttonContainer}>
                      <Button
                        title="Reject"
                        onPress={() =>
                          this.friendRequest(item.user_id, 'DELETE')}
                        color="#ba1e68"
                      />
                    </View>
                  </View>
                </Card>}
              keyExtractor={(item) => item.user_id}
            /> :
            <View>
              <Text style={styles.cardTitle}>Friend Requests</Text>
              <Card containerStyle={{padding: 5}}>
                <Text style={styles.wallPost}>No friend requests.</Text>
              </Card></View>}
            <FlatList
              data={this.state.friends}
              ListHeaderComponent={() => (
                <Text style={styles.cardTitle}>Friends</Text>
              )}
              renderItem={({item}) =>
                <Card containerStyle={{padding: 5}}>
                  <Text style={styles.wallPost}>
                    {item.user_givenname} {item.user_familyname}
                  </Text>
                  <View style={styles.centralButton}>
                    <Button
                      title="View"
                      onPress={() => this.goToProfile(item.user_id,
                          item.user_givenname, item.user_familyname)}
                      color="#7649fe"
                    />
                  </View>
                </Card>}
              keyExtractor={(item) => item.user_id}
            />
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}

export default FriendScreen;
