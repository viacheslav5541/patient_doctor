
import React, { Component } from 'react';
import {load_pulse_data,load_steps_data} from '../actions/server_actions'
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import Icon from 'react-native-vector-icons/FontAwesome5'
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
  TouchableOpacity,
  Easing,
  RefreshControl,
  Animated
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const d_width = Dimensions.get('window').width;
const d_height = Dimensions.get('window').height;


 class Statistic extends Component {


  static navigationOptions = {
    header:null,
    headerLeft: null

  };

  constructor(props) {
    super(props);
      this.opacityValue = new Animated.Value(0);
    this.state = {
      data:null,
      is_refreshing: false,
    }
  }

  componentWillUnmount(){
    console.log('unmountedStatistic')
  }

  componentDidUpdate(){
   console.log('updatedStatistic')
  }
  componentDidMount(){
    this.props.navigation.addListener('willFocus', ()=>{
      this.props.load_pulse_data();
      this.props.load_steps_data();
    });
  }


   opacity_pulse() {

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
   refresh_pulse() {

     this.opacity_pulse();
     this.props.load_pulse_data();
     this.props.load_steps_data();
     // this.setState({is_refreshing: true});
     // setTimeout(() => {
     //   this.setState({is_refreshing: false});
     // }, 3500);
   }



  
  render() {
    const opacity = this.opacityValue.interpolate({
      inputRange: [0, 0.5, 0.8],
      outputRange: [1, 0, 1]
    });
      return (
        <View style = {{flexDirection:'column',flex:1}}>
          <View style = {{backgroundColor:'#0D47A1',height:vh(15)}}>

            <View style = {{backgroundColor:'#A5C9FF',height:vw(20),width:vw(20),marginTop:'auto',marginBottom:'auto',marginRight:'auto',marginLeft:'auto',borderRadius:200}}>
              <TouchableOpacity onPress = {()=>{this.props.navigation.navigate('Pulse_chart')}}>
              <Text style = {{textAlign:'center',marginBottom:'auto',marginTop:vw(4),fontSize:vw(8),fontFamily:"Roboto"}}>{this.props.Bluetooth_data.pulse}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Animated.View style = {{opacity,flex:1}}>
            <FlatList
                refreshControl = {
                  <RefreshControl
                      colors={['#1e90ff']}
                      refreshing={this.props.server_data.pulse_loading}
                      onRefresh={this.refresh_pulse.bind(this)}
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
          <View style = {{flex:1.3}}>
            <TouchableOpacity onPress = {()=>this.props.navigation.navigate('Steps_chart')}>
            <View style = {{height:vh(8),backgroundColor:'#2979FF',borderRadius:4,flexDirection:"row",alignItems:'center',justifyContent:'space-between'}}>
              <View style = {{flex:1,flexDirection:'row',justifyContent:"space-around"}}>
                <Text style={{fontSize:vw(8),color:"#BED7FF"}}>{this.props.Bluetooth_data.steps} шагов</Text>
                <Icon name = 'running' size = {vw(10)}/>
              </View>
              <Icon name = 'angle-right' size = {vw(6)} style = {{color:'#BED7FF'}}></Icon>
            </View>
            </TouchableOpacity>
            <Animated.FlatList
                refreshControl = {
                    <RefreshControl
                        colors={['#1e90ff']}
                        refreshing={this.props.server_data.steps_loading}
                        onRefresh={this.refresh_pulse.bind(this)}
                    />
                }
                style = {{opacity}}
                data = {this.props.server_data.steps_data}
                renderItem = {(item) =>(
                    <View style = {{height:vh(8)}}>
                      <View style = {{height:vh(8),marginRight:vw(1.5),marginLeft:vw(1.5)}}>
                        <View style ={{height:vh(2.5)}}>
                          <Text style = {{color:"grey",fontFamily:'Roboto',fontSize:vw(2.5)}}>{item.item.date}</Text>
                        </View>
                        <View style ={{height:vh(5.5),borderTopWidth:1,borderBottomWidth:1,borderColor:"grey",flexDirection:'row',alignItems:'center'}}>
                          <View style = {{backgroundColor:'blue',width:vw(7),borderRadius:40,height:vh(4.5)}}>
                            <Icon style = {{color:'white',marginTop:"auto",marginBottom:"auto",width:vw(5),marginRight:'auto',marginLeft:'auto'}} name = 'running' size = {vw(5)}></Icon>
                          </View>
                          <Text style={{marginLeft:3,fontFamily:'Roboto',fontSize:vw(4),color:'grey'}}>{item.item.user_step} шагов</Text>
                        </View>
                      </View>

                    </View>)}



            ></Animated.FlatList>

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

  return bindActionCreators({load_pulse_data:load_pulse_data,load_steps_data:load_steps_data},dispatch)


}

export default connect(mapTo,matchTo)(Statistic);



