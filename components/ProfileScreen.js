import { Buffer } from 'buffer';
import React, { Component } from 'react';
import Bluetooth from './Bluetooth';
import Info from './Info';
import Notifications from './Notifycations';
import { BleManager } from "react-native-ble-plx";
import {connecting,search_device} from '../actions/bluetooth_actions';
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
import { StackActions, NavigationActions } from 'react-navigation';

const resetAction = StackActions.reset({
  index: 1,
  actions: [
    NavigationActions.navigate({ routeName: 'ProfileScreen' }),
    NavigationActions.navigate({ routeName: 'Devices' }),
  ],
});

const d_width = Dimensions.get('window').width;
const d_height = Dimensions.get('window').height;

class ProfileScreen extends Component {


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
    console.log('unmountedProfile')
  }

  componentDidUpdate(){
   console.log('updated')
   
  }
  componentDidMount(){
    this.props.search_device(this.props.Bluetooth_data.manager,this.props.Bluetooth_data.device)
    // console.log('mountedProfile')
    // this.props.connect(this.props.Bluetooth_data.manager);
    // this.props.navigation.addListener('willFocus', ()=>{
    //   console.log('Focused')
    // });
    // this.props.navigation.addListener('willBlur', ()=>{
    //   console.log('UnFocused')
    // });
    // AppState.addEventListener('change',()=>{
    //   console.log(AppState.currentState)
    // })
  }


  
  render() {
      return (
        <View style = {{flexDirection:'column',flex:1}}>
          <View style = {{flex:1,backgroundColor:'#0D47A1',flexDirection:'row',justifyContent:'flex-start',flexWrap:'wrap'}}>
            <Text style = {{color:'white',fontSize:vw(5)}}>{this.props.Bluetooth_data.status}</Text>
            <TouchableOpacity onPress = {()=>this.props.navigation.navigate('Devices')} style = {{marginLeft:'auto'}}>
              <Image source = {require('../icons/settings.png')} style = {{width:vw(10),height:vh(7)}}></Image>
            </TouchableOpacity>
          
          </View>
          <Info></Info>
          <Notifications></Notifications>
          {/* <View style = {{flex:1,borderRadius: 4,borderWidth: 2.5,borderColor: 'black',marginTop:'auto',backgroundColor:'#0D47A1'}}>
            <View style = {{flexDirection:'row',justifyContent:'space-around',flex:1}}>
              <Image source = {require('../icons/user.png')} style = {{marginTop:"auto",marginBottom:"auto",width:vw(10),height:vh(7)}}></Image>
              <View style = {{width:2,backgroundColor:"black",margin:10}}></View>
              <Image source = {require('../icons/health.png')} style = {{marginTop:"auto",marginBottom:"auto",width:vw(10),height:vh(7)}}></Image>
              <View style = {{width:2,backgroundColor:"black",margin:10}}></View>
              <Image source = {require('../icons/calendar.png')} style = {{marginTop:"auto",marginBottom:"auto",width:vw(10),height:vh(7)}}></Image>
              <View style = {{width:2,backgroundColor:"black",margin:10}}></View>
              <Image source = {require('../icons/message.png')} style = {{marginTop:"auto",marginBottom:"auto",width:vw(10),height:vh(7)}}></Image>
            </View>
          </View> */}
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
  
  return bindActionCreators({connect:connecting,search_device:search_device},dispatch)
  
  
  }

  export default connect(mapTo,matchTo)(ProfileScreen);