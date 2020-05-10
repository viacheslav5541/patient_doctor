import {GET_USER_INFO,LOGOUT} from "../actions/server_actions";
import {
    UPDATE_STATUS,GET_STEPS,PULSE_UPDATED,DEVICE_CONNECTED_CHANGE,DEVICE_SEARCHING,CHANGE_DEVICE
}from "../actions/bluetooth_actions";
import { BleManager } from "react-native-ble-plx";


function new_manager(){
    return new BleManager()
}

const initialState = {
    manager:new_manager(),
    bluetooth_state_listener:false,
    pulse:0,
    steps:0,
    device:null,
    weight:'?',
    connected_device:false,
    updating_pulse:false,
    listener_on:false,
    device_searching:false,
    status:'',
    devices_list:[],
    setting_screen:false

};

export default function(state = initialState,action){
   
    switch(action.type) {
        case GET_USER_INFO:{
            return {...state,device:action.device,weight:action.payload.weight}
        }
        case UPDATE_STATUS:{
            return {...state,status:action.payload}
        }
        case GET_STEPS:{
            return {...state,steps:action.payload}
        }
        case PULSE_UPDATED:{
            return {...state,pulse:action.payload}
        }
        case DEVICE_CONNECTED_CHANGE:{
            return {...state,connected_device:action.payload}
        }
        case DEVICE_SEARCHING:{
            return {...state,device_searching: action.payload}
        }
        case CHANGE_DEVICE:{
            return {...state,device:action.payload}
        }
        case LOGOUT:{
            return initialState
        }


        default:
            return state;
        
    break;
    }
       
}