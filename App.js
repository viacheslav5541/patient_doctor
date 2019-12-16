import React, { Component } from 'react';
import App2 from './components/App'
import {createStore} from 'redux';
import allReducers from './reducers/index';
import {Provider} from 'react-redux';
import store from './store'
// const store  = createStore(allReducers);

 const App = () => (
     <Provider store={store}>
         <App2/>
     </Provider>
     
 )



 export default App;