import CrowdFundingContract from '../ethereum/crowdfunding';
import CampaignContractGenerator from '../ethereum/campaign';

export function getAllCampaignAddress()
{
    return async dispatch =>
    {
        const campaigns = await CrowdFundingContract.methods.getAllCampaigns().call();

        dispatch({
            type: "FETCH_ALL_CAMPAIGNS_ADDRESS",
            payload: campaigns
        });
    }
}

export function getAllCampaigns( campaignAddress )
{
    return async dispatch =>
    {
        const CampaignContract = CampaignContractGenerator(campaignAddress);
        
        const summary = await CampaignContract.methods.getSummary().call();

        const obj = {
            name: summary[0],
            description: summary[1],
            min: summary[2],
            startDate: summary[3],
            active: summary[4],
            manager: summary[5],
            balance: summary[6]
        };

        dispatch({
            type: "FETCH_ALL_CAMPAIGNS",
            payload: obj
        });
    }
}
