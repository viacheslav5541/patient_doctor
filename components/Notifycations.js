import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Swipeable from 'react-native-swipeable-row';
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
import { autorizating } from '../actions/authorization';

const d_width = Dimensions.get('window').width;
const d_height = Dimensions.get('window').height;


const leftContent = <Text>Pull to activate</Text>;
 
const rightButtons = [
  <TouchableHighlight><Text>Button 1</Text></TouchableHighlight>,
  <TouchableHighlight><Text>Button 2</Text></TouchableHighlight>
];


notyfication = [
    {id:1,type:'Напоминание',text:'Покушайте кашку'},
    {id:2,type:'Напоминание',text:'Сходите побегайте'},
    {id:3,type:'Предупреждение',text:'У вас пульс больше нормы'},
    {id:4,type:'Напоминание',text:'Покушайте кашку'},
    {id:5,type:'Напоминание',text:'Сходите ПО писать'},
    {id:6,type:'Предупреждение',text:'У ВАС ПУЛЬС БОЛЬШЕ СОТКИ,ВЫ ЧТО ХОТИТЕ КАК НА УКРАИНЕ?'},
]

export default class Notyfications extends Component{

    constructor(props){
        super(props);
        this.opacityValue = new Animated.Value(0);
        this.state = {
            is_refreshing: false,
            notyfication:notyfication
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
        this.setState({is_refreshing: true});
        setTimeout(() => {
            this.setState({is_refreshing: false});
        }, 3500);
    }
    
    delete_notify = id => {
        const filteredData = this.state.notyfication.filter(item => item.id !== id);
        this.setState({ notyfication: filteredData });
    }
    
    
    
    
    render(){
        const opacity = this.opacityValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 0, 1]
        });
        return(
            <View style = {{flex:5,lexDirection:"column",borderRadius:10,backgroundColor:'#1E88E5',justifyContent:'center',margin:10}}>  
                <View style = {{flex:1}}>
                    <Text style ={{fontFamily:'Roboto',fontSize:24,color:'white',marginTop:"auto"}}>Ваши напоминания</Text>
                </View>
                <View style = {{backgroundColor:"#E1F5FE",flex:5,marginLeft:10,marginRight:10,marginBottom:10,borderRadius:10}}>
                    <FlatList
                        refreshControl = {
                            <RefreshControl 
                                colors={['#1e90ff']}
                                refreshing={this.state.is_refreshing}
                                onRefresh={this.refresh.bind(this)}
                            />
                        }
                        data={this.state.notyfication}
                        renderItem = {(item) => (
                        <Swipeable leftContent={leftContent} rightButtons={rightButtons} onLeftActionRelease = {()=>this.delete_notify(item.item.id)}>
                
                            <Animated.View style={{opacity,backgroundColor:'#E1F5FE'}}>
                                <Text style = {{color:'black',fontWeight:"bold"}}>{item.item.type}</Text>
                                <Text style = {{color:'black'}}>{item.item.text}</Text>
                            </Animated.View>
                        </Swipeable>
                        )}
                    />
                </View>
                
            </View>
        )






    }







}