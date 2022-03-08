import React, { Component, useState, useEffect } from 'react';
import { Text, TextInput, View, Button, ActivityIndicator, Image, FlatList, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';

class FriendScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            id: 0,
            loading: true,
            friends: [],
            friendrequests: [],
        }
    }

    async componentDidMount() {
        this.setState({
            loading: true,
            token: await AsyncStorage.getItem('token'),
            id: await AsyncStorage.getItem('id'),
        });

        this.getFriends()
        this.getFriendRequests()

        this.setState({ loading: false })

        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.getFriends()
            this.getFriendRequests()
        });
    }

    getFriends = async () => {
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.id + "/friends", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'X-authorization': this.state.token
            }
        })
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    friends: response,
                });
            })
            .catch((error) => {
                console.log(error);
            })
    }

    getFriendRequests = async () => {
        return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'X-authorization': this.state.token
            }
        })
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    friendrequests: response,
                });
            })
            .catch((error) => {
                console.log(error);
            })
    }

    friendRequest = async (id, response) => {
        return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + id, {
            method: response,
            headers: {
                'X-authorization': this.state.token
            }
        })
            .then(() => {
                console.log("Friend request " + response)
                this.getFriendRequests()
            })
            .catch((error) => {
                console.log(error);
            })
    }

    myItemSeparator = () => {
        return <View style={{ height: 1, backgroundColor: "grey", marginHorizontal:10, marginTop: 5}} />;
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
                <SafeAreaView style={{ padding: 10 }}>
                    <ScrollView>
                    <FlatList
                            data={this.state.friendrequests}
                            ItemSeparatorComponent={this.myItemSeparator}
                            ListHeaderComponent={() => (
                                <Text style={{ fontSize: 30, textAlign: "center",marginTop:20,fontWeight:'bold',textDecorationLine: 'underline' }}>
                                Friend Requests
                                </Text>
                            )}
                            renderItem={({ item }) =>
                                <View>
                                    <Text style={{  marginTop: 5}}>{item.first_name} {item.last_name}</Text>
                                    <Button
                                        title="Accept"
                                        onPress={() => this.friendRequest(item.user_id, "POST")}
                                    />
                                    <Button
                                        title="Reject"
                                        onPress={() => this.friendRequest(item.user_id, "DELETE")}
                                    />
                                </View>}
                            keyExtractor={(item) => item.user_id}
                        />
                        <FlatList
                            data={this.state.friends}
                            ItemSeparatorComponent={this.myItemSeparator}
                            ListHeaderComponent={() => (
                                <Text style={{ fontSize: 30, textAlign: "center",marginTop:20,fontWeight:'bold',textDecorationLine: 'underline' }}>
                                Friends
                                </Text>
                            )}
                            renderItem={({ item }) =>
                                <View>
                                    <Text style={{  marginTop: 5, padding: 20 }}>{item.user_givenname} {item.user_familyname}</Text>
                                    <Button
                                        title="View"
                                        style={{
                                            width: '300',
                                            alignItems: 'right'
                                        }}
                                        onPress={() => alert("Clicked " + item.user_id)}
                                    />
                                </View>}
                            keyExtractor={(item) => item.user_id}
                        />
                    </ScrollView>
                </SafeAreaView>
            );
        }
    }
}

export default FriendScreen;