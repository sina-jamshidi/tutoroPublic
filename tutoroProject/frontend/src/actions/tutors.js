import axios from 'axios';

import { GET_TUTORS_SUCCESS, ADD_TUTOR_SUCCESS, ADD_TUTOR_FAIL, UPDATE_TUTOR_PRICE_SUCCESS, 
    UPDATE_TUTOR_PRICE_FAIL, REMOVE_TUTOR_SUCCESS, REMOVE_TUTOR_FAIL, GET_ERRORS } from './types';

import { tokenConfig } from './auth';
import { createMessage, returnErrors } from './messages';

//GET TUTORS
export const getTutors = () => (dispatch, getState) => {
    axios.get('/api/tutors', tokenConfig(getState)).then(res => {
        dispatch({
            type: GET_TUTORS_SUCCESS,
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

// Add tutor record (ie. a course you need help with)
//TODO: add a course_loading action to display a loading animation on frontend until request is 
//returned
export const addTutor = (course_id, price) => (dispatch, getState) => {
    //headers 
    const config = tokenConfig(getState);

    // request body
    const body = JSON.stringify({
        course_id:course_id, price:price
    });

    axios.post('/api/tutors/add', body, config).then(res => {
        dispatch(createMessage({ courseAdded: "Course added successfully." }));        
        dispatch({
            type: ADD_TUTOR_SUCCESS,
            payload: res.data
        });
    }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: ADD_TUTOR_FAIL
        });
    });
}

// Remove tutor record (ie. remove a course that you need help with)
export const removeTutor = (course_id) => (dispatch, getState) => {
    //headers 
    const config = tokenConfig(getState);

    // request body
    const body = JSON.stringify({
        course_id:course_id
    });

    axios.delete('/api/tutors/del', {headers:config.headers, data:body}).then(res => {
        dispatch(createMessage({ courseRemoved: "Course removed successfully." }));        
        dispatch({
            type: REMOVE_TUTOR_SUCCESS,
            payload: course_id
        });
    }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: REMOVE_TUTOR_FAIL
        });
    });
}

// update the price field on a course
export const updateTutorPrice = (course_id, price) => (dispatch, getState) => {
    //headers 
    const config = tokenConfig(getState);

    // request body
    const body = JSON.stringify({
        course_id:course_id, price:price
    });

    axios.put('/api/tutors/update_price', body, config).then(res => {
        dispatch(createMessage({ priceUpdated: "Price updated successfully." }));        
        dispatch({
            type: UPDATE_TUTOR_PRICE_SUCCESS,
            payload: res.data
        });
    }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: UPDATE_TUTOR_PRICE_FAIL
        });
    });
}