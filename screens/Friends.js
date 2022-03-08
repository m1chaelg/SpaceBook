import React, { Component, useState, useEffect } from 'react';
import { Text, TextInput, View, Button, ActivityIndicator, Image } from 'react-native';
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
                console.log(response)
                this.setState({
                    friends: response,
                });
            })
            .catch((error) => {
                console.log(error);
            })
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
                <View style={{ padding: 5 }}>
                    <Text>Test</Text>
                </View>
            );
        }
    }
}

export default FriendScreen;