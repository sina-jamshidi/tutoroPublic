import { GET_STUDENTS_SUCCESS, ADD_STUDENT_SUCCESS, ADD_STUDENT_FAIL, 
    REMOVE_STUDENT_SUCCESS, REMOVE_STUDENT_FAIL } from '../actions/types.js';

const initialState = {
    students : []
};

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_STUDENTS_SUCCESS:
            return {
                ...state,
                students: action.payload
            };
        default:
            return state;
    }
}