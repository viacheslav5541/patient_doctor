import {combineReducers} from 'redux';
import server_data from './server_data'
import Bluetooth_data from './Bluetooth_data';

 const allReducers = combineReducers({
     Bluetooth_data:Bluetooth_data,
     server_data:server_data

    
})

export default allReducers;