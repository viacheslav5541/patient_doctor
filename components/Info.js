import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Buffer } from 'buffer';
import consts  from '../Const/services_characteristics';
import {bluetooth_actions} from '../actions/bluetooth_actions';
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

   class Info extends Component{

    constructor(props){
        super(props);
        this.state = {
            
        }
       
    }


    start_scan(){
        this.check_pulse();
        var lol = [21,1,1];
        var encryptedCredentials = new Buffer(lol).toString("base64");
        console.log(encryptedCredentials);
        

        this.props.Bluetooth_data.connected_device.discoverAllServicesAndCharacteristics()
        .then((device)=> {
            return this.props.Bluetooth_data.connected_device.writeCharacteristicWithResponseForService(consts.HEAR_RATE_SERVICE_GUID,consts.HEART_RATE_MEASUREMENT_POINT,encryptedCredentials);
        })
        


    }
    check_pulse(){
        
            
        this.props.Bluetooth_data.connected_device.discoverAllServicesAndCharacteristics()
        .then((device) => {
            console.log(device)
            this.props.Bluetooth_data.connected_device.monitorCharacteristicForService(
            consts.HEAR_RATE_SERVICE_GUID,
            consts.HEART_RATE_MEASUREMENT_VALUE,
            (error, characteristic) => {
                if (characteristic && characteristic.value) {
                    console.log(characteristic)
                
                // is 1 then 2 bytes).
                    let heartRate = -1;
                    let decoded = Buffer.from(characteristic.value, 'base64');
                    let firstBitValue = decoded.readInt8(0) & 0x01;
                    if (firstBitValue == 0) {
                // Heart Rate Value Format is in the 2nd byte
                        heartRate = decoded.readUInt8(1);
                        this.props.update_pulse(heartRate);
                        console.log(heartRate)
                } else {
                // Heart Rate Value Format is in the 2nd and 3rd bytes
                    heartRate = (decoded.readInt8(1) << 8) + decoded.readInt8(2);
                    this.props.update_pulse(heartRate);
                    console.log(heartRate)
                
                }
            }


            })

        })
    }

    render(){
        Bluetooth_data = this.props.Bluetooth_data;
        return(
            <View>
                <View style={{backgroundColor:'#white'}}>
                    <View style={{flexDirection : 'column',backgroundColor:'#58C7BF'}} >
                        <Text style = {{fontSize:30}}>{Bluetooth_data.steps} </Text>
                        <Text style = {{fontSize:15 }}>шагов за сегодня</Text>
                    </View>
                    <View style = {{flexDirection : 'row'}}>
                        <View  style = {{flex:1}}>
                            <Image source = {require('../heart.png')} style = {{width:45,height:45}}>
                            </Image>
                        </View>
                        <View style ={{flexDirection:"row",justifyContent:'flex-start',flex:3}}>
                            <View style = {{alignItems:'center'}}>
                                <Text style={{fontWeight:"bold"}}>Пульс</Text>
                                <Text>{Bluetooth_data.pulse}</Text>
                            </View>
                        </View>
                        <View style ={{flexDirection:"row",justifyContent:'flex-end',flex:1}}>
                        <Button title = 'Проверить пульс' onPress = {()=>this.start_scan()}></Button>
                        </View>
                    </View>
                    <View style = {{flexDirection : 'row'}}>
                        <View  style = {{flex:1}}>
                            <Image source = {require('../ves.png')} style = {{width:45,height:45}}>
                            </Image>
                        </View>
                        <View style ={{flexDirection:"row",justifyContent:'flex-start',flex:3}}>
                            <View style = {{alignItems:'center'}}>
                                <Text style={{fontWeight:"bold"}}>Вес</Text>
                                <Text>{Bluetooth_data.weight}</Text>
                            </View>
                        </View>
                    </View>
                </View>

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
    
    return bindActionCreators({update_pulse:bluetooth_actions.update_pulse},dispatch)
    
    
    }
  
    export default connect(mapTo,matchTo)(Info);