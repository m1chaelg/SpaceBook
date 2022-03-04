import React, { Component, useState, useEffect } from 'react';
import { Text, TextInput, View, Button, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FriendScreen = () => {
    const [loading, setLoading] = useState(true);

    useEffect(async () => {
        var token = await AsyncStorage.getItem('token')
        var id = await AsyncStorage.getItem('id')
        if(loading) {
            getProfile(token, id)
            setLoading(false)
        }
    })

    const getProfile = (token, id) => {
        return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'X-authorization': token
            }
        })
            .then((response) => response.json())
            .then((response) => {
                setEmail(response.email);
                setFirstName(response.first_name);
                setLastName(response.last_name);
                setFriendCount(response.friend_count);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    if (loading) {
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
            <View style={{ padding: 10 }}>
                <Text>{firstName} {lastName}</Text>
                <Text>Email: {email}</Text>
                <Text>Friends: {friendCount}</Text>
            </View>
        );
    }
}

export default ProfileScreen;