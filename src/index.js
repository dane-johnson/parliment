import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {Router, browserHistory} from 'react-router';
import routes from "./routes";
import reducers from "./reducers";
import {initSockets} from "./sockets_client";

const store = createStore(reducers);

initSockets(store);

ReactDOM.render(
	<h1>React!</h1>
	, document.querySelector('.container')
);