import React from 'react';
import ReactDOM from 'react-dom';


import Main from './components/Main';



//--This creates the store that will be passed to the Provider component
//let store = require('./store/configureStore').configure();

//Load initial state which is the application list
//Not using here anymore, doing it on componentWillMount in MainDisplay
//store.dispatch(startLoadApplicationList());
//-------------------------------------------------------

//app scss - webpack will create a sass-styles.css file in pubic directory
require('./styles/app.scss');


//path="/" designates the root of the application
ReactDOM.render(
  <Main />,
  document.getElementById('app')
);
//Old ReactDom render method without routing

// ReactDOM.render(
//   <h1>Boilerplate app!  </h1>,
//   document.getElementById('app')
// );
