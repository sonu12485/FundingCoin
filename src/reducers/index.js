import { combineReducers } from 'redux';

import User from './reducer_user';

const rootReducer = combineReducers({
    user: User
});

export default rootReducer;
