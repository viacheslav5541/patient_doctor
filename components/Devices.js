import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import {connecting,error_handler} from '../actions/bluetooth_actions';
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
  BackHandler
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackActions, NavigationActions } from 'react-navigation';

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
    constructor(props) {
        super(props);
        this.state = {
          devices_list:[]
        }
        this.need_device = null;
    }

    add_device(device){
        var check = true;
                for(var i = 0;i<this.state.devices_list.length;i+=1)
                {   
                    if(device.id == this.state.devices_list[i].device.id)
                        check = false
                }
                if(check == true){
                    console.log(device)
                    this.state.devices_list.push({device})
                    this.setState({devices_list:this.state.devices_list})
                    // console.log(this.state.devices_list)
                }
    }

    componentWillUnmount(){
        console.log('goback')
        this.props.Bluetooth_data.manager.stopDeviceScan();
    }
    componentDidMount(){
        this.props.Bluetooth_data.manager.startDeviceScan(null,null,(error,device)=>{
            if(error){
                this.props.error_handler(error)
            }
            if(device){
                // console.log(device)
                this.add_device(device)
            }

        })
        
    }

    render(){
        if(this.props.Bluetooth_data.connected_device){
             this.need_device = this.props.Bluetooth_data.connected_device.id
        } else  this.need_device = '';
    
        return(
            
            <View>
                <View style = {{height:vh(8),width:vw(100),backgroundColor:'#0D47A1'}}>
                    <Text style = {{color:'white',fontSize:vw(5)}}>{this.props.Bluetooth_data.status}</Text>
                </View>
                <FlatList
                    data={this.state.devices_list}
                    renderItem = {(item) => 
                        (
                        <TouchableOpacity style = 
                        {   item.item.device.id == this.need_device?
                            {height:vh(20),width:vw(80),marginTop:20,backgroundColor:"blue",borderRadius:50,marginRight:"auto",marginLeft:"auto"}:
                            {height:vh(20),width:vw(80),marginTop:20,backgroundColor:"#EDEEF0",borderRadius:50,marginRight:"auto",marginLeft:"auto"}}>
                            {item.item.device.name? <Text style = {{textAlign:'center',marginTop:"auto",marginBottom:'auto'}}>{item.item.device.name}</Text>:null}
                            <Text style = {{textAlign:'center',marginTop:"auto",marginBottom:'auto'}}>{item.item.device.id}</Text>
                        </TouchableOpacity>
                               
                        )}
                    keyExtractor={item => item.id}
                        ></FlatList>
                    
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
    
    return bindActionCreators({connect:connecting,error_handler:error_handler},dispatch)
    
    
}
  
export default connect(mapTo,matchTo)(Devices);