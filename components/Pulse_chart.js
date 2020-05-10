import { Buffer } from 'buffer';
import React, { Component } from 'react';
import Bluetooth from './Bluetooth';
import Info from './Info';
import Notifications from './Notifycations';
import consts  from '../Const/services_characteristics';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import Icon from 'react-native-vector-icons/FontAwesome5'
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
        this.state = {
            pulse_data:null,
            lables:null
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

    componentDidMount(): void {
        if(this.props.server_data.pulse_data)
        {var lbl = [];
        var pld = [];
        this.props.server_data.pulse_data.map(item=>{
            let current_time = moment().format('YYYY-MM-DD HH');
            if(moment(item.date).format("YYYY-MM-DD HH") == current_time){
                if(lbl.length>10){
                    lbl.pop();
                    pld.pop();
                }
                lbl.unshift(moment(item.date).format('HH:mm')),pld.unshift(item.user_pulse)
            }

        });
        if(pld.length>0&&lbl.length>0){
            this.setState({pulse_data:pld,lables:lbl})
        }}

    }

    render(){
        const opacity = this.opacityValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 0, 1]
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
                                            <Icon style = {{color:'white',marginTop:"auto",marginBottom:"auto",width:vw(5),marginRight:'auto',marginLeft:'auto'}} name = 'heart' size = {vw(5)}></Icon>
                                        </View>
                                        <Text style={{marginLeft:3,fontFamily:'Roboto',fontSize:vw(4),color:'grey'}}>{item.item.user_pulse} BPM</Text>
                                    </View>
                                </View>

                            </View>)}



                    ></FlatList>
                </Animated.View>


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