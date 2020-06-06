
import React, { Component } from 'react';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {
    Text,
    View,
    FlatList,
    Dimensions,
    Animated,
    Easing,
    RefreshControl
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {load_steps_data} from "../actions/server_actions";
import moment from 'moment'
const d_width = Dimensions.get('window').width;
const d_height = Dimensions.get('window').height;

const needSteps = 3000

class Steps_chart extends Component {


    static navigationOptions = {
        header:null,
        headerLeft: null

    };
    steps = this.props.Bluetooth_data.steps;


    constructor(props) {
        super(props);
        this.opacityValue = new Animated.Value(0);
        this.state = {
            done:false,
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
        this.props.load_steps_data()
    }

    render(){
        const opacity = this.opacityValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 0, 1]
        });
        return(
            <View style = {{flex:1}}>
                <View style = {{flex:1,backgroundColor:'#2979FF',flexDirection:'row'}}>
                    <View style = {{flex:2,flexDirection:'column',justifyContent:'space-around',alignItems:'center'}}>
                    <AnimatedCircularProgress
                        backgroundWidth={12}
                        rotation={0}
                        lineCap={'round'}
                        duration={3000}
                        size={vw(25)}
                        width={13}
                        fill={this.steps/needSteps*100}
                        tintColor="#A5C9FF"
                        onAnimationComplete={() => this.setState({done:true})}
                        backgroundColor="white"
                        style={{}}
                    >
                        {(fill)=>{return (<Text style ={{fontFamily:'Roboto',fontSize:vw(7),color:"#BED7FF"}}>{Math.floor(needSteps/100*(fill))}</Text>)
                        }}
                    </AnimatedCircularProgress>
                        <Text style = {{fontSize: vw(4),fontFamily:'Roboto',color:'#BED7FF'}}>Шагов за сегодня</Text>
                    </View>
                    <View style = {{flex:2,justifyContent:'center',marginBottom:vw(15)}}>
                        {this.state.done?<View><Text style = {{fontSize:vw(4.5), color:'#BED7FF'}}>Шагов до цели:{needSteps-this.steps>0?needSteps:0}</Text>
                        </View>:null}
                    </View>
                </View>
                <Animated.View style = {{opacity,flex:3}}>
                    <FlatList
                        refreshControl = {
                            <RefreshControl
                                colors={['#1e90ff']}
                                refreshing={this.props.server_data.steps_loading}
                                onRefresh={this.refresh.bind(this)}
                            />
                        }
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
                    ></FlatList>
                </Animated.View>

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

    return bindActionCreators({load_steps_data:load_steps_data},dispatch)


}

export default connect(mapTo,matchTo)(Steps_chart);