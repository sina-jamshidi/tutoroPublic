import { GET_PROFILE_SUCCESS, LOGOUT_SUCCESS, ADD_STUDENT_SUCCESS, REMOVE_STUDENT_SUCCESS,
    ADD_TUTOR_SUCCESS, REMOVE_TUTOR_SUCCESS} from '../actions/types';

const initialState = {
    profile : null
};

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_PROFILE_SUCCESS:
            return {
                ...state,
                profile: action.payload
            };
        case ADD_STUDENT_SUCCESS:
            return {
                ...state,
                profile: {
                    student: [...state.profile.student, action.payload],
                    tutor: state.profile.tutor
                }
            };
        case ADD_TUTOR_SUCCESS:
            return {
                ...state,
                profile: {
                    student: state.profile.student,
                    tutor: [...state.profile.tutor, action.payload],
                }
            };
        case REMOVE_STUDENT_SUCCESS:
            return {
                ...state,
                profile: {
                    student: state.profile.student.filter(obj => obj.course !== action.payload),
                    tutor: state.profile.tutor
                }
            };
        case REMOVE_TUTOR_SUCCESS:
            return {
                ...state,
                profile: {
                    student: state.profile.student,
                    tutor: state.profile.tutor.filter(obj => obj.course !== action.payload)
                }
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                profile: null
            };
        default:
            return state;
    }
}