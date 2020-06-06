
import React, { Component } from 'react';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import Icon from 'react-native-vector-icons/Fontisto'
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
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
    BackHandler, Easing, RefreshControl
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {load_pulse_data} from "../actions/server_actions";
import moment from 'moment'
import axios from "axios";
const d_width = Dimensions.get('window').width;
const d_height = Dimensions.get('window').height;


var empty_pulse = [0,0,0,0]
var empty_lables = [moment().subtract(25,'minutes').format('HH:mm'),moment().subtract(15,'minutes').format('HH:mm'),moment().subtract(10,'minutes').format('HH:mm'),moment().subtract(5,'minutes').format('HH:mm')]



class Pulse_chart extends Component {


    static navigationOptions = {
        header:null,
        headerLeft: null

    };


    constructor(props) {

        super(props);
        this.opacityValue = new Animated.Value(0);
        this.opacityValue2 = new Animated.Value(0);
        this.state = {
            pulse_data:null,
            lables:null,
            pressure:[],
            deletying:false,
        }
    }
    opacity() {
        this.opacityValue.setValue(0);
        Animated.timing(
            this.opacityValue,
            {
                toValue: 1,
                duration: 3500,
                easing: Easing.linear
            }
        ).start();
    }
    refresh() {
        this.opacity();
        this.props.load_pulse_data();
    }

    load_pressure(){

        this.setState({deletying:true})
        axios.get("http://82.179.9.51:8080/pressure_history",{headers:{authorization:`Bearer ${this.props.server_data.access_token}`}}).then(res=>{
            this.setState({pressure:res.data})
            this.setState({deletying:false},()=>{
                Animated.timing(
                    this.opacityValue2,
                    {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.linear
                    }
                ).start();
            })

        })
    }

    componentDidMount(): void {
        this.load_pressure()
        if(this.props.server_data.pulse_data)
        {var lbl = [];
        var pld = [];
          var kek =  this.props.server_data.pulse_data.slice();
          kek.reverse();
        kek.map(item=>{
            let current_time = moment().format('YYYY-MM-DD HH');
                if(lbl.length>6){
                    lbl.pop();
                    pld.pop();
                }
                lbl.unshift(moment(item.date).format('HH:mm')),pld.unshift(item.user_pulse)


        });
        if(pld.length>0&&lbl.length>0){
            this.setState({pulse_data:pld,lables:lbl})
        }}

    }
    keks(id){
        // this.opacityValue2.setValue(0);
        this.setState({deletying:true});
        Animated.timing(
            this.opacityValue2,
            {
                toValue: 0,
                duration: 500,
                easing: Easing.linear
            }
        ).start();
        axios.post('http://82.179.9.51:8080/patient/del-pressure',{pressure_id:id},{headers:{authorization:`Bearer ${this.props.server_data.access_token}`}}).then(res=>{
            setTimeout(()=>this.load_pressure(),500);
        })

    }

    render(){

        const opacity = this.opacityValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 0, 1]
        });
        const opacity2 = this.opacityValue2.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.5, 1]
        });
        return(
            <View style = {{flex:1}}>
                <LineChart
                    onDataPointClick={()=>{console.log('masoud')}}
                    data={this.state.pulse_data?{
                        labels: this.state.lables,
                        datasets: [{
                            data:this.state.pulse_data
                        }]
                    }
                    :{
                        labels: empty_lables,
                        datasets: [{
                            data:empty_pulse
                        }]
                    }
                    }
                    width={Dimensions.get('window').width} // from react-native

                    height={vh(30)}
                    chartConfig={{
                        backgroundColor: 'blue',
                        backgroundGradientFrom: '#2979FF',
                        backgroundGradientTo: 'blue',
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        }
                    }}
                    style={{
                    }}
                />
                <Animated.View style = {{opacity,flex:1}}>
                    <FlatList
                        refreshControl = {
                            <RefreshControl
                                colors={['#1e90ff']}
                                refreshing={this.props.server_data.pulse_loading}
                                onRefresh={this.refresh.bind(this)}
                            />
                        }
                        data = {this.props.server_data.pulse_data}
                        renderItem = {(item) =>(
                            <View style = {{height:vh(8)}}>
                                <View style = {{height:vh(8),marginRight:vw(1.5),marginLeft:vw(1.5)}}>
                                    <View style ={{height:vh(2.5)}}>
                                        <Text style = {{color:"grey",fontFamily:'Roboto',fontSize:vw(2.5)}}>{item.item.date}</Text>
                                    </View>
                                    <View style ={{height:vh(5.5),borderTopWidth:1,borderBottomWidth:1,borderColor:"grey",flexDirection:'row',alignItems:'center'}}>
                                        <View style = {{backgroundColor:'blue',width:vw(7),borderRadius:40,height:vh(4.5)}}>
                                            <Icon style = {{color:'white',marginTop:"auto",marginBottom:"auto",width:vw(3.8),marginRight:'auto',marginLeft:'auto'}} name = 'heart' size = {vw(3.3)}></Icon>
                                        </View>
                                        <Text style={{marginLeft:3,fontFamily:'Roboto',fontSize:vw(4),color:'grey'}}>{item.item.user_pulse} BPM</Text>
                                    </View>
                                </View>

                            </View>)}



                    ></FlatList>

                </Animated.View>
                <View style = {{flex:1,borderTopWidth:4}}>
                <Animated.View style = {{opacity:opacity2}}>

                    {this.state.pressure.length>0?<FlatList
                        refreshControl = {
                            <RefreshControl
                                colors={['#1e90ff']}
                                refreshing={this.state.deletying}
                                onRefresh={()=>this.load_pressure()}
                            />
                        }
                        data = {this.state.pressure}
                        renderItem = {(item) =>(
                            <View style = {{height:vh(8)}}>
                                <View style = {{height:vh(8),marginRight:vw(1.5),marginLeft:vw(1.5)}}>
                                    <View style ={{height:vh(2.5)}}>
                                        <Text style = {{color:"grey",fontFamily:'Roboto',fontSize:vw(2.5)}}>{item.item.date}</Text>
                                    </View>
                                    <View style ={{height:vh(5.5),borderTopWidth:1,borderBottomWidth:1,borderColor:"grey",flexDirection:'row',alignItems:'center'}}>
                                        <View style = {{backgroundColor:'blue',width:vw(7),borderRadius:40,height:vh(4.5)}}>
                                            <Icon style = {{color:'white',marginTop:"auto",marginBottom:"auto",width:vw(4.6),marginRight:'auto',marginLeft:'auto'}} name = 'pulse' size = {vw(4)}></Icon>
                                        </View>
                                        <Text style={{marginLeft:3,fontFamily:'Roboto',fontSize:vw(4),color:'grey'}}>{item.item.systolic_pressure}/{item.item.diastolic_pressure}</Text>
                                        <TouchableOpacity onPress = {()=>{this.keks(item.item.id)}} style = {{marginLeft:'auto'}}>
                                            <Icon  name = 'close-a' size = {vw(3)}/></TouchableOpacity>
                                    </View>
                                </View>

                            </View>)}
                    />:
                        <Text style = {{alignSelf: 'center',marginTop:vh(13),marginBottom:'auto',fontSize:vw(5),color:'grey'}}>Нет данных </Text>
                    }



                </Animated.View>
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

    return bindActionCreators({load_pulse_data:load_pulse_data},dispatch)


}

export default connect(mapTo,matchTo)(Pulse_chart);