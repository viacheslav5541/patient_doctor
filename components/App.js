import React, { Component } from 'react';
import { BleManager } from "react-native-ble-plx"
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from './Autorization';
import Devices from './Devices';
import ProfileScreen from './ProfileScreen';
import Calendar_ from './Calendar'
import Statistic from './Statistic'
import Pulse_chart from './Pulse_chart'
import Steps_chart from './Steps_chart'
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
  Button
} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Icon from 'react-native-vector-icons/AntDesign'





const Chat = () =>{
  return <View></View>
}

const Statistic_Pages = createStackNavigator({
  Statistic:{screen:Statistic},
  Pulse_chart:{screen:Pulse_chart},
  Steps_chart:{screen:Steps_chart}
});

 
const TitlePages = createStackNavigator({
  ProfileScreen: {screen: ProfileScreen},
  Devices: {screen:Devices}
});


const MainNavigator = createBottomTabNavigator({
  Profile:{screen:TitlePages,navigationOptions:{
    tabBarIcon:({tintColor})=>(<Icon style = {{color:tintColor}} size = {50} name = 'user'></Icon>)}},
  Statistic:{screen:Statistic_Pages,navigationOptions:{
    tabBarIcon:({tintColor})=>(<Icon style = {{color:tintColor}} size = {50} name = 'flag'></Icon>)
    }
  },
  Calendar:{screen:Calendar_,navigationOptions:{
    tabBarIcon:({tintColor})=>(<Icon style = {{color:tintColor}} size = {50} name = 'calendar'></Icon>)}},
  Chat:{screen:Chat,navigationOptions:{
    tabBarIcon:({tintColor})=>(<Icon style = {{color:tintColor}} size = {50} name = 'wechat'></Icon>)}},
},
{
  tabBarOptions:{
    showLabel:false,
    activeTintColor:'white',
    
    style:{backgroundColor:'#0D47A1',height:70,borderTopWidth:4,borderTopColor:'black',borderBottomWidth:4},
    
  },
  navigationOptions:{
    header:null
  }
}
);

const Authorization2 = createStackNavigator({
  Authorization:{screen:HomeScreen},
  MainNavigator
})

const App = createAppContainer(Authorization2);

export default App;



const prevGetStateForAction = App.router.getStateForAction;
App.router = {
  ...App.router,
  getStateForAction(action,state){
    if(state&&action.type == 'ReplaceScreen')
    {
      const routes = state.routes.slice(0,state.routes.length-1);
      routes.push(action);
      return
    }
    return prevGetStateForAction(action,state);
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    width: window.width,
    height: window.height
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    margin: 10,
  },
  row: {
    margin: 10
  },
});












