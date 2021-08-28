import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Auth from './Auth';
import reportWebVitals from './reportWebVitals';
import {getCookie} from './cookies';


const loggedIn = getCookie("user-dod");
console.log(loggedIn)
const user = loggedIn ? JSON.parse(loggedIn):{name: "John"};



ReactDOM.render(
  <React.StrictMode>
    {loggedIn? 
      <App user={user}/>
    :
      <Auth/>
    }    
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
