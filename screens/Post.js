import React, { Component, useState, useEffect } from 'react';
import { Text, TextInput, View, Button, ActivityIndicator, Image, FlatList, SafeAreaView, ScrollView, TouchableHighlight, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchBar, Card } from 'react-native-elements';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Moment from 'moment';

class PostScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            id: 0,
            loading: true,
            post: null,
            postId: 0,
            editText: "",
            status: "Click submit when you've finished editing.",
        }
    }

    async componentDidMount() {
        this.setState({
            loading: true,
            token: await AsyncStorage.getItem('token'),
            id: await AsyncStorage.getItem('id'),
            postId: this.props.route.params.post_id,
            post: this.props.route.params.post,
            editText: this.props.route.params.post.text,
            status: "",
        });

        this.fetchPost()

        this.setState({ loading: false })

        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.fetchPost()
        });
    }

    fetchPost = async () => {
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.id + "/post/" + this.state.postId, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'X-authorization': this.state.token
            }
        })
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    post: response,
                });
            })
            .catch((error) => {
                console.log(error);
            })
    }

    updatePost = async () => {
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.id + "/post/" + this.state.postId, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'X-authorization': this.state.token
            },
            body: JSON.stringify({ text: this.state.editText })
        })
            .then((response) => {
                if (response.status == 200) {
                    console.log(response)
                    this.setState({status: "Updated."})
                }
            })
            .catch((error) => {
                this.setState({status: error})
                console.log(error);
            })
    }

    deletePost = async () => {
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.id + "/post/" + this.state.postId, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'X-authorization': this.state.token
            }
        })
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    status: response,
                });
                this.props.navigation.goBack(null)
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
            let dateTime = Moment(this.state.post.timestamp).format('MMMM Do YYYY, h:mm:ss a')
            return (
                <ScrollView style={{ flexGrow: 1 }}>
                    <SafeAreaView style={{ padding: 10 }}>
                        <Card containerStyle={{ padding: 5 }}>
                            <Card.Title>
                                <TextInput
                                style={{ flex: 1, width: "100%" }}
                                onChangeText={(editText) => this.setState({ editText })}
                                value={this.state.editText}
                                autoFocus={true}
                            /></Card.Title>
                            <Card.Divider />
                            <Text>{this.state.post.author.first_name} {this.state.post.author.last_name}</Text>
                            <Text>{dateTime}</Text>
                            <Card.Divider />
                            <Button
                                title="Submit"
                                style={{
                                    width: '300'
                                }}
                                onPress={() => this.updatePost()} />
                            {this.state.post.numLikes == 0 ?
                                <Button
                                    title="Delete"
                                    style={{
                                        width: '300'
                                    }}
                                    onPress={() => this.deletePost()} />
                                :
                                <Text></Text>}
                        </Card>
                        <Text>{this.state.status}</Text>
                    </SafeAreaView>
                </ScrollView>
            );
        }
    }
}

export default PostScreen;