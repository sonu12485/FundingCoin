const initState = null;

export default (state = initState, action) => 
{
    switch(action.type)
    {
        case "FETCH_USER_PROFILE":
            console.log(action);
            return action.payload;

        default:
            return state;
    }
}
