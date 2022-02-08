import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";
import reducers from "./store/reducers";
import { requestMiddleware } from './helpers/redux-request'
import thunkMiddleware from 'redux-thunk';
import './assets/css/style.css';
import './assets/css/header.css';
import './assets/css/footer.css';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
	reducers,
	composeEnhancers(applyMiddleware(thunkMiddleware, requestMiddleware))
);

requestMiddleware.on.fail = ((err) => {
	if (err.response){
		return err.response;
	}
	throw err;
});

window.store = store;

ReactDOM.render(
	<React.StrictMode>
		<Provider store={ store }>
			<App/>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

reportWebVitals();
