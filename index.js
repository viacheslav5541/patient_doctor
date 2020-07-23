/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import store from './store';
import {update_pulse,steps_getter} from "./actions/bluetooth_actions";

const MyHeadlessTask = async () => {
    console.log('hehmda')
    if(store.getState().Bluetooth_data.connected_device){
        store.dispatch(update_pulse(store.getState().Bluetooth_data.manager, store.getState().Bluetooth_data.device));
    }
    // else {
    //     store.dispatch(full_disconnect());
    //     setTimeout(()=>{store.dispatch(ble_state_listener_on())},6000);
    // }
};

AppRegistry.registerHeadlessTask('Heartbeat', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => App);
