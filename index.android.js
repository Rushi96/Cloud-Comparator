'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
    TextInput,
    Button,
    MapView,
    ListView,
    ActivityIndicator
} from 'react-native';
import * as firebase from 'firebase';
//var firebase  = require('firebase');
var Storage = require('./Storage');
var Estimate = require('./Estimate');
import { StackNavigator, } from 'react-navigation';

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDa7tlTZ39Ob8EKrtJVDQ6W4iLz9cHE6io",
    authDomain: "cloud-service-f7efc.firebaseapp.com",
    databaseURL: "https://cloud-service-f7efc.firebaseio.com",
    projectId: "cloud-service-f7efc",
    storageBucket: "cloud-service-f7efc.appspot.com",
    messagingSenderId: "889387478219"
  };

  firebase.initializeApp(config);

class HomeScreen extends React.Component {
      static navigationOptions = {
    title: 'Cloud Compare',
  };
    render() {
      const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
          <View style={styles.container}>
            <Text style={styles.welcome}>
              Welcome to Cloud Compare!
            </Text>
            <Text style={styles.instructions}>
              Use Storage Button to Estimate Your cloud Storage cost.
            </Text>
          </View>
            <View style={styles.container}>
                <Button onPress = {() => navigate('Storage',{...firebase})} title = "Storage"/>
            </View>
      </View>
    );
  }
}
class SecScreen extends React.Component {
    constructor(props){
     super(props);
        this.database = firebase.database().ref();
         this.state = {
             isLoading :true,
             dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
           };
      //console.log("Hey... Apurv");
   }
    writedb(){
        this.state.isLoading =false;
        firebase.database().ref().child("Google").child("storage_pricing").on("value", function(snapshot) {
          var instance=snapshot.val();
          var i;
          for(i in instance) {
              console.log(i);
            var j;
            for(j in instance[i]){
              console.log(j );
              console.log(instance[i][j]);
            }
          }
          //console.log(snapshot.val());
          }, function (errorObject) {
          console.log("The read failed:" + errorObject.code);
          });
          this.state.isLoading =false;
    }
    static navigationOptions = {
        title: 'SecondScreen',
    };

    render() {
      this.writedb();
      var spinner = this.state.isLoading?
  	  ( <ActivityIndicator
  	      size='large'/> ) :
  	  ( <View/>);
      return (
          <View style={styles.container}>
            <Text>Hello Apurv {typeof firebase.database().ref().child(0).Region}</Text>
              {spinner}
          </View>
      );
    }
  }

const AwesomeProject = StackNavigator({
    Home: { screen: HomeScreen },
    SecScreen: { screen: SecScreen },
    Storage: {screen: Storage},
    Estimate: {screen: Estimate},
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    marginLeft: 25,
    marginRight: 25,
  },
  listview: {
    flex: 1,
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
