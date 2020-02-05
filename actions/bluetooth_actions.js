import consts  from '../Const/services_characteristics';
import { Buffer } from 'buffer';

var device_dis_listener,pulse_listener;


export const UPDATE_PULSE = 'UPDATE_PULSE';
export const LISTENER_ON = "LISTENER_ON";
export const PULSE_UPDATED = 'PULSE_UPDATED';
export const GET_STEPS = 'GET_STEPS';
export const DEVICE_SEARCHING = 'DEVICE_SEARCHING';
export const CONNECTING_TO_DEVICE = 'CONNECTING_TO_DEVICE';
export const DEVICE_CONNECTED = 'DEVICE_CONNECTED';
export const DISCONNECT = 'DISCONNECT';
export const DEVICE_DISCONNECTED = 'DEVICE_DISCONNECTED';
export const SET_PULSE_LISTENER = 'SET_PULSE_LISTENER';
export const REMOVE_LISTENER = "REMOVE_LISTENER";
export const STEPS_UPDATED = 'STEPS_UPDATED';
export const STATUS_UPDATE = 'STATUS_UPDATE'





export function remove_listeners(){
    console.log(device_dis_listener)
    device_dis_listener.remove()
    pulse_listener.remove()
    console.log(device_dis_listener)
    return {
        type:REMOVE_LISTENER
    }
}


export function update_status(message){
    return {
        type:STATUS_UPDATE,
        payload:message
    }

}

export function disconnect(manager,device){
    return function(dispatch){
        if(device.isConnected()){
            manager.cancelDeviceConnection(device.id).then(()=>{
                dispatch({type:DISCONNECT})
            })
        }
    }
}



export function set_listeners(device){
    
    return function(dispatch){
        dispatch({type:LISTENER_ON})
        device_dis_listener = device.onDisconnected((error,device)=>{
            dispatch(update_status('Устройство отключено'))
            dispatch(remove_listeners())
        })
        pulse_listener = device.monitorCharacteristicForService(consts.HEAR_RATE_SERVICE_GUID,consts.HEART_RATE_MEASUREMENT_VALUE,(error, characteristic) => {
            if (characteristic && characteristic.value) {
                steps_getter(device);
                setTimeout(()=>dispatch({
                    type:GET_STEPS,
                    payload:result
                }),5000);
                let heartRate = -1;
                let decoded = Buffer.from(characteristic.value, 'base64');
                let firstBitValue = decoded.readInt8(0) & 0x01;
                if (firstBitValue == 0) {
                    heartRate = decoded.readUInt8(1);
                    dispatch({type:PULSE_UPDATED,payload:heartRate})   
                } else {
                    heartRate = (decoded.readInt8(1) << 8) + decoded.readInt8(2);
                    dispatch({type:PULSE_UPDATED,payload:heartRate})
                }
            }
        })
    }
}

async function bluetooth_check(manager){
    mm =  await manager.state()
    console.log(mm)
}


export  function search_device(manager,mydevice){
    return function(dispatch,getState){
        kek =  bluetooth_check(manager)
        
        dispatch({type:DEVICE_SEARCHING,payload:true,message:"Идет поиск вашего устройства..."});
       try{
        manager.startDeviceScan(null,null,(error,device) => {
            if(error){
                console.log(error.message)
                dispatch(update_status(error.message));
            }
            
            if(device.id === mydevice){
                dispatch({type:DEVICE_SEARCHING,payload:false});

                dispatch({type:CONNECTING_TO_DEVICE,payload:true,message:'Идет подключение к устройству...'});
                device.connect()
                .then((device)=>{
                    return device.discoverAllServicesAndCharacteristics()
                })
                .then((device)=>{
                    dispatch(update_status('Устройство подключено.'));
                    dispatch({type:DEVICE_CONNECTED,payload:device})
                    manager.stopDeviceScan();
                    dispatch(set_listeners(device));
                    dispatch(update_pulse(device));
                })
                
            }
        }) }catch(e){console.log('mda')}

    }
}




    
export function error_handler(er){
    return{type:CONNECTING_EROR,payload:er.message}
}

export function connecting(manager){
    return function(dispatch){
            manager.startDeviceScan(null,null,(error,device)=>{
            if(error){
                dispatch(error_handler(error));
            }
            if(device.name == "Mi Smart Band 4"){
                device.connect().then((device)=>{ 
                    // this.device = device;
                    console.log(device);
                    dispatch({type:CONNECTING,payload:{message:true,device}});
                    dispatch(listener_on(device));
                    dispatch(update_pulse(device));
                    manager.stopDeviceScan();
                })
            }
    
    
        })

        
    }
}

var result;
function steps_getter(mydevice){
    
    mydevice.discoverAllServicesAndCharacteristics()
        .then((device) => {
            return device.readCharacteristicForService(consts.STEPS_SERVICE,consts.STEP_CHARACTERISTIC)
        })
        .then((promice)=>{
            console.log(promice)
            let heartRate = -1;
            // console.log(promice.value)
            decoded = Buffer.from(promice.value, 'base64');
            // console.log(decoded)
            result = (decoded.readInt8(2) & 0xff) << 8 
        })
}

// export function get_steps(mydevice){
//     return function(dispatch) {
//         steps_getter(mydevice);
//         setTimeout(()=>dispatch({
//             type:GET_STEPS,
//             payload:result
//         }),5000);
//         setTimeout(()=>dispatch(get_steps(mydevice)),300000);
//     }

// }   




export function update_pulse(mydevice){
    var lol = [21,1,1];
        var encryptedCredentials = new Buffer(lol).toString("base64");
        mydevice.discoverAllServicesAndCharacteristics()
        .then((device)=> {
            return mydevice.writeCharacteristicWithResponseForService(consts.HEAR_RATE_SERVICE_GUID,consts.HEART_RATE_MEASUREMENT_POINT,encryptedCredentials);
        })
    return{
        type:UPDATE_PULSE
    }
}

export function listener_on(mydevice){
    return function(dispatch){
        dispatch({type:LISTENER_ON})
        mydevice.discoverAllServicesAndCharacteristics()
        .then((device) => {
            
            return mydevice.monitorCharacteristicForService(
            consts.HEAR_RATE_SERVICE_GUID,
            consts.HEART_RATE_MEASUREMENT_VALUE,
            (error, characteristic) => {


                
                if (characteristic && characteristic.value) {
                    steps_getter(mydevice);
                    setTimeout(()=>dispatch({
                        type:GET_STEPS,
                        payload:result
                    }),5000);
                
                // is 1 then 2 bytes).
                    let heartRate = -1;
                    let decoded = Buffer.from(characteristic.value, 'base64');
                    let firstBitValue = decoded.readInt8(0) & 0x01;
                    if (firstBitValue == 0) {
                // Heart Rate Value Format is in the 2nd byte
                        heartRate = decoded.readUInt8(1);
                        dispatch({type:PULSE_UPDATED,payload:heartRate})
                        
                        
                } else {
                // Heart Rate Value Format is in the 2nd and 3rd bytes
                    heartRate = (decoded.readInt8(1) << 8) + decoded.readInt8(2);
                    dispatch({type:PULSE_UPDATED,payload:heartRate})
                    
                
                }
            }


            })

        })
    }
        


}











