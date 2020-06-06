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
    TouchableOpacity, Easing, RefreshControl
} from 'react-native';
import axios from "axios";
import moment from 'moment';

const d_width = Dimensions.get('window').width;
const d_height = Dimensions.get('window').height;


class Recommendations extends Component{

    constructor(props){

        super(props);
        this.state = {
            content:[]

        }

    }
    componentDidMount(): void {
        this.props.navigation.addListener('willFocus', ()=>{
           this.load()
        });
    }

    load(){
        axios.post('http://82.179.9.51:8080/patient/info-treatment-information',null,{headers:{authorization:`Bearer ${this.props.server_data.access_token}`}}).then(res=>{
            this.setState({content:res.data})
        })

    }


    render(){
        if(this.state.content.length>0)
        return(
            <View style = {{flex:1,lexDirection:"column",backgroundColor:'#2979FF',justifyContent:'center'}}>
                <Image source={require('../icons/volna1.png')} style = {{position:'absolute',bottom:0,left:0,width:vw(60),height:vw(60)}}></Image>
                <Image source={require('../icons/volna2.png')} style = {{position:'absolute',bottom:0,left:0,width:vw(60),height:vw(60)}}></Image>
                <Image source={require('../icons/volna1.png')} style = {{position:'absolute',top:0,right:0,width:vw(60),height:vw(60),transform: [{ rotate: '180deg'}]}}></Image>
                <Image source={require('../icons/volna2.png')} style = {{position:'absolute',top:0,right:0,width:vw(60),height:vw(60),transform: [{ rotate: '180deg'}]}}></Image>
                <View style = {{flex:1,backgroundColor:'white',margin:20,borderRadius:20}}>
               <FlatList
                    data={this.state.content}
                    renderItem = {(item)=>{return(
                        <View style = {{}}>
                            <View style = {{flex:1,alignItems: 'center',flexDirection:'row',margin: 20,borderBottomWidth:1,borderBottomColor:'grey'}}>
                                <View style = {{marginBottom:40,width:vw(5),height:vw(5),backgroundColor:'white',borderRadius: 100,borderWidth:2,borderColor:'rgba(0,0,0,0.3)'}}></View>
                                <View><Text style = {{marginBottom:40,marginLeft:20,marginRight:20,color:'black',fontSize:vw(4.5),fontWeight:'bold'}}>{item.item.content}</Text></View>
                    </View>
                        </View>
                            )

                    }}/></View>

            </View>
        );
        else {
            return(
            <View style = {{flex:1,lexDirection:"column",borderRadius:10,backgroundColor:'#1E88E5',justifyContent:'center',margin:10}}>
                <Text style = {{textAlign:'center',color:'white',fontSize:vw(13),textShadowColor:'rgba(0,0,0,0.25)',textShadowOffset:{width:0,height:4},textShadowRadius:4}}>Нет данных</Text>
            </View>

        )}
    }


}


function mapTo(state){

    return{
        server_data:state.server_data
    };
}

function matchTo(dispatch){

    return bindActionCreators({update_pulse:update_pulse,get_steps:get_steps},dispatch)


}

export default connect(mapTo,matchTo)(Recommendations);