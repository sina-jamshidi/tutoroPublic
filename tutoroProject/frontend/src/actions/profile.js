import axios from 'axios';

import { GET_PROFILE_SUCCESS, GET_ERRORS } from './types';

import { tokenConfig } from './auth';

// get profile details (what courses need help with, what courses tutoring)
export const getProfile = () => (dispatch, getState) => {
    axios.get('/api/profile/details', tokenConfig(getState)).then(res => {
        dispatch({
            type: GET_PROFILE_SUCCESS,
            payload: res.data
        })
        }).catch(err => {
            const errors = {
                msg: err.response.data,
                status: err.response.status
            }
            dispatch({
                type: GET_ERRORS,
                payload: errors,
            });
        });
};