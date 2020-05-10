import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import {full_disconnect, change_device, connect_to_device,update_status} from '../actions/bluetooth_actions';
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
    BackHandler, TouchableOpacity, Image
} from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackActions, NavigationActions } from 'react-navigation';
import {AsyncStorage} from 'react-native'

const resetAction = StackActions.reset({
  index: 1,
  actions: [
    NavigationActions.navigate({ routeName: 'ProfileScreen' }),
    NavigationActions.navigate({ routeName: 'Devices' }),
  ],
});


class Devices extends Component {


    static navigationOptions = {
      title:'Settings',
      header:null,
      headerLeft: null
  
    };
    ble_state_listener: Subscription;
    constructor(props) {
        super(props);
        this.state = {
            scan_on:true,
            devices_list:[]
        }
        this.need_device = null;
    }

     componentWillUnmount() {
        this.props.Bluetooth_data.manager.stopDeviceScan()

    }

     change_device(device){
        console.log(device);
        AsyncStorage.setItem('device',device);
        this.props.change_device(device);

    }


    scan_controller(){
        this.ble_state_listener = this.props.Bluetooth_data.manager.onStateChange((state)=>{
            if(state == 'PoweredOn'){
                this.props.update_status('Выберите устройство');
                this.scan_devices()
            }else if(state == 'PoweredOff'){
                this.props.update_status('Включите блютуз для возобновления поиска');
                this.props.Bluetooth_data.manager.stopDeviceScan()
            }
        },true);
    }

    scan_devices(){
        this.props.Bluetooth_data.manager.startDeviceScan(null,null,(error,device)=>{
            if(error){
                console.log(error)
            }
            if(device){
                var check = true;
                let devices_list = this.state.devices_list;
                for(var i = 0;i<devices_list.length;i+=1)
                {
                    if(device.id == devices_list[i].id)
                        check = false
                }
                if(check == true){
                    devices_list.push({id:device.id,name:device.name});
                    this.setState({devices_list:devices_list})
                }

            }

        })
    }
    // scan_devices(){
    //     return function(dispatch,getState){
    //         getState().Bluetooth_data.manager.startDeviceScan(null,null,(error,device)=>{
    //             if(error){
    //                 dispatch(update_status(error))
    //             }
    //             if(device){
    //                 var check = true;
    //                 let devices_list = getState().Bluetooth_data.devices_list
    //                 for(var i = 0;i<devices_list.length;i+=1)
    //                 {
    //                     if(device.id == devices_list[i].id)
    //                         check = false
    //                 }
    //                 if(check == true){
    //                     devices_list.push({id:device.id,name:device.name});
    //                     dispatch({
    //                         type:DEVICES_LIST_UPDATED,
    //                         payload:devices_list
    //                     })
    //
    //                 }
    //
    //                 // dispatch(add_device(device,getState().Bluetooth_data.devices_list))
    //             }
    //         })
    //     }
    // }

    componentDidMount(){
        this.props.full_disconnect()
        this.scan_controller()
        // if(this.props.Bluetooth_data.device_searching){
        //     this.props.stop_scan(this.props.Bluetooth_data.manager);
        // }
        // setTimeout(() => this.props.Bluetooth_data.manager.startDeviceScan(null,null,(error,device)=>{
        //         //     if(error){
        //         //         this.props.error_handler(error)
        //         //     }
        //         //     if(device){
        //         //         // console.log(device)
        //         //         this.add_device(device)
        //         //     }
        //         //
        //         // }),2000)
        //
        // this.props.bluetooth_controller('display');
    }

    render(){
        if(this.props.Bluetooth_data.device){
             this.need_device = this.props.Bluetooth_data.device
        } else  this.need_device = '';
        return(
            <View style = {{flex:1}}>
                <View style = {{height:vh(8),width:vw(100),backgroundColor:'#0D47A1',display:'flex',flexDirection:'row'}}>
                    <Text style = {{color:'white',fontSize:vw(5)}}>{this.props.Bluetooth_data.status}</Text>
                </View>

                {
                    <FlatList
                    data={this.state.devices_list}
                    renderItem = {(item) =>
                        (
                        <TouchableOpacity onPress = {()=>this.change_device(item.item.id)} style =
                        {   item.item.id == this.need_device?
                            {height:vh(20),width:vw(80),marginTop:20,backgroundColor:"blue",borderRadius:50,marginRight:"auto",marginLeft:"auto"}:
                            {height:vh(20),width:vw(80),marginTop:20,backgroundColor:"#EDEEF0",borderRadius:50,marginRight:"auto",marginLeft:"auto"}}>
                            {item.item.name? <Text style = {{textAlign:'center',marginTop:"auto",marginBottom:'auto'}}>{item.item.name}</Text>:null}
                            <Text style = {{textAlign:'center',marginTop:"auto",marginBottom:'auto'}}>{item.item.id}</Text>
                        </TouchableOpacity>

                        )}
                    keyExtractor={item => item.id}
                    ></FlatList>}
                    
            </View>
        )
    }
}



function mapTo(state){

    return {
        Bluetooth_data:state.Bluetooth_data
    };
}

function matchTo(dispatch){
    
    return bindActionCreators({full_disconnect:full_disconnect,change_device:change_device,update_status:update_status},dispatch)
    
    
}
  
export default connect(mapTo,matchTo)(Devices);