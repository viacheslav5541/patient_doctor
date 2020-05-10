import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
// import Swipeable from 'react-native-swipeable-row';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon2 from 'react-native-vector-icons/AntDesign'

import moment from 'moment'
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
    Easing,
    RefreshControl,
    Animated
  } from 'react-native';
import axios from "axios";

const d_width = Dimensions.get('window').width;
const d_height = Dimensions.get('window').height;

var swipeable = null;


var notyfy
// [
//     // {
//     //     "time": "1:00",
//     //     "id": 4,
//     //     "content": "you never die"
//     // },
//     // {
//     //     "time": "12:44",
//     //     "id": 3,
//     //     "content": "Сходите ПО писать"
//     // }
// ]

notyfication = [
    {id:1,type:'Напоминание',text:'Покушайте кашку'},
    {id:2,type:'Напоминание',text:'Сходите побегайте'},
    {id:3,type:'Предупреждение',text:'У вас пульс больше нормы'},
    {id:4,type:'Напоминание',text:'Покушайте кашку'},
    {id:5,type:'Напоминание',text:'Сходите ПО писать'},
    {id:6,type:'Предупреждение',text:'У ВАС ПУЛЬС БОЛЬШЕ СОТКИ,ВЫ ЧТО ХОТИТЕ КАК НА УКРАИНЕ?dfklsdfldsjfkljklsJFKLJ;KLSDAJFKLSJKLFJLKDJFLKJDS;LKFJ;slkdjfkldsfJKF'},
];

class Notyfications extends Component{

    constructor(props){
        super(props);
        this.opacityValue = new Animated.Value(0);
        this.opacityValue2 = new Animated.Value(0);
        this.state = {
            is_refreshing: false,
            notyfication:notyfy,

        }
    }
    style = this.props.style
    opacity2() {
        this.opacityValue2.setValue(0);
        Animated.timing(
            this.opacityValue2,
            {
                toValue: 1,
                duration: 500,
                easing: Easing.bounce,
                useNativeDriver:true


            }
        ).start();
        // setTimeout(()=>{this.opacityValue2.setValue(0)},1000)
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        if(prevProps.date!= this.props.date){
            this.opacityValue.setValue(0);
            this.update_data()
        }
    }
    componentWillUnmount(): void {
        console.log('notifyunmount')
    }

    opacity() {

        Animated.timing(
          this.opacityValue,
          {
                toValue: 0,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver:true
          }
        ).start();
    }
    refresh() {
        this.opacity();
        AsyncStorage.setItem(`notify_data ${this.props.server_data.user_id}`,'').then(res=>{this.update_data();})

        this.setState({is_refreshing: true});
        setTimeout(() => {
            this.setState({is_refreshing: false});
        }, 3500);
    }

    async update_data(){
        let kek = await AsyncStorage.getItem(`notify_data ${this.props.server_data.user_id}`)
        if(kek){
        kek = JSON.parse(kek)}
        else{kek = []}

        let cur_data;
        let cur_date = moment().format('YYYY-MM-DD');
        if(this.props.date){
            cur_date = this.props.date
        }
        let body = {
            start_date:'2020-04-1',
            end_date:'2020-05-1'
        }

        let keksik = await axios.post('http://82.179.9.51:8080/patient/info-recommendation',body,{headers:{authorization:`Bearer ${this.props.server_data.access_token}`}}).then(res=>{
            return res.data
        }).then(res=>{
            AsyncStorage.setItem(`Notifycations ${this.props.server_data.user_id}`,JSON.stringify(res));
            return res
        }).catch(err=>{
           return 'err'
        })
        if(keksik == 'err'){
           let keksik2 = await AsyncStorage.getItem(`Notifycations ${this.props.server_data.user_id}`);
            cur_data = JSON.parse(keksik2);
        }else{
            cur_data = keksik
        }
        cur_data.map(item=>{
            if(item.date == cur_date){
                let sending = []
                item.rec.map(item=>{
                    if(!kek.includes(item.id)){
                        if(moment().format('YYYY-MM-DD') == moment(this.props.date).format('YYYY-MM-DD')){
                            let hh = item.time.substr(0,item.time.indexOf(':'));
                            if(hh - moment().format('HH')>=-1)
                            sending.push(item)
                        }else{sending.push(item)}
                    }
                })
                this.setState({notyfication:sending})
                this.opacityValue2.setValue(0);
                // this.opacityValue.setValue(1);
                Animated.timing(
                    this.opacityValue,
                    {
                        toValue: 1,
                        duration: 1500,
                        easing: Easing.linear,
                        useNativeDriver:true
                    }
                ).start();
                if(this.state.is_refreshing){
                    this.setState({is_refreshing:false})
                }


            }
        })


    }

