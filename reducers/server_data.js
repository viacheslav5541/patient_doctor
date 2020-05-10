import {
    GET_USER_INFO,
    LOADING_DATA,
    AUTH_COMPLETE,
    AUTH_FAILED,
    NEXT_SCREEN,
    UPDATE_PULSE_DATA,
    LOADING_PULSE_DATA,
    LOADING_STEPS_DATA,
    UPDATE_STEPS_DATA,
    NOTIFY_UPDATED,NAVIGATION_SET,LOGIN_STATUS,LOGOUT




} from "../actions/server_actions";

const initialState = {
    user_id:null,
    auth_access:null,
    access_token:null,
    refresh_token:null,
    loading_user_info:false,
    height:null,
    weight:null,
    device:null,
    autorization_complete:false,
    pulse_loading:false,
    pulse_data:null,
    steps_data:null,
    steps_loading:false,
    notifycation: null,
    navigation:null,
    login_error:false


};




export default function(state = initialState,action){
    switch (action.type) {
        case GET_USER_INFO:{
            return {...state,user_id: action.payload.id}
        }
        case LOADING_DATA:{
            return {...state,loading_user_info:action.payload}
        }
        case AUTH_COMPLETE:{
            return {...state,access_token:action.data.accessToken,refresh_token:action.data.refreshToken,auth_access:action.access}
        }
        case AUTH_FAILED:{
            return {...state,auth_access:action.access}
        }
        case NEXT_SCREEN:{
            return {...state,autorization_complete:true}
        }
        case UPDATE_PULSE_DATA:{
            return {...state,pulse_data:action.payload}
        }
        case LOADING_PULSE_DATA:{
            return {...state,pulse_loading:action.payload}
        }
        case UPDATE_STEPS_DATA:{
            return {...state,steps_data:action.payload}
        }
        case LOADING_STEPS_DATA:{
            return {...state,steps_loading:action.payload}
        }
        case NOTIFY_UPDATED:{
            return {...state,notifycation:action.payload}
        }
        case NAVIGATION_SET:{
            return {...state,navigation:action.payload}
        }
        case LOGIN_STATUS:{
            return {...state,login_error:action.error}
        }
        case LOGOUT:{
            return initialState
        }


        default:return state;
    break;


    }
}
