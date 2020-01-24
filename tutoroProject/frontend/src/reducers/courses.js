import { GET_COURSES_SUCCESS } from '../actions/types.js';

const initialState = {
    courses : []
};

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_COURSES_SUCCESS:
            return {
                ...state,
                courses: action.payload
            };
        default:
            return state;
    }
}