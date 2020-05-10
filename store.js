import {createStore, applyMiddleware} from 'redux';
import allReducers from './reducers/index';
import {Provider} from 'react-redux';
import logger from 'redux-logger'
import thunk from 'redux-thunk'

const store  = createStore(allReducers,applyMiddleware(thunk));

export default store;