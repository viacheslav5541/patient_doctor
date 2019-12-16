
const initialState = {
    isConnected:false,
    pulse:0,
    steps:1488228,
    device:'',
    weight:100,
    connected_device:null
}

export default function(state = initialState,action){
   
    switch(action.type) {
        case "device_connected":
            {
                return {...state,isConnected : action.payload.message,connected_device:action.payload.device}
                
            }
        case 'pulse_updated':{
            return {...state,pulse:action.payload}
        }
            
            
        default:
            return state;
        
    break;
        


    }
       
}