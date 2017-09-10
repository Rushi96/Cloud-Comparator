'use strict';
import React, { Component } from 'react';
import  { View, Text, TextInput , AppRegistry, StyleSheet,TouchableOpacity,Button,Alert,ScrollView } from 'react-native';
import ModalPicker from 'react-native-modal-picker';
var Estimate = require('./Estimate');
var firebase;
class Storage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      textInputValue: 'US-East(N.Virginia)',
      input : {
        location: 'US-East(N.Virginia)',
        storage:0,
        transferOUT: 0,
        dataReterival: 0,
        GETrequests :0,
        PUTrequests :0,
      },
    };
    firebase = this.props.navigation.state.params;
  }
    static navigationOptions = {
        title: 'Storage',
    };

    // _onPressButton(event){
    // //  console.log(this.state.storage);
    //   var arr=[this.state.location,this.state.storage, this.state.transferOUT,this.state.GETrequests,this.state.PUTrequests,this.state.dataReterival];
    //   Alert.alert("storage",arr.toString());
    // //  this._viewdb.bind(this);
    // }
    _onLocationChanged(event) {
      var tmp=this.state.input;
      tmp.location=event.nativeEvent.text;
	     this.setState({input : tmp });
	  }
    _onStorageChanged(event) {
      var tmp=this.state.input;
      tmp.storage=event.nativeEvent.text;
	    this.setState({input : tmp });
	  }
    _onTransferOutChanged(event) {
      var tmp=this.state.input;
      tmp.transferOUT=event.nativeEvent.text;
	    this.setState({input : tmp });
	  }
    _onGETChanged(event) {
      var tmp=this.state.input;
      tmp.GETrequests=event.nativeEvent.text;
	    this.setState({input : tmp });
	  }
    _onPUTChanged(event) {
      var tmp=this.state.input;
      tmp.PUTrequests=event.nativeEvent.text
	    this.setState({input : tmp });
	  }
    _onDataRetrivalChanged(event) {
      var tmp=this.state.input;
      tmp.dataReterival=event.nativeEvent.text
	    this.setState({input : tmp });
	  }
    handleEmail = (text) =>{
        this.setState({ email:text });
    }
    handlePassword = (text) =>{
      this.setState({password:text});
    }
    handleStorage = (text) =>{
      this.setState({storage:text});
    }


    render(){
      let index = 0;
       const data = [
                    {key: index++ , label:'US-East(N.Virginia)'},
                    {key: index++ , label:'US-East(Lowa)'},
                    {key: index++ , label:'US-West(Oregon)'},
                    {key: index++ , label:'US-West(South_Carolina)'},
                    {key: index++ , label:'Canada'},
                    {key: index++ , label:'India(Mumbai)'},
                    {key: index++ , label:'Germany(Frankfurt)'},
                    {key: index++ , label:'Korea(Seoul)'},
                    {key: index++ , label:'Japan(Tokyo)'},
                    {key: index++ , label:'East-Asia(Taiwan)'},
                    {key: index++ , label:'Australia(Sydney)'},
                    {key: index++ , label:'UK(London)'},
                    {key: index++ , label:'UK(Ireland)'},
                    {key: index++ , label:'West-Europe(Belgium)'},
                    {key: index++ , label:'Southeast-Asia(Singapore)'},
                    {key: index++ , label:'Brazil'}
       ];
      const { navigate } = this.props.navigation;
    //  this._viewdb.bind(this);
      return(
        <ScrollView>
        <View style = {styles.container}>


        <Text style = {styles.text}>Location</Text>
        <View style={{flex:1, justifyContent:'space-around', padding:10}}>
          <ModalPicker
                      data={data}
                      initValue="US-East(N.Virginia)"
                      onChange={(option)=>{
                        this.setState({textInputValue:option.label});
                        var tmp=this.state.input;
                        tmp.location=option.label;
                        this.setState({input : tmp });
                    }}>

                      <TextInput
                          style={{margin:15,
                          borderWidth:1,textAlign:'center',color:'black',fontWeight:'bold', borderColor:'#ccc', padding:10, height:35}}
                          editable={false}
                          value={this.state.textInputValue} />

          </ModalPicker>
        </View>
        <Text style = {styles.text}>Storage</Text>
            <TextInput  style = {styles.input}
            underlineColorAndroid = "transparent"
            placeholder='Enter storage in GB'
            placeholderTextColor = "#AFAAB3"
            onChange={this._onStorageChanged.bind(this)}/>

        <Text style = {styles.text}> GET request</Text>
            <TextInput style = {styles.input}
            underlineColorAndroid = "transparent"
            placeholder='Number of GET requests'
            placeholderTextColor = "#AFAAB3"
            onChange={this._onGETChanged.bind(this)}/>
        <Text style = {styles.text}>PUT request</Text>
            <TextInput  style = {styles.input}
            underlineColorAndroid = "transparent"
            placeholder='Number of PUT requests'
            placeholderTextColor = "#AFAAB3"
            onChange={this._onPUTChanged.bind(this)}/>
        <Text style = {styles.text}>Data Retrieval</Text>
            <TextInput  style = {styles.input}
            underlineColorAndroid = "transparent"
            placeholder='storage in GB'
            placeholderTextColor = "#AFAAB3"
            onChange={this._onDataRetrivalChanged.bind(this)}/>

        <View style={styles.container}>
            <Button onPress = {() => navigate('Estimate',{fb: firebase, ip :this.state.input})} title = "Estimate"/>
          </View>
        </View>
        </ScrollView>
      )
    }
}
//export default examples;

const styles =  StyleSheet.create({
    container:{
      flex: 1,
      justifyContent: 'center',
      //alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    input:{
      margin:15,
      height:35,
      borderColor:'grey',
      borderWidth: 2
    },
    text:{
      color: 'black',
      fontSize:20,
      fontWeight:'bold',
      marginLeft:20
    },
    button:{
      marginLeft: 200,
      marginRight: 15,
      padding:10,
      // backgroundColor:'blue',
      borderWidth:1,
      // borderColor:'blue',
      color:'white',
      fontWeight:'bold',
      fontSize:20,
      textAlign:'center'
    }
});

module.exports = Storage;
