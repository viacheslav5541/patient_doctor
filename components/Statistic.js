import { Buffer } from 'buffer';
import React, { Component } from 'react';
import Bluetooth from './Bluetooth';
import Info from './Info';
import Notifications from './Notifycations';
import { BleManager } from "react-native-ble-plx";
import {connecting} from '../actions/bluetooth_actions';
import consts  from '../Const/services_characteristics';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import {
  AsyncStorage,
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
  TouchableOpacity,
  Animated,
  BackHandler
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const d_width = Dimensions.get('window').width;
const d_height = Dimensions.get('window').height;

class Statistic extends Component {


  static navigationOptions = {
    header:null,
    headerLeft: null

  };


  constructor(props) {
    super(props);
    this.state = {    
    }
  }

  componentWillUnmount(){
    console.log('unmountedStatistic')
  }

  componentDidUpdate(){
   console.log('updatedStatistic')
   
  }
  componentDidMount(){

  }


  
  render() {
      return (
        <View style = {{flexDirection:'column',flex:1}}>

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
  
  return bindActionCreators({connect:connecting},dispatch)
  
  
  }

  export default connect(mapTo,matchTo)(Statistic);