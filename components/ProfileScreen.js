import { Buffer } from 'buffer';
import React, { Component } from 'react';
import Bluetooth from './Bluetooth';
import Info from './Info';
import Notifications from './Notifycations';
import { BleManager } from "react-native-ble-plx";
import {bluetooth_actions} from '../actions/bluetooth_actions';
import consts  from '../Const/services_characteristics';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeAppEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  ScrollView,
  AppState,
  FlatList,
  Dimensions,
  Button,
  Image,
  TouchableOpacity
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class ProfileScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
        
    }
    this.manager = new BleManager();
  }



  devices(){
    this.manager.startDeviceScan(null,null,(error,device)=>{
        if(error){
            return error.message;
        }
        if(device.name == "Mi Smart Band 4"){
            device.connect().then((device)=>{
                // this.device = device;
                console.log(device);
                this.props.connect(true,device);
                this.manager.stopDeviceScan();
            })
        }


    })
}
  
   

  render() {
    console.log(this.props.Bluetooth_data)
    return (
        <View>
          <View style = {{flexDirection:"row"}}>
            <View  style = {{flex:1}}>
              <Image source = {require('../sanya.jpg')} style = {{width:75,height:75,borderRadius:37.5}}>
              </Image>
            </View>
            <View style = {{flex:3}}>
              <View style ={{flexDirection:"row",justifyContent:'space-around'}}>
                <View style = {{alignItems:'center'}}>
                  <Text style={{fontWeight:"bold"}}>Пациент</Text>
                  <Text>{this.props.patients.name}</Text>
                  <Text>{this.props.patients.lname}</Text>
                </View>
                <View style = {{alignItems:'center'}}>
                  <Text style={{fontWeight:"bold"}}>Врач</Text>
                  <Text>{this.props.doctor.name}</Text>
                  <Text>{this.props.doctor.lname}</Text>
                </View>
                <TouchableOpacity style = {{alignItems:'center'}} onPress={() => this.devices()}>
                  <Text style={{fontWeight:"bold"}}>Устройство</Text>
                  <Image source={this.props.Bluetooth_data.isConnected? require('../green.png'):require('../red.png')} style = {{width:45,height:45,borderRadius:25.5}}></Image>
                </TouchableOpacity>

              </View>
              <View style = {{flexDirection:'row'}}>
              </View>
            </View>
          </View>
          <Notifications></Notifications>
          <Info></Info>    
        </View>
      
    )
  }





}



function mapTo(state){

  return{
      patients:state.patients,
      doctor:state.doctors,
      Bluetooth_data:state.Bluetooth_data
  };
  }

function matchTo(dispatch){
  
  return bindActionCreators({connect:bluetooth_actions.connect},dispatch)
  
  
  }

  export default connect(mapTo,matchTo)(ProfileScreen);