import { GET_TUTORS_SUCCESS, ADD_TUTOR_SUCCESS, ADD_TUTOR_FAIL, 
    REMOVE_TUTOR_SUCCESS, REMOVE_TUTOR_FAIL } from '../actions/types.js';

const initialState = {
    tutors : []
};

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_TUTORS_SUCCESS:
            return {
                ...state,
                tutors: action.payload
            };
        default:
            return state;
    }
}