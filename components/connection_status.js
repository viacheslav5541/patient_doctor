import React, { Component } from 'react';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';

import {
    Text,
    View,
    Dimensions,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';


const d_width = Dimensions.get('window').width;
const d_height = Dimensions.get('window').height;

class Connection_status extends Component {


    static navigationOptions = {
        header:null,
        headerLeft: null

    };


    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render(){

        return(<View style = {{flex:3}}>
                <View style = {{backgroundColor:"white",flex:1,marginTop:5,borderRadius:10,marginBottom:5,marginLeft:10,marginRight:10,width:vw(65)}}><Text style = {{textAlign: "center",marginTop:'auto',marginBottom:'auto',fontWeight: 'bold',fontSize:vw(2.9)}}>
                    {this.props.Bluetooth_data.status}
                </Text></View>
        </View>)
    }

}



function mapTo(state){

    return{
        Bluetooth_data:state.Bluetooth_data,
    };
}

function matchTo(dispatch){

    return bindActionCreators({},dispatch)


}

export default connect(mapTo,matchTo)(Connection_status);