import web3 from '../ethereum/web3';
import CrowdFundingContract from '../ethereum/crowdfunding';
import CampaignContractGenerator from '../ethereum/campaign';

export function getUserProfile()
{
    return async dispatch =>
    {
        const accounts = await web3.eth.getAccounts();

        const details = await CrowdFundingContract.methods.getMember(accounts[0]).call();

        dispatch({
            type: "FETCH_USER_PROFILE",
            payload: {
                name: details[0],
                campaigns: details[1]
            }
        });
    }
}

export function getUserCampaigns( campaignAddress )
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
            type: "FETCH_USER_CAMPAIGNS",
            payload: obj
        });
    }
}
