import consts  from '../Const/services_characteristics';
import {send_pulse,send_steps} from "./server_actions";
import { Buffer } from 'buffer';
var ble_state_listener,disconnect_listener,pulse_listener;
export const UPDATE_STATUS = 'UPDATE_STATUS';
export const GET_STEPS = 'GET_STEPS';
export const PULSE_UPDATED = 'PULSE_UPDATED';
export const DEVICE_CONNECTED_CHANGE = 'DEVICE_CONNECTED_CHANGE';
export const DEVICE_SEARCHING = 'DEVICE_SEARCHING';
export const CHANGE_DEVICE = 'CHANGE_DEVICE';

export function change_device(device){
    return {
        type:CHANGE_DEVICE,
        payload:device
    }
}

export function update_status(status){
    return{
        type:UPDATE_STATUS,
        payload:status
    }
}

export function reconnect(){
    return function(dispatch,getState){
        let ble_data = getState().Bluetooth_data;
        if(ble_data.connected_device||ble_data.device_searching) {
            ble_data.manager.cancelDeviceConnection(ble_data.device);
        }
        else{
            dispatch(ble_state_listener_on())
        }

    }
}

export function ble_state_listener_on(){
    return function(dispatch,getState) {
        let ble_data = getState().Bluetooth_data;
        ble_state_listener = ble_data.manager.onStateChange((state)=>{
            if(state == 'PoweredOn'){
                if(ble_data.device!=null && ble_data.device != ''){
                    dispatch(connect_to_device())
                }else{dispatch(update_status('Вам в настройки'))}
            }else if(state == 'PoweredOff'){
                dispatch(update_status('Включите блютуз'))
            }
        },true);
    }
}


function ble_state_listener_off(){
    ble_state_listener.remove()
}
function disconnect_listener_remove(){
    disconnect_listener.remove()
}
function remove_pulse_listener(){
    pulse_listener.remove();
}

export function full_disconnect(){
    return function (dispatch,getState){
        disconnect_listener?disconnect_listener_remove():null;
        ble_state_listener?ble_state_listener_off():null;
        if(getState().Bluetooth_data.device!=null && getState().Bluetooth_data.device!='')
        getState().Bluetooth_data.manager.cancelDeviceConnection(getState().Bluetooth_data.device).then(res=>{
            dispatch({type:DEVICE_SEARCHING,payload:false});
            dispatch({type:DEVICE_CONNECTED_CHANGE,payload:false});
            dispatch(update_status('Проверка подключения...'))

        })
    }

}



export function connect_to_device(){
    return function(dispatch,getState){
        let ble_data = getState().Bluetooth_data;
        dispatch({type:DEVICE_SEARCHING,payload:true});
        dispatch(update_status('Подключение к устройству...'));
        ble_data.manager.connectToDevice(ble_data.device).then(res=>{
            dispatch(update_status('Устройство подключено.'));
            dispatch({type:DEVICE_SEARCHING,payload:false});
            dispatch(set_pulse_listener());
            dispatch(update_pulse(ble_data.manager,ble_data.device));
            disconnect_listener = ble_data.manager.onDeviceDisconnected(ble_data.device,(err,device)=>{
                dispatch(update_status('Устройство отключилось'))
                disconnect_listener_remove();
                ble_state_listener_off();
                dispatch({type:DEVICE_CONNECTED_CHANGE,payload:false});
                setTimeout(()=>{
                    // !getState().Bluetooth_data.device_searching||!getState().Bluetooth_data.connected_device?dispatch(ble_state_listener_on()):null
                    if(getState().Bluetooth_data.device_searching == false && getState().Bluetooth_data.connected_device == false){
                        dispatch(ble_state_listener_on())
                    }
                },5000);
            });
            dispatch({type:DEVICE_CONNECTED_CHANGE,payload:true});
            return res
        }).then(device=>{
            return device.discoverAllServicesAndCharacteristics()
        }).catch(err=>{
            dispatch(update_status('Произошла ошибка'))
        })
    }
}










