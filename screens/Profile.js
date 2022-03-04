import React, { Component, useState, useEffect } from 'react';
import { Text, TextInput, View, Button, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [friendCount, setFriendCount] = useState('');
    const [email, setEmail] = useState('');
    var token;
    var id;

    useEffect(async () => {
        token = await AsyncStorage.getItem('token')
        id = await AsyncStorage.getItem('id')
        if (loading) {
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

    const handleLogout = () => {
        logout();
        navigation.popToTop();
    }

    const logout = () => {
        return fetch("http://localhost:3333/api/1.0.0/logout", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-authorization': token
            }
        })
            .then(async () => {
                await AsyncStorage.setItem('token', "")
                await AsyncStorage.setItem('id', "")
                token = ""
                id = ""
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
                <Image
                    source={{
                        uri: 'http://localhost:3333/api/1.0.0/user/'+id+'/photo',
                        method: 'GET',
                        headers: {
                            'X-authorization': token
                        }
                    }}
                    style={{ width: 400, height: 400 }}
                />
                <Text>{firstName} {lastName}</Text>
                <Text>Email: {email}</Text>
                <Text>Friends: {friendCount}</Text>
                <Button
                    title="Logout"
                    onPress={() => handleLogout()}
                />
            </View>
        );
    }
}

export default ProfileScreen;