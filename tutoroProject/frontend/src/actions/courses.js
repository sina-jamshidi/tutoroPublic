import axios from 'axios';

import { GET_COURSES_SUCCESS, GET_ERRORS } from './types';

//GET ALL COURSES
// gets all courses to cache for easy search/manipulation by frontend
export const getCourses = () => (dispatch) => {
    axios.get('/api/courses/all').then(res => {
        dispatch({
            type: GET_COURSES_SUCCESS,
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