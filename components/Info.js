import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Buffer } from 'buffer';
import consts  from '../Const/services_characteristics';
import {update_pulse,get_steps} from '../actions/bluetooth_actions';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';


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

  const d_width = Dimensions.get('window').width;
  const d_height = Dimensions.get('window').height;
  

class Info extends Component{

    constructor(props){
        super(props);
        this.state = {
            
        }
       
    }
    
    render(){
        Bluetooth_data = this.props.Bluetooth_data;
        return(
            <View style = {{flex:5,backgroundColor:"#2979FF",borderRadius:10,margin:10}}>
                <View style = {{flex:1,margin:10,backgroundColor:"#E1F5FE",borderRadius:10,flexDirection:'column',justifyContent:'space-between'}}>
                    <View style = {{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'baseline'}}>
                        <View style = {{flex:1}}>
                            <Image source = {require('../icons/run.png')}   style = {{width:vw(15),height:vh(10),marginRight:'auto'}} ></Image>
                        </View>
                        <View style = {{flex:2,flexDirection:'row',alignItems:'baseline'}}>
                            <Text style = {{fontStyle:'italic',fontSize:d_width/10}}>±{Bluetooth_data.steps}</Text>
                            <Text style = {{marginRight:'auto',fontStyle:'italic',fontSize:d_width/16}}>шагов</Text>
                        </View>
                        
                    </View>
                    <View style = {{flexDirection:'row',justifyContent:'space-between',alignItems:'baseline',flex:1}}>
                        <View style = {{flex:1}}>
                            <Image source = {require('../icons/pulse.png') } style = {{width:vw(15),height:vh(10),marginRight:'auto'}} ></Image>
                        </View>
                        <View style = {{flex:1,flexDirection:'row',alignItems:'baseline'}}>
                             <Text style = {{fontStyle:'italic',fontSize:d_width/10}}>{Bluetooth_data.pulse}</Text>
                            <Text style = {{marginRight:'auto',fontStyle:'italic',fontSize:d_width/16}}>BPM</Text>
                        </View>
                        <TouchableOpacity onPress={!this.props.Bluetooth_data.connected_device?()=>console.log('heh'):()=>this.props.update_pulse(this.props.Bluetooth_data.connected_device)} style = {{flex:1,alignSelf:"center"}}>
                            <Image source = {require('../icons/update.png')} resizeMode = 'center'  style = {{flex:1,width:100,height:100,marginLeft:"auto"}}></Image> 
                        </TouchableOpacity>
                        
                       
                    </View>
                    <View style = {{flexDirection:'row',justifyContent:'space-between',alignItems:'baseline',flex:1}}>
                        <View style = {{flex:1}}>
                            <Image source = {require('../icons/weight.png')} style = {{width:vw(15),height:vh(10),marginRight:'auto'}} ></Image>
                        </View>
                        <View style = {{flex:2,flexDirection:'row',alignItems:'baseline'}}>
                            <Text style = {{fontStyle:'italic',fontSize:d_width/10}}>{Bluetooth_data.weight}</Text>
                            <Text style = {{marginRight:'auto',fontStyle:'italic',fontSize:d_width/16}}>KG</Text>
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
    
    return bindActionCreators({update_pulse:update_pulse,get_steps:get_steps},dispatch)
    
    
    }
  
export default connect(mapTo,matchTo)(Info);