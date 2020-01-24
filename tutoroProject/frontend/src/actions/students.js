import axios from 'axios';

import { GET_STUDENTS_SUCCESS, ADD_STUDENT_SUCCESS, ADD_STUDENT_FAIL, 
    REMOVE_STUDENT_SUCCESS, REMOVE_STUDENT_FAIL, GET_ERRORS } from './types';

import { tokenConfig } from './auth';
import { createMessage, returnErrors } from './messages';

//GET STUDENTS
export const getStudents = () => (dispatch, getState) => {
    axios.get('/api/students', tokenConfig(getState)).then(res => {
        dispatch({
            type: GET_STUDENTS_SUCCESS,
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

// Add student record (ie. a course you need help with)
//TODO: add a course_loading action to display a loading animation on frontend until request is 
//returned
export const addStudent = (course_id) => (dispatch, getState) => {
    //headers 
    const config = tokenConfig(getState);

    // request body
    const body = JSON.stringify({
        course_id: course_id
    });

    axios.post('/api/students/add', body, config).then((res) => {
        dispatch(createMessage({ courseAdded: "Course added successfully." }));        
        dispatch({
            type: ADD_STUDENT_SUCCESS,
            payload: res.data
        });
    }).catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: ADD_STUDENT_FAIL,
        });
    });
}

// Remove student record (ie. remove a course that you need help with)
export const removeStudent = (course_id) => (dispatch, getState) => {
    //headers 
    const config = tokenConfig(getState);
    // request body
    const body = JSON.stringify({
        course_id: course_id
    });

    axios.delete('/api/students/del', {headers:config.headers, data:body}).then(res => {
        dispatch(createMessage({ courseRemoved: "Course removed successfully." }));        
        dispatch({
            type: REMOVE_STUDENT_SUCCESS,
            payload: course_id
        });
    }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: REMOVE_STUDENT_FAIL
        });
    });
}