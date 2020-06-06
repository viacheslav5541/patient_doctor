
import React, { Component } from 'react';
import Info from './Info';
import {connect_to_device,ble_state_listener_on,update_pulse,reconnect} from '../actions/bluetooth_actions';
import {logout} from "../actions/server_actions";
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import moment from 'moment'
import Icon from 'react-native-vector-icons/AntDesign'

import {
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
import Connection_status from "./connection_status";
import New_Notify from "./New_Notify";

const resetAction = StackActions.reset({
  index: 0,
  actions: [
      NavigationActions.navigate({ routeName: 'Authorization' }),
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
      this.props.navigation.addListener('willFocus', ()=>{
      console.log('focus')
          if(!this.props.Bluetooth_data.connected_device){
              this.props.ble_state_listener_on()
          }
        });
  }


  
  render() {


      return (
        <View style = {{flexDirection:'column',flex:1,backgroundColor:'#2979FF'}}>
            <Image source={require('../icons/volna1.png')} style = {{position:'absolute',bottom:0,left:0,width:vw(60),height:vw(60)}}></Image>
            <Image source={require('../icons/volna2.png')} style = {{position:'absolute',bottom:0,left:0,width:vw(60),height:vw(60)}}></Image>
            <Image source={require('../icons/volna1.png')} style = {{position:'absolute',top:0,right:0,width:vw(60),height:vw(60),transform: [{ rotate: '180deg'}]}}></Image>
            <Image source={require('../icons/volna2.png')} style = {{position:'absolute',top:0,right:0,width:vw(60),height:vw(60),transform: [{ rotate: '180deg'}]}}></Image>
            <View style = {{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>
                <Connection_status/>
                    <View style = {{flex:1,flexDirection:'row',marginLeft:'auto',justifyContent:'flex-end'}}>
                        <TouchableOpacity style = {{marginRight:10,alignSelf:'center'}} onPress = {()=>{this.props.reconnect()}}>
                            <Icon size = {vw(6)} name = 'sync' style = {{color:"white"}}></Icon>
                        </TouchableOpacity>
                        <TouchableOpacity style = {{marginRight:10,alignSelf:"center"}} onPress = {()=>{this.props.navigation.navigate('Devices')}}>
                            <Icon size = {vw(7)} name = 'setting' style = {{color:'white'}}></Icon>
                        </TouchableOpacity>
                        <TouchableOpacity style = {{marginRight:10,alignSelf:"center"}} onPress = {()=>{this.props.logout()}}>
                            <Icon size = {vw(6)} name = 'logout' style = {{color:'white'}}></Icon>
                        </TouchableOpacity>
                 </View>
            </View>
            <Info></Info>
            <New_Notify  style = {{flex:5}}></New_Notify>
            </View>
    )
  }
}



function mapTo(state){

  return{
      Bluetooth_data:state.Bluetooth_data,
  };
  }

function matchTo(dispatch){
  
  return bindActionCreators({connect_to_device:connect_to_device,ble_state_listener_on:ble_state_listener_on,update_pulse:update_pulse,reconnect:reconnect,logout:logout},dispatch)
  
  
  }

  export default connect(mapTo,matchTo)(ProfileScreen);