import { combineReducers } from 'redux';

import User from './reducer_user';
import UserCampaigns from './reducer_userCampaign';

const rootReducer = combineReducers({
    user: User,
    userCampaigns: UserCampaigns
});

export default rootReducer;
