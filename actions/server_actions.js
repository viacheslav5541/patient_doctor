import {bluetooth_controller,update_status,full_disconnect} from "./bluetooth_actions";
import axios from 'axios'
import { StackActions, NavigationActions } from 'react-navigation';
import moment from 'moment'
import {AsyncStorage} from 'react-native'
export const GET_USER_INFO = 'GET_USER_INFO';
export const LOADING_DATA = 'LOADING_DATA';
export const AUTH_COMPLETE = 'AUTH_COMPLETE';
export const AUTH_FAILED = 'AUTH_FAILED';
export const NEXT_SCREEN = 'NEXT_SCREEN';
export const UPDATE_PULSE_DATA = 'UPDATE_PULSE_DATA';
export const UPDATE_STEPS_DATA = 'UPDATE_STEPS_DATA';
export const LOADING_PULSE_DATA = 'LOADING_PULSE_DATA';
export const LOADING_STEPS_DATA = 'LOADING_STEPS_DATA';
export const NOTIFY_UPDATED = 'NOTIFY_UPDATED'
export const NAVIGATION_SET = 'NAVIGATION_SET'
export const LOGIN_STATUS = 'LOGIN_STATUS'
export const LOGOUT = 'LOGOUT'
const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'Authorization' }),
    ],
});



export function loading_status(status){
    return {
        type:LOADING_DATA,
        payload:status
    }
}

export function load_steps_data(){
    return function(dispatch,getState){
        dispatch({type:LOADING_STEPS_DATA,payload:true});
        AsyncStorage.getItem(`steps_storage ${getState().server_data.user_id}`).then(res=>{
            dispatch({type:UPDATE_STEPS_DATA,payload:JSON.parse(res)})
            dispatch({type:LOADING_STEPS_DATA,payload:false});
        })
    }
}

export function load_pulse_data(){
    return function(dispatch,getState){
        dispatch({type:LOADING_PULSE_DATA,payload:true});
        AsyncStorage.getItem(`pulse_storage ${getState().server_data.user_id}`).then(res=>{
            setTimeout(()=>{
            dispatch({type:UPDATE_PULSE_DATA,payload:JSON.parse(res)})
            dispatch({type:LOADING_PULSE_DATA,payload:false});},2000);
        })
    }
}


export async function send_steps(steps,token,id){
    let sending_data = [];
    let storage_data = []
    let steps_data = await AsyncStorage.getItem(`steps_data ${id}`);
    let steps_storage = await AsyncStorage.getItem(`steps_storage ${id}`);
    if(steps_storage){
        storage_data = JSON.parse(steps_storage)
    }
    storage_data.length > 250?storage_data.pop():null;
    storage_data.unshift({date:moment().format('YYYY-MM-DD HH:mm'),user_step:steps});
    await AsyncStorage.setItem(`steps_storage ${id}`,JSON.stringify(storage_data));
    if(steps_data) {
        sending_data = JSON.parse(steps_data);
    }
    sending_data.push({date:moment().format('YYYY-MM-DD HH:mm'),user_step:steps});
    axios.post('http://82.179.9.51:8080/send_step',sending_data,{headers:{authorization:`Bearer ${token}`}}).then(res=>{
        AsyncStorage.setItem(`steps_data ${id}`,'')
    }).catch(err=>{
        AsyncStorage.setItem(`steps_data ${id}`,JSON.stringify(sending_data))
    })
}


export async function send_pulse(pulse,token,id){
    let sending_data = [];
    let storage_data = []
    let pulse_data = await AsyncStorage.getItem(`pulse_data ${id}`);
    let pulse_storage = await AsyncStorage.getItem(`pulse_storage ${id}`);
    if(pulse_storage){
        storage_data = JSON.parse(pulse_storage)
    }
    storage_data.length > 250?storage_data.pop():null;
    storage_data.unshift({date:moment().format('YYYY-MM-DD HH:mm'),user_pulse:pulse});
    await AsyncStorage.setItem(`pulse_storage ${id}`,JSON.stringify(storage_data));
    if(pulse_data) {
        sending_data = JSON.parse(pulse_data);
    }
    sending_data.push({date:moment().format('YYYY-MM-DD HH:mm'),user_pulse:pulse});
    axios.post('http://82.179.9.51:8080/send_pulse',sending_data,{headers:{authorization:`Bearer ${token}`}}).then(res=>{
        AsyncStorage.setItem(`pulse_data ${id}`,'')
    }).catch(err=>{
        AsyncStorage.setItem(`pulse_data ${id}`,JSON.stringify(sending_data))
    })
}


export function auth(login,password,navigation = null){
    return function(dispatch){
        dispatch({type:LOGIN_STATUS,error:false})
        navigation?dispatch({type:NAVIGATION_SET,payload:navigation}):null;
        dispatch(loading_status(true));
        axios.post('http://82.179.9.51:8080/login',{login:login,password:password}).then(res=>{
            dispatch({type:AUTH_COMPLETE,data:res.data,access:true});
            dispatch(loading_status(false));
            dispatch(get_user_info())
            AsyncStorage.setItem('log_pass',JSON.stringify({log:login,pass:password}))
        }).catch(err=>{
            dispatch({type:LOGIN_STATUS,error:true})
            dispatch({type:AUTH_FAILED,access:false,data:null});
            dispatch(loading_status(false));
        })
    }

}

export function logout(navigation){
    return function(dispatch,getState){
        var server_data = getState().server_data.navigation
        dispatch(full_disconnect())
        dispatch({type:LOGOUT})
        AsyncStorage.setItem('log_pass','').then(res=>{
            dispatch(full_disconnect())
            server_data.dispatch(resetAction)


        })




    }
}

function getDevice(res){
    return function(dispatch){
        AsyncStorage.getItem('device').then(device=>{
            if(device){
                dispatch({type:GET_USER_INFO,payload:res,device:device});
            }else{
                dispatch({type:GET_USER_INFO,payload:res,device:res.mac_address});
            }
            dispatch(loading_status(false));
            dispatch({type:NEXT_SCREEN});

        })
    }

}

export function get_user_info(){
    return function(dispatch,getState){
        dispatch(loading_status(true));
        axios.get("http://82.179.9.51:8080/patient/info/",{headers:{authorization:`Bearer ${getState().server_data.access_token}`}}).then(res=>{

            dispatch(getDevice(res.data));
            // dispatch({type:GET_USER_INFO,payload:res[0]});
        }).catch(err=>{
            // setTimeout(()=>{dispatch(bluetooth_controller('search'));dispatch(loading_status(false))},2000);

            dispatch(loading_status(false));
            dispatch({type:LOGIN_STATUS,error:true})
            // dispatch({type:NEXT_SCREEN});
        })
    }
}
