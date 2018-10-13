import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';

import { 
    BrowserRouter as Router, Route, Switch, Redirect 
} from 'react-router-dom';

import reducers from './reducers';

import 'bootstrap/dist/css/bootstrap.min.css';

import App from './components/App';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ChangeName from './components/ChangeName';
import Create from './components/Create';
import Home from './components/Home';
import Campaign from './components/Campaign';
import Member from './components/Member';
import Request from './components/Request';
import CreateRequest from './components/CreateRequest';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
    
            <Router>
                <Switch>
                    <Route exact path="/" component={App} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/dashboard" component={Dashboard} />
                    <Route exact path="/change/name" component={ChangeName} />
                    <Route exact path="/create" component={Create} />
                    <Route exact path="/home" component={Home} />
                    <Route exact path="/campaign/:address" component={Campaign} />
                    <Route exact path="/member/:address" component={Member} />
                    <Route exact path="/request/:address" component={Request} />
                    <Route exact path="/create-request/:address" component={CreateRequest} />
                    <Redirect from="*" to={"/"} />
                </Switch>
            </Router>
    
        </Provider>
, document.getElementById('root'));

serviceWorker.unregister();
