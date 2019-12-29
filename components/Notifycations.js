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
    TouchableOpacity
  } from 'react-native';



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
        this.state = {
            notyfication:notyfication
        }
    }
    
    delete_notify = id => {
        const filteredData = this.state.notyfication.filter(item => item.id !== id);
        this.setState({ notyfication: filteredData });
    }
    
    
    
    
    render(){
        

        return(
            <View style = {{height:150,borderColor:'red',borderBottomWidth:2,borderTopWidth:2,borderStyle:'dashed'}}>
                <Text style={{textAlign:"center",fontSize:20,backgroundColor:'orange',color:'white'}}>Notifications</Text>
                <FlatList
                    data={this.state.notyfication}
                    renderItem = {(item) => (
                    <Swipeable leftContent={leftContent} rightButtons={rightButtons} onLeftActionRelease = {()=>this.delete_notify(item.item.id)}>
                
                        <View style={{backgroundColor:'white'}}>
                            <Text style = {{color:'black',fontWeight:"bold"}}>{item.item.type}</Text>
                            <Text style = {{color:'black'}}>{item.item.text}</Text>
                        </View>
                    </Swipeable>
                    )}
                />
            </View>
        )






    }







}