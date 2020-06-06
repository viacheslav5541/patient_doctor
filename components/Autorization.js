import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
    KeyboardAvoidingView,
    Animated,
    AsyncStorage,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image, Easing
} from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import {auth,get_user_info} from '../actions/server_actions'
import ProgressLoader from "rn-progress-loader";
import Icon from 'react-native-vector-icons/AntDesign'
import {blue} from "color-name";








class Autorization extends React.Component {

    static navigationOptions = {
        header: null,

    };

    constructor(props) {
        super(props);
        this.opacityValue = new Animated.Value(0);
        this.widthvalue = new Animated.Value(0);
        this.colorValue = new Animated.Value(0);
    }

    state = {
        login: '',
        password: '',
        loading: false,
        loginform_on:false,
    }


    auto_login() {
        this.setState({loading: true})
        AsyncStorage.getItem('log_pass').then(res => {
            this.setState({loading: false})
            this.startscreen_on();
            if (res) {
                res = JSON.parse(res)
                this.setState({loading: false})
                this.props.auth(res.log, res.pass, this.props.navigation)

            }
        })
    }

    componentDidMount() {
        this.auto_login();
    }

    startscreen_on(){
        Animated.timing(
            this.opacityValue,
            {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start();
        setTimeout(() => Animated.timing(
            this.widthvalue,
            {
                toValue: 1,
                duration: 400,
                easing: Easing.linear,
            }
        ).start(), 2300)
    }
    loginform_on() {
        Animated.timing(
            this.widthvalue,
            {
                toValue: 0,
                duration: 300,
                easing: Easing.linear,
            }
        ).start();
        setTimeout(() => Animated.timing(
            this.opacityValue,
            {
                toValue: 0,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start(), 400);


        setTimeout(()=>Animated.timing(
            this.colorValue,
            {
                toValue: 1,
                duration: 500,
                easing: Easing.linear,
            }
        ).start(),1500)
        setTimeout(()=>this.setState({loginform_on:true}),2000);


    }
    

    render(){
        const opacity = this.opacityValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.5, 1]
        });
        const {replace} = this.props.navigation;
        this.props.server_data.auth_access && this.props.server_data.autorization_complete?replace('MainNavigator'):null;
        const scale = this.opacityValue.interpolate({
            inputRange: [0,0.5,1],
            outputRange: [1000,500,0],
            extrapolate: 'clamp',
        });
        const scale2 = this.opacityValue.interpolate({
            inputRange: [0,0.2,0.5,0.7,1],
            outputRange: [3000,2000,1000,600,0],
            extrapolate: 'clamp',
        });
        const changing_width = this.widthvalue.interpolate({
            inputRange: [0,1],
            outputRange: [0,vw(50)]
        });
        const changing_font = this.widthvalue.interpolate({
            inputRange: [0,0.4,0.8,1],
            outputRange: [0,vw(1),vw(2),vw(3)]
        });
        const changing_color = this.colorValue.interpolate({
            inputRange: [0,1],
            outputRange: ['#2979FF',"white"]
        });

        return(
            <View style = {{flex:1}}>
                {!this.state.loginform_on?
            <Animated.View style = {{flex:1,flexDirection:"column",justifyContent:'flex-start',alignItems:'center',backgroundColor:changing_color}}>
                {/*<ProgressLoader*/}
                {/*    visible={this.state.loading}*/}
                {/*    isModal={true} isHUD={true}*/}
                {/*    hudColor={"#000000"}*/}
                {/*    color={"#FFFFFF"} />*/}
                <ProgressLoader
                    visible={this.props.server_data.loading_user_info}
                    isModal={true} isHUD={true}
                    hudColor={"#000000"}
                    color={"#FFFFFF"} />
                <Image source={require('../icons/volna1.png')} style = {{position:'absolute',bottom:0,left:0,width:vw(40),height:vw(40)}}></Image>
                <Image source={require('../icons/volna2.png')} style = {{position:'absolute',bottom:0,left:0,width:vw(40),height:vw(40)}}></Image>
                <Image source={require('../icons/volna1.png')} style = {{position:'absolute',top:0,right:0,width:vw(40),height:vw(40),transform: [{ rotate: '180deg'}]}}></Image>
                <Image source={require('../icons/volna2.png')} style = {{position:'absolute',top:0,right:0,width:vw(40),height:vw(40),transform: [{ rotate: '180deg'}]}}></Image>

                <Animated.View style ={{opacity,alignSelf:'flex-start'}}>
                    <Image style = {{width:vw(70),height:vw(70)}} source={require('../icons/vrach.png')}/>
                </Animated.View>
                <Animated.View style = {{transform: [{ translateY:scale}]}}>
                    <Text style = {{fontWeight: "bold",color:"white",fontSize: vw(6),alignSelf:'center',whiteSpace:"pre-wrap"}}>
                        Добро пожаловать
                    </Text>
                    <Text style = {{fontWeight: "bold",color:"white",fontSize: vw(6),alignSelf:'center',whiteSpace:"pre-wrap"}}>
                        в PatientDoctor
                    </Text>
                </Animated.View>
                <Animated.View style = {{marginTop:20,transform: [{ translateY:scale2}]}}>
                    <Text style = {{textAlign:'center',width:vw(70),color: "#8ACAFF",fontSize:vw(3)}}>Cистема мониторинга состояния вашего здоровья и активностей поможет всегда быть начеку! </Text>
                </Animated.View>
                <TouchableOpacity onPress = {()=>this.loginform_on()}><Animated.View style = {{marginTop:50,width:changing_width,height:vh(7),backgroundColor:'white',borderRadius:100}}><Animated.Text style = {{color:"#2979FF",textAlign:'center',marginTop:'auto',marginBottom:'auto',fontSize:changing_font,fontWeight:'bold'}}>
                    Начать сейчас
                </Animated.Text></Animated.View></TouchableOpacity>
                </Animated.View>:
                <KeyboardAvoidingView style = {{flex:1,backgroundColor:'white'}}>
                    <ProgressLoader
                        visible={this.props.server_data.loading_user_info}
                        isModal={true} isHUD={true}
                        hudColor={"#000000"}
                        color={"#FFFFFF"} />
                    <Image source={require('../icons/volna1.png')} style = {{position:'absolute',bottom:0,left:0,width:vw(40),height:vw(40)}}></Image>
                    <Image source={require('../icons/volna2.png')} style = {{position:'absolute',bottom:0,left:0,width:vw(40),height:vw(40)}}></Image>
                    <Image source={require('../icons/volna1.png')} style = {{position:'absolute',top:0,right:0,width:vw(40),height:vw(40),transform: [{ rotate: '180deg'}]}}></Image>
                    <Image source={require('../icons/volna2.png')} style = {{position:'absolute',top:0,right:0,width:vw(40),height:vw(40),transform: [{ rotate: '180deg'}]}}></Image>

                    <View style = {{flex:1,flexDirerection:"column",justifyContent:'center',alignItems:'center'}}>

                        <Text style = {{textAlign:'center',fontSize: vw(8),color:'#2774F5',fontFamily:'Roboto',borderRadius:1,fontWeight:'bold',marginBottom:'auto',marginTop:'auto'}}>{`Войдите\nв систему`}</Text>

                        <View style = {{marginBottom:'auto',height:vh(20),flexDirection:'column',justifyContent:'space-between',alignItems:'center'}}>

                            <View style = {{width:vw(50),height:vh(7),borderRadius:100,borderWidth:1,borderColor:!this.props.server_data.login_error?'#2774F5':'red',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                <Icon name = 'user' size = {vw(5)} style = {{color:'blue',marginLeft:20}}/>
                                <TextInput
                                    style = {{width:300,height:40,marginLeft:20}}
                                    placeholder = 'Логин'
                                    multiline
                                    numberOfLines={4}
                                    onChangeText={text => {this.setState({login:text});console.log(this.state.login)}}
                                />
                            </View>
                            <View style = {{marginTop:20,width:vw(50),height:vh(7),borderRadius:100,borderWidth:1,borderColor:!this.props.server_data.login_error?'#2774F5':'red',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                <Icon name = 'lock' size = {vw(5)} style = {{color:'blue',marginLeft:20}}/>
                                <TextInput
                                    style = {{width:300,height:40,marginLeft:20}}
                                    secureTextEntry={true}
                                    placeholder = 'Пароль'
                                    numberOfLines={4}
                                    onChangeText={text => {this.setState({password:text});console.log(this.state.password)}}
                                />
                            </View>
                            <View style = {{width:vw(45),height:vh(5)}}>
                                {this.props.server_data.login_error?<View style = {{flex:1}}>
                                    <Text style = {{textAlign:'center',marginTop:'auto',marginBottom:'auto',color:'red'}}>Ошибка!</Text>
                                </View>:null}
                            </View>
                        </View>
                        <TouchableOpacity onPress = {()=>this.props.auth(this.state.login,this.state.password,this.props.navigation)} style = {{width:vw(40),height:vh(7),textAlign: 'center',borderRadius:100,marginBottom:'auto',backgroundColor:"#2979FF"}}>
                            <Text style={{textAlign:'center',marginTop:"auto",marginBottom:'auto',fontSize:vw(3),fontFamily:'Roboto',fontWeight: 'bold',color:'white'}}>Войти</Text>
                        </TouchableOpacity>

                    </View>
                </KeyboardAvoidingView>}</View>

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

export default connect(mapTo,matchTo)(Autorization);



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