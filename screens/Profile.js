import React, { Component, useState, useEffect } from 'react';
import { Text, TextInput, View, Button, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';

const ProfileScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [friendCount, setFriendCount] = useState('');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [id, setId] = useState(null);
    const [photo, setPhoto] = useState();

    useEffect(async () => {
        setToken(await AsyncStorage.getItem('token'))
        setId(await AsyncStorage.getItem('id'))

        if(loading) {
            getProfile()
            getProfilePic()
            setLoading(false)
        }

    })

    const getProfile = async () => {
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

    const getProfilePic = () => {
        fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
            method: 'GET',
            headers: {
                'X-Authorization': token
            }
        })
            .then((res) => {
                return res.blob();
            })
            .then((resBlob) => {
                let data = URL.createObjectURL(resBlob);
                setPhoto(data)
            })
            .catch((err) => {
                console.log("error", err)
            });
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

    const takePhoto = async () => {
        navigation.navigate('Camera')
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
            <View style={{ padding: 5 }}>
                <Image
                    source={{
                        uri: photo,
                    }}
                    style={{
                        width: (Dimensions.get('window').width) - 10,
                        height: (Dimensions.get('window').width) - 10
                    }}
                />
                <Button
                    title="Take a picture"
                    onPress={() => takePhoto()}
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