import { EMAIL_LOADING, ADD_MATCH_STUDENT_SUCCESS, ADD_MATCH_STUDENT_FAIL,
ADD_MATCH_TUTOR_SUCCESS, ADD_MATCH_TUTOR_FAIL } from '../actions/types';

const initialState = {
    emails: [],
};

export default function(state = initialState, action) {
    switch(action.type) {
        case ADD_MATCH_STUDENT_SUCCESS:
        case ADD_MATCH_TUTOR_SUCCESS:
            return {
                ...state,
                emails: [...state.emails, action.payload]
            };
        case ADD_MATCH_STUDENT_FAIL:
        case ADD_MATCH_TUTOR_FAIL:
            return {
                ...state,
                emails: [...state.emails]
            };
        default:
            return state;
    }
}