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
            newPost: "",
            status: "",
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

    editPost(item) {
        this.props.navigation.navigate('Post', {
            post_id: item.post_id,
            wall_id: this.state.friendId,
            post: item
        });
    }

    likeOrUnlikePost = async (item, method) => {
        console.log(item)
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.friendId + "/post/" + item.post_id + "/like", {
            method: method,
            headers: {
                'X-authorization': this.state.token
            }
        })
            .then(() => {
                this.getPosts();
            })
            .catch((error) => {
                console.log(error);
            })
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
                <Button
                    title="Like"
                    style={{
                        width: '300',
                        alignItems: 'right'
                    }}
                    onPress={() => this.likeOrUnlikePost(item, "POST")}
                />
                <Button
                    title="Unlike"
                    style={{
                        width: '300',
                        alignItems: 'right'
                    }}
                    onPress={() => this.likeOrUnlikePost(item, "DELETE")}
                />
                <Text>{item.numLikes} Likes</Text>
                {this.state.id == item.author.user_id ?
                    <Button
                        title="Edit post"
                        style={{
                            width: '300',
                            alignItems: 'right'
                        }}
                        onPress={() => this.editPost(item)}
                    />
                    :
                    <Text></Text>}
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

    newPost = async () => {
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.friendId + "/post", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-authorization': this.state.token
            },
            body: JSON.stringify({ text: this.state.newPost })
        })
            .then((response) => {
                if (response.status == 200) {
                    this.setState({ status: "Posted." })
                }
            })
            .catch((error) => {
                this.setState({ status: error })
                console.log(error);
            })
            .finally(() => {
                this.setState({ newPost: "" })
                this.getPosts()
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

                    <Card containerStyle={{ padding: 5 }}>
                        <Card.Title>Post something:</Card.Title>
                        <Card.Divider />
                        <TextInput
                            style={{ flex: 1, width: "100%", backgroundColor: "white" }}
                            onChangeText={(newPost) => this.setState({ newPost })}
                            multiline
                            numberOfLines={4}
                            value={this.state.newPost}
                            placeholder="Enter message here..."
                        />
                        <Card.Divider />
                        <Button
                            title="Submit"
                            style={{
                                width: '300',
                                alignItems: 'right'
                            }}
                            onPress={() => this.newPost()}
                        />
                        <Text>{this.state.status}</Text>
                    </Card>

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