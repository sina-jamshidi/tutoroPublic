import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import students from './students';
import courses from './courses';
import tutors from './tutors';
import auth from './auth';
import errors from './errors';
import messages from './messages';
import profile from './profile';
import match from './match';


const appReducer = combineReducers({
    courses,
    students,
    tutors,
    auth,
    profile,
    match,
    messages,
    errors,
  });

const rootReducer = (state, action) => {
    // when a logout action is dispatched it will reset redux state
    if (action.type === 'LOGOUT_SUCCESS' || action.type === 'LOGOUT_FAIL') {
        storage.removeItem('persist:root');
        const { courses } = state;
        state = { courses };
    }

    return appReducer(state, action);
};

export default rootReducer;

// export default combineReducers({
//     courses,
//     students,
//     tutors,
//     auth,
//     profile,
//     match,
//     messages,
//     errors,
// });