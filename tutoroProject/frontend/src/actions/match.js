import axios from 'axios';

import { ADD_MATCH_STUDENT_SUCCESS, ADD_MATCH_STUDENT_FAIL, 
    ADD_MATCH_TUTOR_SUCCESS, ADD_MATCH_TUTOR_FAIL, EMAIL_LOADING } from './types';

import { tokenConfig } from './auth';
import { createMessage, returnErrors } from './messages';

// adding a match when a student wants to get the email of a tutor
// own id will be student id from token
// "match id" will be tutor id passed as parameter when student clicks link
export const addMatchStudent = (match_id, course_id) => (dispatch, getState) => {
    const config = tokenConfig(getState);

    // request body
    const body = JSON.stringify({
        match_id: match_id,
        course_id: course_id
    });
    
    axios.post('/api/match/student/add', body, config).then((res) => {
        dispatch({
            type: ADD_MATCH_STUDENT_SUCCESS,
            payload: res.data
        });
    }).catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: ADD_MATCH_STUDENT_FAIL,
        });
    });
};

// adding a match when a tutor wants to get the email of a student
// own id will be tutor id from token
// "match id" will be student id passed as parameter when tutor clicks link

// Add student record (ie. a course you need help with)
//TODO: add a course_loading action to display a loading animation on frontend until request is 
//returned
export const addMatchTutor = (match_id, course_id) => (dispatch, getState) => {
    const config = tokenConfig(getState);

    // request body
    const body = JSON.stringify({
        match_id: match_id,
        course_id: course_id
    });
    
    axios.post('/api/match/tutor/add', body, config).then((res) => {
        dispatch({
            type: ADD_MATCH_TUTOR_SUCCESS,
            payload: res.data
        });
    }).catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: ADD_MATCH_TUTOR_FAIL,
        });
    });
};