const initState = null;

export default (state = initState, action) => 
{
    switch(action.type)
    {
        case "FETCH_USER_PROFILE":
            return action.payload;

        default:
            return state;
    }
}
