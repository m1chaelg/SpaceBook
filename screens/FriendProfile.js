import React, { Component, useState, useEffect } from 'react';
import { Text, TextInput, View, Button, ActivityIndicator, Image, FlatList, SafeAreaView, ScrollView, TouchableHighlight, Pressable, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Moment from 'moment';
import { Card } from 'react-native-elements';
import { MaterialCommunityIcons } from "@expo/vector-icons";

class FriendProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            id: 0,
            friendId: 0,
            firstName: "",
            lastName: "",
            email: "",
            friendCount: "",
            photo: null,
            loading: true,
            posts: [],
            likes: [],
        }
    }

    async componentDidMount() {
        this.setState({
            token: await AsyncStorage.getItem('token'),
            id: await AsyncStorage.getItem('id'),
            friendId: this.props.route.params.user_id,
            loading: true
        });
        this.getProfile()
        this.getProfilePic()
        this.getPosts()
        this.setState({ loading: false })

        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.getProfile()
            this.getProfilePic()
            this.getPosts()
          });
    }

    getProfile = async () => {
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.friendId, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'X-authorization': this.state.token
            }
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
            })
    }

    getProfilePic = () => {
        fetch("http://localhost:3333/api/1.0.0/user/" + this.state.friendId + "/photo", {
            method: 'GET',
            headers: {
                'X-Authorization': this.state.token
            }
        })
            .then((res) => {
                return res.blob();
            })
            .then((resBlob) => {
                let data = URL.createObjectURL(resBlob);
                this.setState({ photo: data });
            })
            .catch((err) => {
                console.log("error", err)
            });
    }

    postCard = (item) => {
        let dateTime = Moment(item.timestamp).format('MMMM Do YYYY, h:mm:ss a')
        return (
            <Card containerStyle={{ padding: 5 }}>
                <Card.Title>{item.text}</Card.Title>
                <Card.Divider />
                <Text>{item.author.first_name} {item.author.last_name}</Text>
                <Text>{dateTime}</Text>
                <Card.Divider />
                <Pressable onPress={() => this.setLiked(item)}>
                    <MaterialCommunityIcons
                        name={this.state.likes[item.post_id] ? "heart" : "heart-outline"}
                        size={32}
                        color={this.state.likes[item.post_id] ? "red" : "black"}
                    />
                    <Text>{item.numLikes} Likes</Text>
                </Pressable>
            </Card>
        )
    }

    getPosts = async () => {
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.friendId + "/post", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'X-authorization': this.state.token
            }
        })
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    posts: response,
                });
            })
            .catch((error) => {
                console.log(error);
            })
    }

    myItemSeparator = () => {
        return <View style={{ height: 1, backgroundColor: "grey", marginHorizontal: 10, marginTop: 5 }} />;
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
                    <Image
                        source={{
                            uri: this.state.photo,
                        }}
                        style={{
                            width: (Dimensions.get('window').width) - 20,
                            height: (Dimensions.get('window').width) - 20
                        }}
                    />

                    <Text>{this.state.firstName} {this.state.lastName}</Text>
                    <Text>Email: {this.state.email}</Text>
                    <Text>Friends: {this.state.friendCount}</Text>
                    
                    <ScrollView>
                        <FlatList
                            data={this.state.posts}
                            ListHeaderComponent={() => (
                                <Text style={{ fontSize: 30, textAlign: "center", marginTop: 20, fontWeight: 'bold', textDecorationLine: 'underline' }}>
                                    Posts
                                </Text>
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