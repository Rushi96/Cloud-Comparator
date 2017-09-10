import React, { Component } from 'react';
import {AppRegistry, ActivityIndicator, ListView, Text, View } from 'react-native';
var jsonQuery = require('json-query');

var jsonData = require('./jsn.json');
//var res=jsonQuery('grouped_people[**][*country=NZ]', {data: data}).value;

export default class AwesomeProject extends Component {
  constructor(props) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    super(props);
    this.state = {
      isLoading: true,
      dataSource: ds.cloneWithRows(res)
    }
  }

  render() {
    return (
    <View style={{flex: 1, paddingTop: 20}}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <Text>{rowData.sku},{rowData.productFamily}</Text>}
        />
      </View>
    /*  <View>
    { jsonData.products.map((item) => (
      //<View style={{flex: 1, paddingTop: 20}}>
          <Text>{item.sku}, {item.productFamily}</Text>
      //</View>
    ))}
  < / View>*/
  );
  }
}

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
