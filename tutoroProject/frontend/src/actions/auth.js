import axios from 'axios';
import { returnErrors, createMessage } from './messages';
import { USER_LOADED, USER_LOADING, AUTH_ERROR, 
    LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, LOGOUT_FAIL, 
    REGISTER_SUCCESS, REGISTER_FAIL, PASS_REQUEST_SUCCESS, 
    PASS_REQUEST_FAILED, VERIFY_ACCOUNT_SUCCESS, VERIFY_ACCOUNT_FAILED,
    RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILED, 
    CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILED } from './types';

// Check token and load user
export const loadUser = () => (dispatch, getState) => {
    //User loading
    // dispatch({ type: USER_LOADING });

    axios.get('/api/auth/user', tokenConfig(getState)).then(res => {
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: AUTH_ERROR
        });
    });
};

// login user
export const login = (username, password) => dispatch => {
    //headers 
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // request body
    const body = JSON.stringify({
        username, password
    });

    axios.post('/api/auth/login', body, config).then(res => {
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
    }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: LOGIN_FAIL
        });
    });
};

// register user
export const register = ({ first_name, username, email, password}) => dispatch => {
    //headers 
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // request body
    const body = JSON.stringify({
        username, password, email, first_name
    });

    axios.post('/api/auth/register', body, config).then(res => {
        dispatch(createMessage({ accountCreated: "Check your email to verify your account!" }));
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
    }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: REGISTER_FAIL
        });
    });
};


//logout user
export const logout = () => (dispatch, getState) => {

    axios.post('/api/auth/logout', null, tokenConfig(getState)).then(res => {
        dispatch({
            type: LOGOUT_SUCCESS,
            payload: res.data
        });
    }).catch(err => {
        dispatch({
            type: LOGOUT_FAIL
        })
        dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// setup config with token function
export const tokenConfig = getState => {

    //get token from state
    const token = getState().auth.token;

    //headers 
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    //if token, then add to config
    if(token) {
        config.headers['Authorization'] = `Token ${token}`;
    }
    
    return config;
}

// request password
export const requestPassword = (email) => dispatch => {
    //headers 
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // request body
    const body = JSON.stringify({
        email
    });

    axios.post('/api/auth/password/reset/', body, config).then(res => {
        dispatch({
            type: PASS_REQUEST_SUCCESS,
            payload: res.data
        });
    }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: PASS_REQUEST_FAILED
        });
    });

};

// reset password
export const resetPassword = ({ uid, token, new_password }) => dispatch => {
    //headers 
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // request body
    const body = JSON.stringify({
        uid, token, new_password1:new_password, new_password2:new_password
    });

    axios.post('/api/auth/password/reset/confirm/', body, config).then(res => {
        dispatch(createMessage({ resetPasswordSuccess: "Password successfully changed." }));        
        dispatch({
            type: RESET_PASSWORD_SUCCESS,
            payload: res.data
        });
    }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: RESET_PASSWORD_FAILED
        });
    });
};

// change password
export const changePassword = (old_password, new_password) => (dispatch, getState) => {
    //headers 
    const config = tokenConfig(getState);

    // request body
    const body = JSON.stringify({
        old_password:old_password, new_password:new_password
    });

    axios.put('/api/auth/password/change', body, config).then(res => {
        dispatch(createMessage({ resetPasswordSuccess: "Password successfully changed." }));        
        dispatch({
            type: CHANGE_PASSWORD_SUCCESS,
            payload: res.data
        });
    }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: CHANGE_PASSWORD_FAILED
        });
    });
};

// verify account
// Check token and login user
export const verifyAccount = (url) => dispatch => {
    axios.post(url).then(res => {
        dispatch({
            type: VERIFY_ACCOUNT_SUCCESS,
            payload: res.data
        });
    }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: VERIFY_ACCOUNT_FAILED
        });
    });
};