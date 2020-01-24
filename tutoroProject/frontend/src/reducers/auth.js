import { USER_LOADED, USER_LOADING, AUTH_ERROR, 
    LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, LOGOUT_FAIL, 
    REGISTER_SUCCESS, REGISTER_FAIL, VERIFY_ACCOUNT_SUCCESS, VERIFY_ACCOUNT_FAILED,
    RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILED, 
    CHANGE_PASSWORD_FAILED, CHANGE_PASSWORD_SUCCESS } from '../actions/types';

const initialState = {
    token: null,
    isAuthenticated: null,
    isLoading: false,
    user: null
};

export default function(state = initialState, action) {
    switch(action.type) {
        // case USER_LOADING:
        //     return {
        //         ...state,
        //         isLoading: true
        //     };
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload
            };
        case VERIFY_ACCOUNT_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false
            };
        case RESET_PASSWORD_FAILED:
        case RESET_PASSWORD_SUCCESS:
        case VERIFY_ACCOUNT_FAILED:
        case REGISTER_SUCCESS:
        case REGISTER_FAIL:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case AUTH_ERROR:
            localStorage.removeItem('token');
            return {
                ...state,
                isAuthenticated: false,
                isLoading: false,
                user: null
            };
        default:
            return state;
    }
}