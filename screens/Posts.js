import React, { Component, useState, useEffect } from 'react';
import { Text, TextInput, View, Button, ActivityIndicator, Image, FlatList, SafeAreaView, ScrollView, TouchableHighlight, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchBar, Card } from 'react-native-elements';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Moment from 'moment';

class PostsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            id: 0,
            loading: true,
            posts: [],
            likes: [],
        }
    }

    async componentDidMount() {
        this.setState({
            loading: true,
            token: await AsyncStorage.getItem('token'),
            id: await AsyncStorage.getItem('id'),
        });

        this.getPosts()

        this.setState({ loading: false })

        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.getPosts()
        });
    }

    getPosts = async () => {
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.id + "/post", {
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

    setLiked = async (item) => {
        let newLikes = this.state.likes.slice() //copy the array
        if (newLikes[item.post_id] == null) {
            newLikes[item.post_id] = true
        } else {
            newLikes[item.post_id] = !newLikes[item.post_id]
        }
        this.setState({ likes: newLikes }) //set the new state
    }

    sendLike = async () => {
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.id + "/post", {
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

    editPost(item) {
        this.props.navigation.navigate('Post', {
            post_id: item.post_id,
            post: item
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
                    <ScrollView style={{flexGrow : 1}}>
                        <SafeAreaView style={{ padding: 10 }}>
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
                        </SafeAreaView>
                    </ScrollView>
            );
        }
    }
}

export default PostsScreen;