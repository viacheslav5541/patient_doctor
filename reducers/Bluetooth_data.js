import {
    CONNECTING, 
    CONNECTING_ERROR,
    UPDATE_PULSE,
    LISTENER_ON ,
    PULSE_UPDATED, 
    GET_STEPS ,
    DEVICE_SEARCHING ,
    CONNECTING_TO_DEVICE,
    DEVICE_CONNECTED, 
    REMOVE_LISTENER,
    DISCONNECT, 
    DEVICE_DISCONNECTED, 
    SET_PULSE_LISTENER, 
    REMOVE_PULSE_LISTENER,
    SET_CHECK_LISTENER, 
    REMOVE_CHECK_LISTENER, 
    STEPS_UPDATED, 
    STATUS_UPDATE
} from '../actions/bluetooth_actions'
import { BleManager } from "react-native-ble-plx";
import {AsyncStorage} from 'react-native';

const manager = new BleManager();


const initialState = {
    manager:manager,
    isConnected:false,
    pulse:0,
    steps:0,
    device:'CA:47:06:C9:FD:3A',
    weight:100,
    connected_device:null,
    updating_pulse:false,
    listener_on:false,
    profile_status:'',
    settings_status:'',
    device_connecting:false,
    device_searching:false,
    status:''
}

export default function(state = initialState,action){
   
    switch(action.type) {
        case CONNECTING:
            {
                return {...state,isConnected : true,connected_device:action.payload.device}
                
            }
        case CONNECTING_ERROR:
            {
                return {...state,error:action.payload}
            }
        case UPDATE_PULSE:
            {
                return {...state,updating_pulse:true}
            }

        case PULSE_UPDATED:
            {
                return {...state,pulse:action.payload,updating_pulse:false}
            }
        case LISTENER_ON:
            {
                return {...state,listener_on:true}
            }
        case GET_STEPS:
            {
                return {...state,steps:action.payload}
            }
        case DEVICE_SEARCHING:
            {   
                if (action.message){
                    return {...state,device_searching:action.payload,status:action.message}
                } else return {...state,device_searching:action.payload}
                
            }
        case STATUS_UPDATE:
            {
                return{...state,status:action.payload}
            }
        case CONNECTING_TO_DEVICE:
            {
                if (action.message){
                    return {...state,device_connecting:action.payload,status:action.message}
                } else return {...state,device_connecting:action.payload}
            }
        case DEVICE_CONNECTED:
            {
                return{...state,connected_device:action.payload,device_connecting:false}
            }
        case REMOVE_LISTENER:
            {
                return{...state,listener_on:false}
            }
        case DISCONNECT:
            {
                return {...state,}
            }
        
            
            
        default:
            return state;
        
    break;
        


    }
       
}