    componentDidMount(): void {

        this.update_data()
        // AsyncStorage.setItem(`notify_data ${this.props.server_data.user_id}`,'').then(res=>{

        // })
    // console.log(this.props.date)
    }


    renderLeftActions = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [0,d_width/10],
            outputRange: [0,d_width/20],
            extrapolate: 'clamp',
        });
        const opacity2 = this.opacityValue2.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });

        const scale2 = this.opacityValue2.interpolate({
            inputRange: [0, 1,1],
            outputRange: [0, 1,4]
        });
        const scale3 = this.opacityValue2.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '370deg']
        });

        return (
            <View style={styles.leftAction}>
                <Animated.View style={[{ transform: [{ translateX:scale }] }]}>
                    <Text style = {{fontSize:vw(4),color:"white",marginTop:'auto',marginBottom:'auto'}}>Выполнено</Text>
                </Animated.View>
                <Animated.View style = {[{marginLeft:'auto',alignSelf:'center',marginRight:20,opacity:opacity2},{
                    transform:[{scale:scale2,rotate:scale3}]
                }]}>
                    <Icon2 style = {{color:'white'}} size = {vw(5)} name = 'checkcircleo'/>
                </Animated.View>



            </View>
        );
    };
     async send_notify_id(id){
        let sending_data = [];
        let kek = await AsyncStorage.getItem(`notify_data ${this.props.server_data.user_id}`);
        if(kek) {
            sending_data = JSON.parse(kek);
        }
        sending_data.push(id);
        axios.post('http://82.179.9.51:8080/patient/confirm-recommendation',{rec_id:sending_data},{headers:{authorization:`Bearer ${this.props.server_data.access_token}`}}).then(res=>{
           return  AsyncStorage.setItem(`notify_data ${this.props.server_data.user_id}`,'')
        }).then(res=>{
            this.update_data()
        }).catch(err=>{
            AsyncStorage.setItem(`notify_data ${this.props.server_data.user_id}`,JSON.stringify(sending_data)).then((res)=>{
                this.update_data()
            })

        })
         // this.update_data()
    }

    
    render(){
        console.log('15'-'00')
        // console.log(this.state.data,this.props.server_data.notifycation)
        const opacity = this.opacityValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0, 1]
        });
        let timeanimation = new Animated.Value(0);


        if(this.state.notyfication&&this.state.notyfication.length>0){
        return(

            <View style = {this.props.style}>
                <View style = {{flex:1}}>
                    <Text style ={{marginLeft:10,fontFamily:'Roboto',fontSize:24,color:'white',marginTop:"auto",marginBottom:'auto'}}>Ваши напоминания</Text>
                </View>
                <View style = {{backgroundColor:"#E1F5FE",flex:5,marginLeft:10,marginRight:10,marginBottom:10}}>
                    <FlatList
                        refreshControl = {
                            <RefreshControl
                                colors={['#1e90ff']}
                                refreshing={this.state.is_refreshing}
                                onRefresh={this.refresh.bind(this)}
                            />
                        }
                        data={this.state.notyfication}
                        renderItem = {(item) => {
                            let hh = item.item.time.substr(0,item.item.time.indexOf(':'))
                            // let hh=item.item.time[0]+item.item.time[1]
                            if((moment().format('HH') - hh == 1 || moment().format('HH') - hh == -1 || moment().format('HH') - hh == 0)&&(moment().format('YYYY-DD-MM')==moment(this.props.date).format('YYYY-DD-MM'))){
                            return(
                            <Swipeable renderLeftActions={this.renderLeftActions} onSwipeableLeftOpen={() => {
                                this.opacity2();
                                setTimeout(() => this.send_notify_id(item.item.id), 500)
                            }}>
                                <Animated.View style={{opacity, backgroundColor: '#E1F5FE'}}>
                                    <View style={{

                                        borderBottomWidth: 2,
                                        borderColor: "grey",
                                        marginTop: 2,
                                        borderRadius: 5
                                    }}>
                                        <Text style={{

                                            marginLeft:5,
                                            color: 'black',
                                            fontWeight: "bold",
                                            fontSize: vw(2)
                                        }}>{item.item.time}</Text>
                                        <Text style={{
                                            marginLeft:5,
                                            color: 'black',
                                            marginBottom: 5,
                                            fontSize: vw(4.2)
                                        }}>{item.item.content}</Text>
                                        <Animated.View style = {[{position: 'absolute', top: 0,  right: 5, bottom: 0, justifyContent: 'center', alignItems: 'center'}]}><Icon2 size = {vw(5)} style = {{color:"grey"}} name = 'clockcircleo'/></Animated.View>
                                    </View>
                                </Animated.View>
                            </Swipeable>)}else{return (<Swipeable onSwipeableLeftOpen={() => {
                                this.opacity2();
                                setTimeout(() => this.send_notify_id(item.item.id), 500)
                            }}>
                                <Animated.View style={{opacity, backgroundColor: '#E1F5FE'}}>
                                    <View style={{
                                        borderBottomWidth: 2,
                                        borderColor: "grey",
                                        marginTop: 2,
                                        borderRadius: 5
                                    }}>
                                        <Text style={{
                                            marginLeft:5,
                                            color: 'black',
                                            fontWeight: "bold",
                                            fontSize: vw(2)
                                        }}>{item.item.time}</Text>
                                        <Text style={{
                                            marginLeft:5,
                                            color: 'black',
                                            marginBottom: 5,
                                            fontSize: vw(4.2)
                                        }}>{item.item.content}</Text>
                                    </View>
                                </Animated.View>
                            </Swipeable>)}
                        }}
                    />
                </View>
                
            </View>

        )}else return(
            <View style = {this.props.style}>
            <View style = {{flex:1}}>
                <Text style ={{marginLeft:10,fontFamily:'Roboto',fontSize:24,color:'white',marginTop:"auto",marginBottom:'auto'}}>Ваши напоминания</Text>
            </View>
                <View style = {{backgroundColor:"#E1F5FE",flex:5,marginLeft:10,marginRight:10,marginBottom:10}}>
                    <Text style = {{alignSelf: 'center',marginTop:'auto',marginBottom:'auto',fontSize:vw(5),color:'grey'}}>Нет напоминаний</Text>
                </View>
            </View>)
    }
}



function mapTo(state){

    return{
        server_data:state.server_data

    };
}

function matchTo(dispatch){

    return bindActionCreators({},dispatch)


}

export default connect(mapTo,matchTo)(Notyfications);


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    text: {
        color: '#4a4a4a',
        fontSize: 15,
    },
    separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#e4e4e4',
        marginLeft: 10,
    },
    leftAction: {
        backgroundColor: '#02c2f7',
        justifyContent:"flex-end",
        flex:1,
        flexDirection:'row',


    },
    rightAction: {
        backgroundColor: '#dd2c00',
        justifyContent: 'center',
        // flex: 1,
        alignItems: 'flex-end',
    },
    actionText: {
        color: '#fff',
        fontWeight: '600',
        padding: 20,
    },
});
