import React, { Component, useState, useEffect } from 'react';
import { Text, TextInput, View, Button, ActivityIndicator, Image, FlatList, SafeAreaView } from 'react-native';
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
        }
    }

    async componentDidMount() {
        this.setState({
            loading: true,
            token: await AsyncStorage.getItem('token'),
            id: await AsyncStorage.getItem('id'),
        });

        this.getFriends()

        this.setState({ loading: false })

        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.getFriends()
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

    myItemSeparator = () => {
        return <View style={{ height: 1, backgroundColor: "grey", marginHorizontal:10, marginTop: 5,}} />;
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
                                    onPress={() => alert("Clicked" + item.user_id)}
                                />
                            </View>}
                        keyExtractor={(item) => item.user_id}
                    />
                </SafeAreaView>
            );
        }
    }
}

export default FriendScreen;