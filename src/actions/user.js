import web3 from '../ethereum/web3';
import CrowdFundingContract from '../ethereum/crowdfunding';

export function getUserProfile()
{
    return async dispatch =>
    {
        const accounts = await web3.eth.getAccounts();

        const name = await CrowdFundingContract.methods.getMember(accounts[0]).call();

        dispatch({
            type: "FETCH_USER_PROFILE",
            payload: {
                name
            }
        });
    }
}
