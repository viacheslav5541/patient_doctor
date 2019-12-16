import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
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
    TextInput
  } from 'react-native';
import {autorizating} from '../actions/authorization';









class HomeScreen extends React.Component {

    static navigationOptions = {
        title: 'Autorization',
    };

    
    state = {
        login:'',
        password:''
    }

    componentDidMount(){
        

    }
    

    render(){
        
        const {navigate} = this.props.navigation;
        
        {this.props.active.error === 'Проходите пожалуйста'? navigate('Profile'):null}
        return(
            <View>
                <TextInput
                    underlineColorAndroid = 'red'
                    multiline
                    numberOfLines={4}
                    onChangeText={text => {this.setState({login:text});console.log(this.state.login)}}
                />
                <TextInput
                    underlineColorAndroid = 'red'
                    multiline
                    numberOfLines={4}
                    onChangeText={text => {this.setState({password:text});console.log(this.state.password)}}

                />
                <Button 
                    title = 'Login' 
                    onPress={()=>this.props.autorizating(this.state.login,this.state.password,this.props.patients)}
                />
                <Text>{this.props.active.error}</Text>
                </View>
            
        )
    }
} 



function mapTo(state){

    return{
        patients:state.patients,
        doctor:state.doctors,
        active:state.active
    };
    }

function matchTo(dispatch){
    
    return bindActionCreators({autorizating:autorizating},dispatch)
    
    
    }

export default connect(mapTo,matchTo)(HomeScreen);