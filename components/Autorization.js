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
import ScalingButton from '../test_components/ScalingButton'









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
        navigate('ProfileScreen');
        {this.props.active.error === 'Проходите пожалуйста'? ()=> navigate('Profile'):null}
        return(
            <View style = {{flex:1,flexDirection:"column",justifyContent:'flex-start',alignItems:'center'}}>
                <TextInput
                    style = {{width:300,height:40}}
                    underlineColorAndroid = 'red'
                    multiline
                    numberOfLines={4}
                    onChangeText={text => {this.setState({login:text});console.log(this.state.login)}}
                />
                <TextInput
                    style = {{width:300,height:40}}
                    underlineColorAndroid = 'red'
                    multiline
                    numberOfLines={4}
                    onChangeText={text => {this.setState({password:text});console.log(this.state.password)}}

                />
                 <ScalingButton 
                    label="Scaling Button"
                    onPress={()=>console.log('')}
                    styles={{button: styles.animated_button, label: styles.button_label}} />


                {/* <ScalingButton
                    
                    // onPress={()=>this.props.autorizating(this.state.login,this.state.password,this.props.patients)}
                /> */}
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



const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 30
    },
    ordinary_button: {
        backgroundColor: '#4caf50',
    },
    animated_button: {
        backgroundColor: '#ff5722' 
    },
    button_label: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    }
});