import React, { Component } from 'react';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import moment from 'moment'
import Icon from 'react-native-vector-icons/AntDesign'
import {
    Modal,
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    TouchableOpacity, TextInput
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
import axios from "axios";
var notyfy =
[
    {
        "time": "1:00",
        "id": 4,
        "content": "you never die"
    },
    {
        "time": "12:44",
        "id": 3,
        "content": "Сходите ПО писать"
    }
]

const d_width = Dimensions.get('window').width;
const d_height = Dimensions.get('window').height;

class New_Notify extends Component {


    static navigationOptions = {
        header:null,
        headerLeft: null

    };


    constructor(props) {
        super(props);
        this.state = {
            notyfy:[],
            loading:false,
            confirm_menu:false,
            comment:'',
            notify_id:0,
        }
    }
    componentWillUnmount(){

    }

    componentDidUpdate(){


    }
    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        if(prevProps.date!= this.props.date) {
            this.update_data()
        }
    }

    getData(){

    }



    componentDidMount(){
        this.update_data()
    }

    send_notify(){
        this.setState({loading:true,confirm_menu:false},()=>{console.log(this.state)});
        axios.post('http://82.179.9.51:8080/patient/confirm-recommendation',{rec_id:[{id:this.state.notify_id,comment:this.state.comment}]},{headers:{authorization:`Bearer ${this.props.server_data.access_token}`}}).then(res=>{
            this.setState({comment:'',notify_id:0,loading:false},()=>{this.update_data();});
        }).catch(err=>{
            alert('Не удалось отправить рекомендацию');
            this.setState({comment:'',notify_id:0,loading:false})
        })

    }

     async update_data(){
        this.setState({loading:true})
        let cur_date = moment().format('YYYY-MM-DD');
        if(this.props.date){
            cur_date = this.props.date
        }
        let body = {
            start_date:moment(cur_date).format('YYYY-MM-DD'),
            end_date:moment(cur_date).format('YYYY-MM-DD'),
        };
        await axios.post('http://82.179.9.51:8080/patient/info-recommendation',body,{headers:{authorization:`Bearer ${this.props.server_data.access_token}`}}).then(res=>{
            return res.data
        }).then(res=>{
            this.setState({notyfy:res[0].rec},()=>{this.setState({loading:false})});
        }).catch(err=>{
            this.setState({loading:false,notyfy:[]})
        });
    }



    render(){
        if(!this.state.loading){
        return(<View style = {this.props.style}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.confirm_menu}
            >
                <View style = {{flex:1,backgroundColor:'white',justifyContent: "flex-start", alignItems: "center"}}>
                        <View style = {{flex:1}}>
                            <View style = {{flex:1,borderBottomWidth:1,borderColor:'grey',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:vw(90),margin:10}}>
                                <TouchableOpacity onPress = {()=>{this.setState({confirm_menu:false,comment:'',notify_id:0})}} style = {{marginRight:'auto'}}>
                                    <Icon name = 'close' style = {{backgroundColor:'grey',borderRadius:100}} size = {vw(5)}/>
                                </TouchableOpacity>
                                <Text style = {{fontSize:vw(5),fontWeight:'bold'}}>Рекомендация выполнена?</Text>
                                <TouchableOpacity onPress = {()=>{this.send_notify()}} style = {{marginLeft:'auto'}}>
                                    <Icon name = 'mail' size = {vw(5)}/>
                                </TouchableOpacity>
                            </View>
                            <View style = {{flex:6,borderBottomWidth:1,borderColor:'grey',flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',width:vw(90),margin:10}}>
                                <TextInput
                                    style = {{flex:1,fontSize:vw(5)}}
                                    secureTextEntry={false}
                                    placeholder = 'Оставьте свой коментарий'
                                    onChangeText={text => {this.setState({comment:text});console.log(this.state.comment)}}
                                />
                            </View>
                        </View>
                </View>
            </Modal>
            <View style = {{flex:1,marginLeft:10,flexDirection: 'row'}}>
                <Text style = {{fontSize:vw(5),color:'white',fontWeight:'bold'}}>Ваши рекомендации</Text>
                <TouchableOpacity style = {{marginRight:10,alignSelf:'center',marginLeft:'auto'}} onPress = {()=>{this.update_data()}}>
                    <Icon size = {vw(4)} name = 'sync' style = {{color:"white"}}></Icon>
                </TouchableOpacity>
            </View>
            {this.state.notyfy.length>0?
            <View style = {{flex:6}}>
                <ScrollView horizontal = {true} showsHorizontalScrollIndicator = {false}>
                    {this.state.notyfy.map(item=>{
                        let hh = item.time.substr(0,item.time.indexOf(':'))
                        return(<View style = {{flex:1,backgroundColor:'white',marginBottom:10,marginLeft:10,width:vw(48),borderRadius:15,flexDirection:"column",marginTop:10}}>
                                <View style = {{flex:1,backgroundColor:'#EEF4FF',borderTopRightRadius:20,borderTopLeftRadius:20,flexDirection:'row'}}>
                                    <Text style = {{marginTop:'auto',marginLeft:10,fontSize: vw(5.5),color:"grey",fontWeight: 'bold'}}>{item.time}</Text>
                                    {item.need_reminder==0&&(moment().format('HH') - hh == 0)&&(moment().format('YYYY-DD-MM')==moment(this.props.date).format('YYYY-DD-MM'))?<TouchableOpacity onPress  = {()=>{this.setState({confirm_menu:true,notify_id:item.id,comment:''},()=>console.log(this.state))}} style = {{marginLeft:"auto",marginRight:10,alignSelf: 'flex-end',marginBottom:'auto',marginTop:'auto'}}>
                                        <Icon size = {vw(4)} name = 'form'/>
                                    </TouchableOpacity>:null}
                                </View>
                            <View style = {{flex:3}}>
                                <Text style = {{marginBottom:'auto',fontSize:vw(4),marginLeft:10,fontWeight:'bold',color:'#c4c4c4'}}>{item.content}</Text>
                            </View>
                        </View>)
                    })}

                </ScrollView>
            </View>: <View style = {{flex:5,backgroundColor:'white',margin:10,borderRadius:20}}><Text style = {{fontSize:vw(5),color:'black',fontWeight:'bold',textAlign:'center',marginTop:'auto',marginBottom:'auto'}}>Рекомендаций нет.</Text></View>}


        </View>)}else{
            return(<View style = {this.props.style}>
                <View style = {{flex:1,marginLeft:10}}>
                    <Text style = {{fontSize:vw(5),color:'white',fontWeight:'bold'}}>Ваши рекомендации</Text>
                </View>
                <View style = {{flex:4}}>
                    <View style = {{marginTop:'auto',marginBottom:'auto'}}>
                        <ActivityIndicator size={vw(16)} color="white" />
                    </View>
                </View>
            </View>)
        }
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

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default connect(mapTo,matchTo)(New_Notify);