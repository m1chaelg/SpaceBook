import React, {Component} from 'react';
import {Text, View, Button, ActivityIndicator,
  FlatList, SafeAreaView, ScrollView} from 'react-native';
import {SearchBar} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card} from 'react-native-elements';
import styles from '../style/Styles';

class FindFriendsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      id: 0,
      loading: true,
      search: '',
      results: [],
      friends: [],
    };
  }

  async componentDidMount() {
    this.setState({
      loading: true,
      token: await AsyncStorage.getItem('token'),
      id: await AsyncStorage.getItem('id'),
      friends: this.props.route.params.friends,
      loading: false,
    });
  }

  updateSearch = (search) => {
    this.setState({search: search});
    this.getSearchResults();
  };

  getSearchResults = async () => {
    return fetch('http://localhost:3333/api/1.0.0/search?search_in=all&q=' + this.state.search, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-authorization': this.state.token,
      },
    })
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            results: response,
          });
        })
        .then(() => {
          this.setState({
            results:
            this.state.results.filter((f) => {
              return f.user_id != this.state.id;
            }),
          });
        })
        .catch((error) => {
          console.log(error);
        });
  };

  isFriend(userId) {
    return (this.state.friends.find((f) => f.user_id === userId));
  }

  sendFriendReq = async (friendId) => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + friendId + '/friends', {
      method: 'POST',
      headers: {
        'X-authorization': this.state.token,
      },
    })
        .catch((error) => {
          console.log(error);
        });
  };

  goToProfile(id, first, last) {
    this.props.navigation.navigate('Friend Profile', {
      user_id: id,
      name: first + ' ' + last,
    });
  }

  myItemSeparator = () => {
    return <View style={{
      height: 1, backgroundColor: 'grey',
      marginHorizontal: 10, marginTop: 5,
    }} />;
  };

  goBack() {
    this.props.navigation.goBack(null);
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
        <SafeAreaView style={{padding: 10}}>
          <ScrollView>
            <SearchBar
              placeholder="Find friends..."
              onChangeText={this.updateSearch}
              value={this.state.search}
              platform="android"
              autoFocus={true}
              onCancel={() => this.goBack()}
            />
            <FlatList
              data={this.state.results}
              renderItem={({item}) =>
                <Card containerStyle={{padding: 5}}>
                  <Text style={styles.wallPost}>
                    {item.user_givenname} {item.user_familyname}</Text>
                  {this.isFriend(item.user_id) ?
                    <Button
                      title="View Profile"
                      onPress={() => this.goToProfile(
                          item.user_id, item.user_givenname,
                          item.user_familyname)}
                      color="#5643fd"
                    /> :
                    <Button
                      title="Send Friend Request"
                      onPress={() => this.sendFriendReq(item.user_id)}
                      color="#ba1e68"
                    />}
                </Card>}
              keyExtractor={(item) => item.user_id}
            />
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}

export default FindFriendsScreen;
