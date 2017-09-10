'use strict'
import React, { Component } from 'react';
import {AppRegistry,StyleSheet, Text, View } from 'react-native';
import NavigationExperimental from 'react-native-deprecated-custom-components';

var SearchPage = require('./SearchPage');

var styles = StyleSheet.create({
  text: {
    color: 'blue',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 50
  },
  container: {
    flex: 1
  }
});

class Greeting extends Component {
    render() {
        return (
          <Text>Hello {this.props.name}!</Text>
    );
    }
}
/*class HelloWorld extends Component {
  render() {
    return <Text style={styles.text}> Hello APURV you are great !</Text>;
  }
}*/

class AwesomeProject extends Component {
  renderScene(route, navigator){
     if(route.title == 'Search') {
        return <SearchPage navigator={navigator} {...route.passProps} />
     }
     if(route.title == 'Results') {
        return <route.component navigator={navigator} {...route.passProps} />
      }
      if(route.title == 'Property'){
        return <route.component navigator={navigator} {...route.passProps} />
      }
    }
    render() {
        return (
          <NavigationExperimental.Navigator
              style={styles.container}
             initialRoute={{title: 'Search', component: SearchPage}}
              renderScene={this.renderScene}
            
            configureScene={(route, routeStack) =>
            NavigationExperimental.Navigator.SceneConfigs.FloatFromBottom} />
    );
  }
}
AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);