import {combineReducers} from 'redux';
import PatientReducer from './Patient';
import DoctorReducer from './Doctors';
import active from './active';
import Bluetooth_data from './Bluetooth_data';

 const allReducers = combineReducers({
    patients:PatientReducer,
    doctors:DoctorReducer,
    active:active,
    Bluetooth_data:Bluetooth_data
    
})

export default allReducers;