export function set_pulse_listener(){
    return function(dispatch,getState){
        let ble_data = getState().Bluetooth_data;
        pulse_listener = ble_data.manager.discoverAllServicesAndCharacteristicsForDevice(ble_data.device).then(res=> {
            res.monitorCharacteristicForService(consts.HEAR_RATE_SERVICE_GUID, consts.HEART_RATE_MEASUREMENT_VALUE, (error, characteristic) => {
                if (characteristic && characteristic.value) {
                    steps_getter(ble_data.manager, ble_data.device);
                    setTimeout(() => {
                        dispatch({
                            type: GET_STEPS,
                            payload: result
                        });
                        send_steps(result,getState().server_data.access_token,getState().server_data.user_id)
                    }, 5000);
                    console.log('dfkjdfkjdf',result)
                    let heartRate = -1;
                    let decoded = Buffer.from(characteristic.value, 'base64');
                    let firstBitValue = decoded.readInt8(0) & 0x01;
                    if (firstBitValue == 0) {
                        heartRate = decoded.readUInt8(1);
                        dispatch({type: PULSE_UPDATED, payload: heartRate})
                        send_pulse(heartRate,getState().server_data.access_token,getState().server_data.user_id)
                    } else {
                        heartRate = (decoded.readInt8(1) << 8) + decoded.readInt8(2);
                        dispatch({type: PULSE_UPDATED, payload: heartRate})
                        send_pulse(heartRate,getState().server_data.access_token,getState().server_data.user_id)
                    }


                }
            })
        })
    }
}






var result;
export function steps_getter(manager,mydevice){
    manager.discoverAllServicesAndCharacteristicsForDevice(mydevice)
        .then((device) => {
            return device.readCharacteristicForService(consts.STEPS_SERVICE,consts.STEP_CHARACTERISTIC)
        })
        .then((promice)=>{
            let heartRate = -1;
            console.log(promice.value)
            let decoded = Buffer.from(promice.value, 'base64');
            let firstBit = decoded.readInt8(1)
            result = ((decoded.readInt8(2) & 0xff) << 8) + firstBit;
        })
}





export function update_pulse(manager,mydevice){
    var lol = [21,1,1];
    var encryptedCredentials = new Buffer(lol).toString("base64");
    manager.discoverAllServicesAndCharacteristicsForDevice(mydevice)
        .then((device)=> {
            return device.writeCharacteristicWithResponseForService(consts.HEAR_RATE_SERVICE_GUID,consts.HEART_RATE_MEASUREMENT_POINT,encryptedCredentials);
        })
    return {type:'PULSE_UPDATE'}
}










