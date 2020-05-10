import { Buffer } from 'buffer';
import React, { Component } from 'react';
import Bluetooth from './Bluetooth';
import Info from './Info';
import Notifications from './Notifycations';
import { BleManager } from "react-native-ble-plx";
import {connect_to_device,ble_state_listener_on,update_pulse,reconnect} from '../actions/bluetooth_actions';
import {get_user_info,send_pulse,logout} from "../actions/server_actions";
import consts  from '../Const/services_characteristics';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import ProgressLoader from 'rn-progress-loader';
import moment from 'moment'
import Icon from 'react-native-vector-icons/AntDesign'

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
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Authorization' }),
    ],
});

const d_width = Dimensions.get('window').width;
const d_height = Dimensions.get('window').height;


class Patient extends Component {


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
        console.log(moment().format('YYYY-MM-DD HH:mm'))
        // let kek = [{date:'27.08.1998',pulse:228}]
        //
        //      AsyncStorage.setItem('pulse','').then(res=>{
        //     console.log('husadasd')})
        //   AsyncStorage.getItem('pulse').then(res=>{
        //       console.log(JSON.parse(res))
        //
        //   })
        // AsyncStorage.setItem('device','').then(res=>{
        //     console.log(res)
        // })
        //   this.props.send_pulse()
        this.props.navigation.addListener('willFocus', ()=>{
            console.log('focus')
            if(!this.props.Bluetooth_data.connected_device){
                this.props.ble_state_listener_on()
            }
        });
        this.props.navigation.addListener('willBlur', ()=>{
            console.log('UnFocused')
        });
        // AppState.addEventListener('change',()=>{
        //   console.log(AppState.currentState)
        // })

    }



    render() {


        return (
            <View style = {{flexDirection:'column',flex:1}}>
                <View style = {{flex:1,backgroundColor:'#0D47A1',flexDirection:'row',justifyContent:'flex-start'}}>
                    <View style = {{flex:3}}>
                        <Text style = {{color:'white',fontSize:vw(5),alignSelf:"flex-start",marginTop:'auto',marginLeft:10}}>{this.props.Bluetooth_data.status}</Text>
                    </View>
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
                <Notifications  style = {{flex:5,lexDirection:"column",borderRadius:10,backgroundColor:'#1E88E5',justifyContent:'center',margin:10}}></Notifications>
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
        Bluetooth_data:state.Bluetooth_data,
    };
}

function matchTo(dispatch){

    return bindActionCreators({connect_to_device:connect_to_device,ble_state_listener_on:ble_state_listener_on,update_pulse:update_pulse,reconnect:reconnect,logout:logout},dispatch)


}

export default connect(mapTo,matchTo)(ProfileScreen);