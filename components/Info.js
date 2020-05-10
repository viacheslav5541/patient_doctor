import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Buffer } from 'buffer';
import consts  from '../Const/services_characteristics';
import {update_pulse,get_steps} from '../actions/bluetooth_actions';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import Icon from 'react-native-vector-icons/AntDesign'
import Icon2 from 'react-native-vector-icons/FontAwesome5'
import Icon3 from 'react-native-vector-icons/Fontisto'
import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';
import ProgressLoader from "rn-progress-loader";
import {
    Animated,
    TextInput,
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
    TouchableOpacity, Easing
} from 'react-native';

  const d_width = Dimensions.get('window').width;
  const d_height = Dimensions.get('window').height;
  

class Info extends Component{

    constructor(props){

        super(props);
        this.state = {
            window:false,
            loading:false,
            dist:'0',
            sist:'',
        }
       
    }

    send_pressure(){


    }


    kruchu = new Animated.Value(0);
    render(){
        const lolkruchus = this.kruchu.interpolate({
            inputRange: [0, 1, 5],
            outputRange: [0, '360deg', '0deg']
        });
        let Bluetooth_data = this.props.Bluetooth_data;
        return(
            <View style = {{flex:5,backgroundColor:"#2979FF",borderRadius:10,margin:10}}>
                <Dialog
                    visible={this.state.window}
                >
                    <DialogContent style = {{backgroundColor:'#009dff'}}>
                        <View style = {{width:vw(30),height:vh(30),flexDirection:'column',alignItems:'center',justifyContent:'space-between'}}>
                            <View style = {{flex:1}}><Text style = {{marginTop:10,fontSize:vw(3),color:'white'}}>Внести давление?</Text></View>
                            <View style = {{flex:4,marginTop:20}}>
                                <View style = {{flexDirection:'column',alignItems:'center'}}>
                                    <View style = {{height:vw(12),width:vw(12),backgroundColor:"white",borderWidth:2,borderRadius:100,borderColor:'rgba(0,0, 0, 0.174)'}}>
                                        <TextInput onChangeText={text => {this.setState({sist:text});console.log(this.state.sist)}} placeholder = '0' keyboardType='numeric' style = {{fontSize:vw(3.4),textAlign: "center",marginTop:'auto',marginBottom:'auto'}} caretHidden = {true} maxLength = {3}/>
                                    </View>
                                    <Text style = {{color:'white'}}>Систолическое</Text>
                                    <View style = {{height:vw(12),width:vw(12),backgroundColor:"white",borderWidth:2,borderRadius:100,borderColor:'rgba(0,0, 0, 0.174)'}}>
                                        <TextInput placeholder = '0' onChangeText={text => {this.setState({dist:text})}} keyboardType='numeric' style = {{fontSize:vw(3.4),textAlign: "center",marginTop:'auto',marginBottom:'auto'}} caretHidden = {true} maxLength = {3}/>
                                    </View>
                                    <Text style = {{color:'white'}}>Дистолическое</Text>
                                </View>
                            </View>
                            <View style = {{flex:0.5,alignSelf:'center',}}><Text></Text></View>
                        </View>
                        <View style = {{height:vh(5),marginTop:10,width:vw(30),flexDirection:"row",justifyContent:'space-around',borderTopWidth:2,alignContent:'center',borderColor:'grey'}}>
                            <View style = {{flex:1}}><TouchableOpacity style = {{flex:1}}>
                                <Icon size = {vw(5)} style = {{marginTop:'auto',marginRight:'auto',marginLeft:'auto',color:'white'}} name = 'close'/>
                            </TouchableOpacity></View>
                            <View style = {{borderWidth:1,marginTop:'auto',height:vw(5),borderColor:'grey'}}/>
                            <View style = {{flex:1}}><TouchableOpacity style = {{flex:1}}>
                                <Icon size = {vw(5)} style = {{marginTop:'auto',marginRight:'auto',marginLeft:'auto',color:'white'}} name = 'check'/>
                            </TouchableOpacity></View>
                        </View>
                    </DialogContent>
                </Dialog>
                <TouchableOpacity onPress = {()=>this.setState({window:!this.state.window})}>
                    <Icon style = {{alignSelf:'flex-end',marginRight:10,height:vh(2.5)}} size = {vw(6)} name = 'ellipsis1'></Icon>
                </TouchableOpacity>
                <View style = {{flex:1,margin:10,backgroundColor:"#E1F5FE",borderRadius:10,flexDirection:'column',justifyContent:'space-between'}}>
                    <View style = {{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'baseline'}}>
                        <View style = {{flex:1,marginLeft:10}}>
                            <Icon2 size = {vw(12)} name = 'running'/>
                        </View>
                        <View style = {{flex:2,flexDirection:'row',alignItems:'baseline'}}>
                            <Text style = {{fontStyle:'italic',fontSize:d_width/10}}>±{Bluetooth_data.steps}</Text>
                            <Text style = {{marginRight:'auto',fontStyle:'italic',fontSize:d_width/16}}>шагов</Text>
                        </View>
                        
                    </View>
                    <View style = {{flexDirection:'row',justifyContent:'space-between',alignItems:'center',flex:1}}>
                        <View style = {{flex:1,marginLeft:10}}>
                            <Icon3 size = {vw(8)} name = 'pulse'></Icon3>
                        </View>
                        <Animated.View style = {{flex:1,flexDirection:'row',alignItems:'baseline'}}>
                             <Text style = {{fontStyle:'italic',fontSize:d_width/10}}>{Bluetooth_data.pulse}</Text>
                            <Text style = {{marginRight:'auto',fontStyle:'italic',fontSize:d_width/16}}>BPM</Text>
                        </Animated.View>
                        <TouchableOpacity onPress={!this.props.Bluetooth_data.connected_device?()=>{Animated.timing(
                            this.kruchu,
                            {
                                toValue: 20,
                                duration: 3000,
                                easing: Easing.linear,
                                useNativeDriver:true
                            }
                        ).start();setTimeout(()=>{this.kruchu.setValue(0)},3000)}:()=>{this.props.update_pulse(this.props.Bluetooth_data.manager,this.props.Bluetooth_data.device);Animated.timing(
                            this.kruchu,
                            {
                                toValue: 20,
                                duration: 3000,
                                easing: Easing.linear,
                                useNativeDriver:true
                            }
                        ).start();setTimeout(()=>{this.kruchu.setValue(0)},3000)}} style = {{flex:1,alignSelf:"center"}}>
                            <Animated.View style = {{transform:[{rotate:this.kruchu}]}}>
                                <Icon size = {vw(7)} name = 'sync' style = {{marginLeft:'auto',marginRight:"auto"}}/></Animated.View>
                        </TouchableOpacity>
                        
                       
                    </View>
                    <View style = {{flexDirection:'row',justifyContent:'space-between',alignItems:'center',flex:1}}>
                        <View style = {{flex:1,marginLeft:10}}>
                            <Icon2 size = {vw(8)} name = 'weight'/>
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
        Bluetooth_data:state.Bluetooth_data,
        server_data:state.server_data
    };
    }
  
  function matchTo(dispatch){
    
    return bindActionCreators({update_pulse:update_pulse,get_steps:get_steps},dispatch)
    
    
    }
  
export default connect(mapTo,matchTo)(Info);