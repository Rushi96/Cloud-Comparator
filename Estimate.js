'use strict';

import React, {Component} from 'react';
import {
  View,
  ListView,
  Text,
  TouchableHighlight,
  AppRegistry,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';
var productG = {};
var productAz = {};
var productAWS = {};

var firebase;
var DBref;
var storageIP;
var LocationMap ={
  "US-East(N.Virginia)": {
     "Azure": "Central_US",
     "AWS": "N_Virginia",
     "Google": "N_virginia"
  },
  "US-East(Lowa)": {
     "Azure": "Central_US",
     "AWS": "Ohio",
     "Google": "Lowa"
  },
  "US-West(Oregon)": {
     "Azure": "Central_US",
     "AWS": "Oregon",
     "Google": "Oregon"
  },
  "US-West(South_Carolina)": {
     "Azure": "Central_US",
     "AWS": "Northern_California",
     "Google": "South_Carolina"
  },
  "Canada": {
     "Azure": "Central_Canada",
     "AWS": "Central",
     "Google": "NA",
  },
  "India(Mumbai)": {
     "Azure": "Central_India",
     "AWS": "Mumbai",
     "Google": "NA",
  },
  "Germany(Frankfurt)": {
     "Azure": "Central_Germany",
     "AWS": "Frankfurt",
     "Google": "NA",
  },
  "Korea(Seoul)": {
     "Azure": "Central_Korea",
     "AWS": "Seoul",
     "Google": "NA",
  },
  "Japan(Tokyo)": {
     "Azure": "East-Japan",
     "AWS": "Tokyo",
     "Google": "Tokyo"
  },
  "East-Asia(Taiwan)": {
     "Azure": "East_Asia",
     "AWS": "Taiwan",
     "Google": "Taiwan"
  },
  "Australia(Sydney)": {
     "Azure": "East_Australia",
     "AWS": "Sydney",
     "Google": "Sydney"
  },
  "UK(London)": {
     "Azure": "UK_South",
     "AWS": "London",
     "Google": "London"
  },
  "UK(Ireland)": {
     "Azure": "UK_South",
     "AWS": "Ireland",
     "Google": "NA",
  },
  "West-Europe(Belgium)": {
     "Azure": "West_Europe",
     "AWS": "NA",
     "Google": "Belgium"
  },
  "Southeast-Asia(Singapore)": {
     "Azure": "East_Asia",
     "AWS": "Singapore",
     "Google": "Singapore"
  },
  "Brazil": {
     "Azure": "Brazil",
     "AWS": "NA",
     "Google": "NA",
  }
};
class Estimate extends React.Component {

  constructor(props) {
    super(props);

    var dataSourceG = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    var dataSourceAz = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    var dataSourceAWS = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.state = {
      dataSourceG: dataSourceG.cloneWithRowsAndSections(productG),
      dataSourceAz: dataSourceG.cloneWithRowsAndSections(productAz),
      dataSourceAWS: dataSourceG.cloneWithRowsAndSections(productAWS),
      isLoadingG:false,
      isLoadingAz:false,
      isLoadingAWS:false
    }
    firebase = this.props.navigation.state.params.fb;
    storageIP =this.props.navigation.state.params.ip;
    DBref=firebase.database().ref();

  }
  static navigationOptions = {
      title: 'Estimate',
  };

  _printprod(){
    //Alert.alert(productG[0])
  }

  componentDidMount() {
    //var i= this.state.location;
    this.setState({isLoadingG : true});
    this.setState({isLoadingAWS : true});
    this.setState({isLoadingAz : true});
    var loc =LocationMap[storageIP.location];
    // var x;
    // for(x in loc){
    //   console.log(loc[x]);
    // }
console.log(":::::::::::::---------------------------:::::::::::::::::");
    console.log(loc.Azure);
    console.log(loc.AWS);
    console.log(loc.Goole);
    if(!(loc.AWS.match("NA")) )
      DBref.child("Amazon").child("storage").child("storage_pricing").child(loc.AWS).once("value", (snapshot) =>{
        var strg=snapshot.val();
           // console.log(strg);
          DBref.child("Amazon").child("storage").child("operation_pricing").child(loc.AWS).once("value",(snap)=>{
            var op=snap.val();
            var price={ "Standard Storage": 0,
                        "Standard Infrequent Access Storage": 0,
                      };
            //    console.log(op);
            var i,index=0;
            for(i in strg){
              if(strg[i].Start_Range <=storageIP.storage && strg[i].End_Range >storageIP.storage){
                  price["Standard Storage"]=storageIP.storage*strg[i].Standard_Storage;
                  price["Standard Infrequent Access Storage"]=storageIP.storage*strg[i].Standard_Infrequent_Access_Storage;
                  break;
              }
            }
            for(i in op){
                if(op[i].Service.match("Standard")){
                  if(op[i].Operation.match("PUT, COPY, POST, or LIST Requests")){
                        price["Standard Storage"]+=Math.ceil(storageIP.PUTrequests/op[i].per_unit)*op[i].Pricing;
                      }
                  if(op[i].Operation.match("GET and all other Requests")){
                        price["Standard Storage"]+=Math.ceil(storageIP.GETrequests/op[i].per_unit)*op[i].Pricing;
                      }
                  if(op[i].Operation.match("Data Retrievals")){
                        price["Standard Storage"]+=storageIP.dataReterival*op[i].Pricing;
                      }
                }
                else if(op[i].Service.match("infrequent")){
                  if(op[i].Operation.match("PUT, COPY, or POST Requests")){
                        price["Standard Infrequent Access Storage"]+=Math.ceil(storageIP.PUTrequests/op[i].per_unit)*op[i].Pricing;
                      }
                  if(op[i].Operation.match("GET and all other Requests")){
                        price["Standard Infrequent Access Storage"]+=Math.ceil(storageIP.GETrequests/op[i].per_unit)*op[i].Pricing;
                      }
                  if(op[i].Operation.match("Data Retrievals")){
                        price["Standard Infrequent Access Storage"]+=storageIP.dataReterival*op[i].Pricing;
                      }
                }
            }
            for(i in price){
              price[i]=price[i].toFixed(3)
            }
            productAWS={};
            productAWS[storageIP.location]=price;
          //  console.log(price);

            this.setState({
              dataSourceAWS : this.state.dataSourceG.cloneWithRowsAndSections(productAWS),
              isLoadingAWS: false,
            });
      });
    });
  else{
    productAWS={};
    this.setState({
    dataSourceAWS : this.state.dataSourceG.cloneWithRowsAndSections(productAWS),
    isLoadingAWS: false,
  });
  };
  if(!(loc.Azure.match("NA")))
    DBref.child("Azure").child("storage").child("storage_pricing").child(loc.Azure).once("value", (snapshot) =>{
      var strg=snapshot.val();
        //  console.log(strg);
        DBref.child("Azure").child("storage").child("operation_pricing").child(loc.Azure).once("value",(snap)=>{
          var op=snap.val();
           var price={ "GRS-COOL": 0,
                       "GRS-HOT": 0,
                       "LRS-COOL": 0,
                       "LRS-HOT" : 0,
                     };
          //    console.log(op);
           var i;
           for(i in strg){
             if(strg[i]["Start_Range (GB)"] <=storageIP.storage && strg[i]["End_Range (GB)"] >=storageIP.storage){
                 price["GRS-COOL"]=storageIP.storage*strg[i]["GRS-COOL"];
                 price["GRS-HOT"]=storageIP.storage*strg[i]["GRS-HOT"];
                 price["LRS-COOL"]=storageIP.storage*strg[i]["LRS-COOL"];
                 price["LRS-HOT"]=storageIP.storage*strg[i]["LRS-HOT"];
                 break;
             }
           }
           for(i in op){
                if(op[i].Operation.match("Put / Create")){
                  price["GRS-COOL"]+=Math.ceil(storageIP.PUTrequests/op[i].Per_Operation)*op[i]["GRS-COOL"];
                  price["GRS-HOT"]+=Math.ceil(storageIP.PUTrequests/op[i].Per_Operation)*op[i]["GRS-HOT"];
                  price["LRS-COOL"]+=Math.ceil(storageIP.PUTrequests/op[i].Per_Operation)*op[i]["LRS-COOL"];
                  price["LRS-HOT"]+=Math.ceil(storageIP.PUTrequests/op[i].Per_Operation)*op[i]["LRS-HOT"];
                  }
                if(op[i].Operation.match("All other")){
                  price["GRS-COOL"]+=Math.ceil(storageIP.GETrequests/op[i].Per_Operation)*op[i]["GRS-COOL"];
                  price["GRS-HOT"]+=Math.ceil(storageIP.GETrequests/op[i].Per_Operation)*op[i]["GRS-HOT"];
                  price["LRS-COOL"]+=Math.ceil(storageIP.GETrequests/op[i].Per_Operation)*op[i]["LRS-COOL"];
                  price["LRS-HOT"]+=Math.ceil(storageIP.GETrequests/op[i].Per_Operation)*op[i]["LRS-HOT"];
                    }
                if(op[i].Operation.match("Data Retrieval")){
                  price["GRS-COOL"]+=Math.ceil(storageIP.dataReterival)*op[i]["GRS-COOL"];
                  price["GRS-HOT"]+=Math.ceil(storageIP.dataReterival)*op[i]["GRS-HOT"];
                  price["LRS-COOL"]+=Math.ceil(storageIP.dataReterival)*op[i]["LRS-COOL"];
                  price["LRS-HOT"]+=Math.ceil(storageIP.dataReterival)*op[i]["LRS-HOT"];
                    }
          }
          for(i in price){
            price[i]=price[i].toFixed(3);
          }
          productAz={};
          productAz[storageIP.location]=price;
          //console.log(price);

          this.setState({
            dataSourceAz : this.state.dataSourceG.cloneWithRowsAndSections(productAz),
            isLoadingAz: false,
          });
    });
  });
  else{
    productAz={};
    this.setState({
      dataSourceAz : this.state.dataSourceG.cloneWithRowsAndSections(productAz),
      isLoadingAz: false,
    });
  };
  if(!(loc.Google.match("NA")))
    DBref.child("Google").child("Storage").child("storage_pricing").child(loc.Google).once("value", (snapshot) =>{
      var strg=snapshot.val();
          //console.log(strg);
        DBref.child("Google").child("Storage").child("operation_pricing").once("value",(snap)=>{
              var op=snap.val();
          //    console.log(op);
              var price=[];
              var i,index=0;

              for(i in op){price.push(op[i]*(1*storageIP.GETrequests+1*storageIP.PUTrequests)/(10000))}
          //    console.log(price);
              index=0;
              for(i in strg){
                strg[i]=(strg[i]*(storageIP.storage) +price[index]);
                index++;
              }
              strg.Coldline_storage += (0.05)*(1*storageIP.dataReterival);
              strg.Nearline_storage += (0.01)*(1*storageIP.dataReterival);
              for(i in strg){
                strg[i]=strg[i].toFixed(3);
              }
              productG={};
              productG[storageIP.location]=strg;
          //    console.log(productG);

              this.setState({
                dataSourceG : this.state.dataSourceG.cloneWithRowsAndSections(productG),
                isLoadingG: false,
              });
              //console.log(storageIP);
        });
      }, function (errorObject) {
      console.log("The read failed:" + errorObject.code);
    });
  else{
    productG={};
    this.setState({
      dataSourceG : this.state.dataSourceG.cloneWithRowsAndSections(productG),
      isLoadingG: false,
    });
  };
}

  renderRow(rowData, sectionID, rowID) {
    //console.log(rowData);
     return (
         <ScrollView>
          <TouchableHighlight backgroundColor='red' style={{height:50}}>
            <View>
              <View style={styles.rowContainer}>
              <Text style = {styles.text2} numberOfLines={0}>{rowID}</Text>
              <Text style = {styles.textPrice} numberOfLines={0}>{rowData}$</Text>
              </View>
              <View style={styles.separator}/>
            </View>
          </TouchableHighlight>
        </ScrollView>
      );
  }
  renderSectionHeader(sectionData,sectionID) {
    return (
      <Text style={styles.textHeader}> {sectionID}</Text>
    );
  }

  render() {
    // this._printprod();
    var GoogleView = this.state.isLoadingG? ( <ActivityIndicator size='large'/> )
        :<ListView
           dataSource={this.state.dataSourceG}
           renderRow={this.renderRow.bind(this)}
           renderSectionHeader={this.renderSectionHeader.bind(this)}
           enableEmptySections={true}/>;
    var AWSView = this.state.isLoadingAWS? ( <ActivityIndicator size='large'/> )
       :<ListView
          dataSource={this.state.dataSourceAWS}
          renderRow={this.renderRow.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          enableEmptySections={true}/>;
    var AzureView = this.state.isLoadingAz? ( <ActivityIndicator size='large'/> )
      :<ListView
         dataSource={this.state.dataSourceAz}
         renderRow={this.renderRow.bind(this)}
         renderSectionHeader={this.renderSectionHeader.bind(this)}
         enableEmptySections={true}/>;

  return(
    <ScrollView>
    <View style = {styles.container}>
      <Text style = {{marginTop:0,fontWeight:'bold',textAlign : 'center',color: '#008080',fontSize:25}}>Monthly Price for</Text>
      <Text style = {styles.text3}>Storage = {storageIP.storage}GB</Text>
      <Text style = {styles.text3}>Number of GET Requests = {storageIP.GETrequests}</Text>
      <Text style = {styles.text3}>Number of PUT Requests = {storageIP.PUTrequests}</Text>
      <Text style = {styles.text3}>Data Reterival = {storageIP.dataReterival}GB</Text>
    </View>
    <View style = {styles.container}>
      <View style = {styles.container}>
        <Text style = {styles.text}>AWS</Text>
          {AWSView}
      </View>
      <View style = {styles.container}>
        <Text style = {styles.text}>AZURE</Text>
          {AzureView}
      </View>
      <View style = {styles.container}>
        <Text style = {styles.text}>GOOGLE CLOUD</Text>
          {GoogleView}
      </View>
    </View>
    </ScrollView>
  );
  }
}


const styles =  StyleSheet.create({
    container:{
      flex: 1,
      justifyContent: 'center',
      //alignItems: 'center',
      backgroundColor:'#f0ffff',
    },
    text:{
      color: 'black',
      fontSize:20,
      fontWeight:'bold',
      marginLeft:20
    },
    textHeader:{
      // paddingTop:10,
      marginTop:0,
      color: '#cfbc8f',
      fontSize:15,
      fontWeight:'bold',
      marginLeft:40
    },
    text2:{
      // paddingTop:10,
      flex : 3 ,
      marginTop:0,
      color: '#8fbc8f',
      fontSize:15,
      marginLeft:20
    },
    text3:{
      // paddingTop:10,
      flex : 3 ,
      marginTop:0,
      fontWeight:'bold',
      textAlign : 'center',
      color: '#00b3b3',
      fontSize:15,
    },
    textPrice:{
      // paddingTop:10,
      flex : 1 ,
      marginTop:0,
      color: '#8fbc8f',
      fontSize:15,
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
    },
    separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  }
})
//export default Estimate;
//AppRegistry.registerComponent('Estimate', () => Estimate);
module.exports = Estimate;
