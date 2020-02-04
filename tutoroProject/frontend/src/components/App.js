import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

import Header from './layout/Header';
import Alerts from './layout/Alerts';
import Dashboard from './matches/Dashboard';
import FindStudents from './matches/FindStudents';
import FindTutor from './matches/FindTutor';
import ProfilePage from './profile/ProfilePage';
import Login from './accounts/Login';
import Register from './accounts/Register';
import PasswordRequest from './accounts/PasswordRequest';
import PasswordReset from './accounts/PasswordReset';
import VerifyAccount from './accounts/VerifyAccount';
import PrivateRoute from './common/PrivateRoute';

import { Provider } from 'react-redux';
import { store, persistor } from '../store';
import { PersistGate } from 'redux-persist/integration/react'

import { loadUser } from '../actions/auth';
import { getCourses } from '../actions/courses';

// Alerts
const alertOptions = {
    timeout: 3000,
    position: 'top center'
}

// disable react-dev-tools for this project
if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === "object") {
	for (let [key, value] of Object.entries(window.__REACT_DEVTOOLS_GLOBAL_HOOK__)) {
		window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] = typeof value == "function" ? ()=>{} : null;
	}
}

class App extends Component {
    componentDidMount() {
        // store.dispatch(loadUser());
        store.dispatch(getCourses());
    }

    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <AlertProvider template={AlertTemplate} {...alertOptions}>
                        <Router>
                            <Fragment>
                                <Header />
                                <Alerts />
                                <div className="container">
                                    <Switch>
                                        <PrivateRoute exact path="/" component={Dashboard} />
                                        <PrivateRoute exact path="/students" component={FindStudents} />
                                        <PrivateRoute exact path="/tutors" component={FindTutor} />
                                        <PrivateRoute exact path="/profile" component={ProfilePage} />
                                        <Route exact path="/register" component={Register} />
                                        <Route exact path="/login" component={Login} />
                                        <Route exact path="/password_request" component={PasswordRequest} />
                                        <Route path="/api/verify/:id/:token" render={({match}) => 
                                        (<VerifyAccount 
                                        token={match.params.token} 
                                        id={match.params.id} /> )}/>
                                        <Route path="/api/auth/password/reset/confirm/:id/:token" 
                                        render={({match}) => (<PasswordReset token={match.params.token} 
                                        id={match.params.id} /> )}/>
                                    </Switch>
                                </div>
                            </Fragment>
                        </Router>
                    </AlertProvider>
                </PersistGate>
            </Provider>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