// var ble_status_listener,display_listener;
//
// export function stop_scan(manager){
//     manager.stopDeviceScan();
//     return {
//         type:STOP_DEVICE_SCAN
//     }
// }
//
//
// export default function remove_bluetooth_state_listener(){
//     ble_status_listener.remove();
//     return {type:BLUETOOTH_STATE_CHANGE,payload:false}
// }
//
//
// export function setup_bluetooth_state_listener(){
//     return function(dispatch,getState){
//         ble_status_listener = getState().Bluetooth_data.manager.onStateChange((state) => {
//             if (state == 'PoweredOff') {
//                 dispatch(stop_scan(getState().Bluetooth_data.manager));
//                 disconnect(getState().Bluetooth_data.manager,getState().Bluetooth_data.device).then(res=>{
//                     dispatch(remove_listeners())
//                     dispatch({type:DISCONNECT})
//                 });
//             }
//             if( state == 'PoweredOn') {
//                 dispatch(bluetooth_controller('search'))
//             }
//         }, false);
//        dispatch({type:BLUETOOTH_STATE_CHANGE,payload:true})
//     }
// }
//
// // export function search_device(manager,mydevice){
// //     return function(dispatch,getState){
// //         if(getState().Bluetooth_data.device!=null){
// //             dispatch({type:DEVICE_SEARCHING,payload:true,message:"Идет поиск вашего устройства..."});
// //             manager.startDeviceScan(null,null,(error,device) => {
// //                 if(error){
// //                     console.log(device)
// //                     dispatch(update_status(error.message));
// //                     // manager.stopDeviceScan()
// //                     // setTimeout(()=>dispatch(bluetooth_controller()),5000)
// //                 }
// //                 if(device){
// //                     if(device.id === mydevice){
// //                         dispatch(update_status('Идет подключение к устройству...'));
// //                         dispatch({type:CONNECTING_TO_DEVICE,payload:true});
// //                         dispatch(stop_scan(manager));
// //                         setTimeout(()=>device.connect()
// //                             .then((device)=>{
// //                                 return device.discoverAllServicesAndCharacteristics()
// //                             })
// //                             .then((device)=>{
// //                                 dispatch(update_status('Устройство подключено.'));
// //                                 dispatch({type:DEVICE_CONNECTED,payload:device});
// //                                 dispatch(set_listeners(device));
// //                                 dispatch(update_pulse(device));
// //                                 dispatch({type:DEVICE_SEARCHING,payload:false});
// //                             }).catch((err)=>{
// //                                 dispatch(update_status(err))
// //                             }),2000)
// //
// //
// //                     }
// //                 }
// //             })
// //             setTimeout(()=>dispatch(check_connection()),5000)
// //         }else{
// //             dispatch(update_status('Вам в настройки'))
// //         }
// //
// //     }
// // }
//
// export function update_status(message){
//     return {
//         type:STATUS_UPDATE,
//         payload:message
//     }
//
// }
//
// // export function disconnect(){
// //     return function(dispatch,getState){
// //         getState().Bluetooth_data.manager.cancelDeviceConnection(getState().Bluetooth_data.device).then(res=>{
// //             dispatch(update_status('Устройство отключено'))
// //         })
// //     }
// // }
//
// function disconnect(manager,device){
//     return manager.cancelDeviceConnection(device)
//
// }
//
// export function reconnect(){
//     return function(dispatch,getState){
//         disconnect(getState().Bluetooth_data.manager,getState().Bluetooth_data.device);
//         dispatch({type:DISCONNECT});
//         dispatch(remove_listeners())
//         setTimeout(()=>dispatch(bluetooth_controller('search')),1000)
//
//     }
// }
//
//
//
// export function search_device() {
//     return function(dispatch,getState){
//         dispatch({type:DEVICE_SEARCHING,payload:true});
//         getState().Bluetooth_data.manager.startDeviceScan(null,null,(error,device)=>{
//             if(error){
//                 dispatch(stop_scan(getState().Bluetooth_data.manager));
//                 setTimeout(()=>dispatch(bluetooth_controller('search')))
//             }
//             if(device.id == getState().Bluetooth_data.device){
//                 dispatch(stop_scan(getState().Bluetooth_data.manager))
//                 dispatch({type:DEVICE_SEARCHING,payload:false});
//                 dispatch({type:CONNECTING_TO_DEVICE})
//                 device.connect()
//                     .then((device)=>{
//                     return device.discoverAllServicesAndCharacteristics()
//                 })
//                 .then((device)=>{
//                     dispatch(update_status('Устройство подключено.'));
//                     dispatch({type:DEVICE_CONNECTED,payload:device});
//                     dispatch(set_listeners(device));
//                     dispatch(update_pulse(device));
//
//                 }).catch(err=>{
//                     dispatch(reconnect())
//                 })
//             }
//         })
//
//     }
// }
//
//
//
// export function display_off(){
//     return function(dispatch,getState){
//         dispatch(remove_bluetooth_state_listener())
//         if(getState().Bluetooth_data.device_connecting){
//             setTimeout(()=>{
//                 disconnect(getState().Bluetooth_data.manager,getState().Bluetooth_data.device);
//                 dispatch({type:DISCONNECT});
//                 dispatch(remove_listeners());
//                 setTimeout(()=>dispatch(bluetooth_controller('display')),2000)
//
//             },10000)
//         }else{
//
//             stop_scan(getState().Bluetooth_data.manager);
//             disconnect(getState().Bluetooth_data.manager,getState().Bluetooth_data.device);
//             dispatch({type:DISCONNECT});
//             dispatch(remove_listeners());
//
//         }
//
//     }
// }
//
// export function display_lis(){
//     return function(dispatch,getState){
//         device_dis_listener = getState().Bluetooth_data.manager.onStateChange((state) => {
//             if (state == 'PoweredOff') {
//                dispatch(stop_scan(getState.Bluetooth_data.manager));
//                dispatch({type:BLUETOOTH_STATUS_UPDATED,payload:true});
//             }
//             if( state == 'PoweredOn') {
//                 dispatch(bluetooth_controller('display'))
//             }
//         })
//     }
// }
//
// export function bluetooth_controller(command){
//     return function(dispatch,getState){
//         getState().Bluetooth_data.manager.state().then((res)=> {
//             if(res == 'PoweredOn'){
//                 if (command == 'search') {
//                     dispatch(setup_bluetooth_state_listener());
//                     if(getState().Bluetooth_data.device != null){
//                         getState().Bluetooth_data.manager.isDeviceConnected(getState().Bluetooth_data.device).then(res => {
//                             if (res) {
//                                 disconnect(getState().Bluetooth_data.manager, getState().Bluetooth_data.device);
//                                 dispatch({type:DISCONNECT})
//                             }
//                         });
//                         setTimeout(() => dispatch(search_device()), 1000);
//                     }else{
//                         update_status("Перейдите в настройки и выберите устройство.")
//                     }
//                 }else{
//                     dispatch({type:BLUETOOTH_STATUS_UPDATED,payload:true});
//                     dispatch(scan_devices());
//
//                 }
//             }else{
//                 dispatch(update_status('Включите блютуз позязя'))
//             }
//         })
//
//     }
// }
//
//
// //
// // var ble_status_listener
// // export function bluetooth_controller(command){
// //     console.log(this.props)
// //     return function(dispatch,getState){
// //         if(!getState().Bluetooth_data.bluetooth_state_listener){
// //             ble_status_listener = getState().Bluetooth_data.manager.onStateChange((state) => {
// //                 if (state == 'PoweredOff') {
// //                     getState().Bluetooth_data.connected_device != null ? dispatch(disconnect()) : null;
// //                     dispatch(stop_scan(getState().Bluetooth_data.manager));
// //                 }
// //                 if( state == 'PoweredOn') {
// //                     dispatch(bluetooth_controller(command))
// //                 }
// //             }, false);
// //             dispatch({type:BLUETOOTH_STATE_CHANGE,payload:true})
// //         }
// //         getState().Bluetooth_data.manager.state().then((res)=> {
// //             if(res == 'PoweredOn'){
// //                 if(command == 'search'){
// //
// //                     dispatch(search_device(getState().Bluetooth_data.manager,getState().Bluetooth_data.device));
// //                 }
// //                 if(command == 'display'){
// //                     dispatch(stop_scan(getState().Bluetooth_data.manager));
// //                     dispatch(disconnect());
// //                     setTimeout(()=>dispatch(scan_devices()),1000);
// //                 }
// //             };
// //             if(res == 'PoweredOff'){
// //                 dispatch(update_status('Блютуз не включен'));
// //             }
// // //
// //         })
// //     }
// // }
// //
// //
//
// //
// //
// // export function stop_scan(manager){
// //     manager.stopDeviceScan();
// //     return {
// //         type:STOP_DEVICE_SCAN
// //     }
// // }
//
// // export function disconnect(){
// //     return function(dispatch,getState){
// //         // if(getState().Bluetooth_data.connected_device){
// //         //     if(getState().Bluetooth_data.connected_device.isConnected()){
// //         //         getState().Bluetooth_data.manager.cancelDeviceConnection(getState().Bluetooth_data.connected_device.id).then(()=>{
// //         //             dispatch({type:DISCONNECT});
// //         //             dispatch(remove_listeners());
// //         //             dispatch(update_status('Устройство отключено'));
// //         //         })
// //         //     }
// //         // }
// //         if(getState().Bluetooth_data.device || getState().Bluetooth_data.device != ''){
// //             getState().Bluetooth_data.manager.isDeviceConnected(getState().Bluetooth_data.device).then(res=>{
// //                 if(res){
// //                     return getState().Bluetooth_data.manager.cancelDeviceConnection(getState().Bluetooth_data.device)
// //                 }else{
// //                     return null
// //                 }
// //             }).then(res=>{
// //                 dispatch({type:DISCONNECT});
// //                 dispatch(remove_listeners());
// //                 dispatch(update_status('Устройство отключено'));
// //             })
// //         }
// //     }
// // }
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// export function change_device(device){
//     return {
//         type:CHANGE_DEVICE,
//         payload:device
//     }
// }
//
// //
// //
//
//
// export function scan_devices(){
//     return function(dispatch,getState){
//         getState().Bluetooth_data.manager.startDeviceScan(null,null,(error,device)=>{
//             if(error){
//                dispatch(update_status(error))
//             }
//             if(device){
//                 var check = true;
//                 let devices_list = getState().Bluetooth_data.devices_list
//                 for(var i = 0;i<devices_list.length;i+=1)
//                 {
//                     if(device.id == devices_list[i].id)
//                         check = false
//                 }
//                 if(check == true){
//                     devices_list.push({id:device.id,name:device.name});
//                     dispatch({
//                         type:DEVICES_LIST_UPDATED,
//                         payload:devices_list
//                     })
//
//                 }
//
//                 // dispatch(add_device(device,getState().Bluetooth_data.devices_list))
//             }
//         })
//     }
// }
// //
// //
// //
// export function remove_listeners(){
//     console.log(device_dis_listener);
//     device_dis_listener?device_dis_listener.remove():null;
//     pulse_listener?pulse_listener.remove():null;
//     console.log(device_dis_listener);
//     return {
//         type:REMOVE_LISTENER
//     }
// }
// //
// //
// //
// //
// //
// //
// //
// export function set_listeners(device){
//     return function(dispatch,getState){
//         dispatch({type:LISTENER_ON})
//         device_dis_listener = device.onDisconnected((error,device)=>{
//             dispatch(update_status('Устройство было отключено'));
//             dispatch(remove_listeners())
//             dispatch({type:DISCONNECT});
//             dispatch(bluetooth_controller('search'));
//         });
//
//         pulse_listener = device.monitorCharacteristicForService(consts.HEAR_RATE_SERVICE_GUID,consts.HEART_RATE_MEASUREMENT_VALUE,(error, characteristic) => {
//             if (characteristic && characteristic.value) {
//                 steps_getter(device);
//                 setTimeout(()=>dispatch({
//                     type:GET_STEPS,
//                     payload:result
//                 }),5000);
//                 let heartRate = -1;
//                 let decoded = Buffer.from(characteristic.value, 'base64');
//                 let firstBitValue = decoded.readInt8(0) & 0x01;
//                 if (firstBitValue == 0) {
//                     heartRate = decoded.readUInt8(1);
//                     dispatch({type:PULSE_UPDATED,payload:heartRate})
//                 } else {
//                     heartRate = (decoded.readInt8(1) << 8) + decoded.readInt8(2);
//                     dispatch({type:PULSE_UPDATED,payload:heartRate})
//                 }
//             }
//         })
//     }
// }
//
// //
// //
// // export async function bluetooth_check(manager){
// //     var check =  await manager.state();
// //     return check
// // }
// //
// // function update_bluetooth_status(status){
// //     return{
// //         type:BLUETOOTH_STATUS_UPDATED,
// //         payload:status
// //     }
// // }
// // //
// //
// //
//
// //
// // export function check_connection(){
// //     return function (dispatch,getState) {
// //         if(getState().Bluetooth_data.connected_device == null){
// //             dispatch(update_status('Не удается найти устройство'));
// //         }
// //     }
// // }
// //
// //
// // export function search_device(manager,mydevice){
// //     return function(dispatch,getState){
// //         if(getState().Bluetooth_data.device!=null){
// //             dispatch({type:DEVICE_SEARCHING,payload:true,message:"Идет поиск вашего устройства..."});
// //             // manager.connectToDevice(mydevice)
// //             //     .then((device)=>{
// //             //     return device.discoverAllServicesAndCharacteristics()
// //             // }).then((device)=>{
// //             //         dispatch(update_status('Устройство подключено.'));
// //             //         dispatch({type:DEVICE_CONNECTED,payload:device});
// //             //         dispatch(set_listeners(device));
// //             //         dispatch(update_pulse(device));
// //             //         dispatch({type:DEVICE_SEARCHING,payload:false});
// //             // });
// //             manager.startDeviceScan(null,null,(error,device) => {
// //             if(error){
// //                 console.log(device)
// //                 dispatch(update_status(error.message));
// //                 // manager.stopDeviceScan()
// //                 // setTimeout(()=>dispatch(bluetooth_controller()),5000)
// //             }
// //             if(device){
// //             if(device.id === mydevice){
// //                 dispatch(update_status('Идет подключение к устройству...'));
// //                 dispatch({type:CONNECTING_TO_DEVICE,payload:true});
// //                 dispatch(stop_scan(manager));
// //                 setTimeout(()=>device.connect()
// //                 .then((device)=>{
// //                     return device.discoverAllServicesAndCharacteristics()
// //                 })
// //                 .then((device)=>{
// //                     dispatch(update_status('Устройство подключено.'));
// //                     dispatch({type:DEVICE_CONNECTED,payload:device});
// //                     dispatch(set_listeners(device));
// //                     dispatch(update_pulse(device));
// //                     dispatch({type:DEVICE_SEARCHING,payload:false});
// //                 }).catch((err)=>{
// //                     dispatch(update_status(err))
// //                     }),2000)
// //
// //
// //             }
// //             }
// //         })
// //             setTimeout(()=>dispatch(check_connection()),5000)
// //         }else{
// //             dispatch(update_status('Вам в настройки'))
// //             }
// //
// //     }
// // }
// //
// var result;
// function steps_getter(mydevice){
//
//     mydevice.discoverAllServicesAndCharacteristics()
//         .then((device) => {
//             return device.readCharacteristicForService(consts.STEPS_SERVICE,consts.STEP_CHARACTERISTIC)
//         })
//         .then((promice)=>{
//             console.log(promice)
//             let heartRate = -1;
//             // console.log(promice.value)
//             let decoded = Buffer.from(promice.value, 'base64');
//             // console.log(decoded)
//             result = (decoded.readInt8(2) & 0xff) << 8
//         })
// }
//

//
//
//






