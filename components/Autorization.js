import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
    AsyncStorage,
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
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
import ScalingButton from '../test_components/ScalingButton'
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import {auth,get_user_info} from '../actions/server_actions'
import ProgressLoader from "rn-progress-loader";








class HomeScreen extends React.Component {

    static navigationOptions = {
        header:null,



    };

    
    state = {
        login:'',
        password:'',
        loading:false
    }

    auto_login(){
        this.setState({loading:true})
        AsyncStorage.getItem('log_pass').then(res=>{
            console.log(res)
            this.setState({loading:false})
            if(res){
                res = JSON.parse(res)
                this.props.auth(res.log,res.pass,this.props.navigation)
            }
        })
    }
    componentDidMount(){
        // this.props.auth(this.state.login,this.state.password)
        // this.props.navigation.replace('MainNavigator')
        this.auto_login()
    }
    

    render(){
        console.log('hi')
        const {replace} = this.props.navigation;
        this.props.server_data.auth_access && this.props.server_data.autorization_complete?replace('MainNavigator'):null;

        return(


            <View style = {{flex:1,flexDirection:"column",justifyContent:'space-around',alignItems:'center',borderWidth:5,borderColor:"blue",backgroundColor:'#E1F5FE'}}>
                <ProgressLoader
                    visible={this.state.loading}
                    isModal={true} isHUD={true}
                    hudColor={"#000000"}
                    color={"#FFFFFF"} />
                <ProgressLoader
                    visible={this.props.server_data.loading_user_info}
                    isModal={true} isHUD={true}
                    hudColor={"#000000"}
                    color={"#FFFFFF"} />

                <Text style = {{fontSize: vw(8),color:'blue',fontFamily:'Roboto',borderRadius:1,textShadowColor:'rgba(0,0,0,0.25)',textShadowOffset:{width:0,height:4},textShadowRadius:4}}>Войдите пожалуйста</Text>

                <View style = {{height:vh(20),flexDirection:'column',justifyContent:'space-between'}}>
                    <Text style = {{fontSize:vw(3),fontFamily:'Roboto',fontWeight: 'bold',color:'blue'}}>Логин:</Text>
                    <TextInput
                        style = {{width:300,height:40}}
                        underlineColorAndroid = 'blue'
                        multiline
                        numberOfLines={4}
                        onChangeText={text => {this.setState({login:text});console.log(this.state.login)}}
                    />
                    <Text style = {{fontSize:vw(3),fontFamily:'Roboto',fontWeight: 'bold',color:'blue'}}>Пароль:</Text>
                    <TextInput
                        style = {{width:300,height:40}}
                        secureTextEntry={true}
                        underlineColorAndroid = 'blue'
                        numberOfLines={4}
                        onChangeText={text => {this.setState({password:text});console.log(this.state.password)}}

                    />
                </View>
                <TouchableOpacity onPress = {()=>this.props.auth(this.state.login,this.state.password,this.props.navigation)} style = {{borderColor:'blue',borderWidth:2,width:vw(30),height:vh(7),textAlign: 'center',borderRadius:4}}>
                    <Text style={{textAlign:'center',marginTop:"auto",marginBottom:'auto',fontSize:vw(3),fontFamily:'Roboto',fontWeight: 'bold',color:'blue'}}>Войти</Text>
                </TouchableOpacity>
                <View style = {{width:vw(45),height:vh(5)}}>
                    {this.props.server_data.login_error?<View style = {{flex:1,borderRadius:50,borderWidth:2,borderColor:'blue'}}>
                        <Text style = {{textAlign:'center',marginTop:'auto',marginBottom:'auto',color:'blue'}}>Ошибка!</Text>
                    </View>:null}
                </View>




                {/* <ScalingButton
                    
                    // onPress={()=>this.props.autorizating(this.state.login,this.state.password,this.props.patients)}
                /> */}
                {/*<Text>{this.props.active.error}</Text>*/}
                </View>
            
        )
    }
} 



function mapTo(state){

    return{
        server_data:state.server_data

    };
    }

function matchTo(dispatch){

    return bindActionCreators({auth:auth,get_user_info:get_user_info},dispatch)


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