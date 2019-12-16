import {createStore} from 'redux';
import allReducers from './reducers/index';
import {Provider} from 'react-redux';

const store  = createStore(allReducers);

export default store;