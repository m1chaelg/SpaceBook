import React, { Component } from 'react';
import { Text, View, Button, ActivityIndicator, SafeAreaView, ScrollView, FlatList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from 'react-native-elements';
import styles from '../style/Styles';

class DraftsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      id: 0,
      loading: true,
      drafts: [],
      status: "Save your edit before posting",
      tempEdit: "",
    };
  }

  async componentDidMount() {
    this.setState({
      loading: true,
      token: await AsyncStorage.getItem('token'),
      id: await AsyncStorage.getItem('id'),
      drafts: this.props.route.params.drafts,
    });

    this.setState({ loading: false });
  }

  postCard = (draft, index) => {
    return (
      <Card containerStyle={{ padding: 5 }}>
        <TextInput
          style={styles.textInput}
          value={this.state.drafts[index]}
          multiline
          numberOfLines={4}
          onChangeText={(value) => this.editDraft(value, index)}
        />
        <Card.Divider style={styles.cardDivider}/>
        <View style={styles.horizontalContainer}>
        <View style={styles.buttonContainer}>
        <Button
          title="Post draft"
          onPress={() => {this.newPost(this.state.drafts[index]); this.forceUpdate()}}
          color="#5643fd"
        />
        </View>
        <View style={styles.buttonContainer}>
        <Button
          title="Save Edit"
          onPress={() => {this.saveDrafts();}}
          color="#7649fe"
        />
        </View>
        <View style={styles.buttonContainer}>
        <Button
          title="Delete draft"
          onPress={() => this.deleteDraft(this.state.drafts[index]).then(() => this.saveDrafts())}
          color="#ba1e68"
        />
        </View>
        </View>
      </Card>
    );
  };

  editDraft(value, index) {
    var newArr = this.state.drafts
    newArr[index] = value
    this.setState({drafts: newArr})
  }

  newPost = async (draft) => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.id + '/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-authorization': this.state.token,
      },
      body: JSON.stringify({ text: draft }),
    })
      .then((response) => {
        if (response.status == 200) {
          this.setState({ status: 'Posted.' });
        }
      })
      .then(() => {
        let arr = this.state.drafts;
        arr = arr.filter(e => e !== draft);
        this.setState({ drafts: arr });
      })
      .then(() => {
        this.saveDrafts();
      })
      .catch((error) => {
        this.setState({ status: error });
      })
  };

  deleteDraft = async (draft) => {
    let arr = this.state.drafts;
    arr = arr.filter(e => e !== draft);
    this.setState({ drafts: arr });
  }

  async saveDrafts () {
    try {
      await AsyncStorage.setItem('drafts', JSON.stringify(this.state.drafts))
      .then(
        () => AsyncStorage.getItem('drafts')
              .then((result)=>console.log(result))
     )
    } catch(err) {
      this.setState({status: err})
    }
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
        <ScrollView style={{ flexGrow: 1 }}>
          <SafeAreaView style={{ padding: 10 }}>
            <Card>
            <Text>{this.state.status}</Text>
            </Card>
            <FlatList
              data={this.state.drafts}
              ListHeaderComponent={() => (
                <Text style={styles.cardTitle}>Drafts</Text>
              )}
              renderItem={({item, index}) => this.postCard(item.item, index)}
              keyExtractor={(item, index) => index}
            />
          </SafeAreaView>
        </ScrollView>
      );
    }
  }
}

export default DraftsScreen;
