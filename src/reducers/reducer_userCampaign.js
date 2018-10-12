const initState = null;

export default (state = initState, action) =>
{
    switch (action.type) 
    {
        case "FETCH_USER_CAMPAIGNS":
            const newState = [];
            if(state !== null)
            {
                newState.push(state);
            }
            newState.push(action.payload);
            return newState;

        default:
            return state;
    }
}
