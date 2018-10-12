const initState = null;

export default (state = initState, action) => 
{
    switch(action.type)
    {
        case "FETCH_ALL_CAMPAIGNS_ADDRESS":
            return action.payload;

        default:
            return state;
    }
}
