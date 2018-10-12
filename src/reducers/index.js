import { combineReducers } from 'redux';

import User from './reducer_user';
import UserCampaigns from './reducer_userCampaign';
import AllCampaignAddress from './reducer_allCampaignAddress';
import AllCampaigns from './reducer_allCampaigns';

const rootReducer = combineReducers({
    user: User,
    userCampaigns: UserCampaigns,
    allCampaignAddress: AllCampaignAddress,
    allCampaigns: AllCampaigns
});

export default rootReducer;
