import {
    FETCH_PROTECTED_DATA_SUCCESS,
    FETCH_PROTECTED_DATA_ERROR
} from '../actions/protected-data';

//If I set the initial state of yourCoins to the entry, I might be able to make the state work inside the dashboard
const initialState = {
    data: [],
    error: null,
    yourCoins: [],
    chartData: []

};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        //Pushes last entry into yourCoins array
        case 'PUSH_ENTRY_TO_STATE':
            console.log('PUSH_ENTRY_TO_STATE', action.entry, state.yourCoins);
            let yourCoinsArr = state.yourCoins;
            let lastEntry = action.entry;
            yourCoinsArr.push(lastEntry);
            console.log(`ADDED lastEntry = ${lastEntry} TO yourCoinsArr = ${yourCoinsArr}`);
            return {
                ...state,
                // data: action.data,
                error: null,
                yourCoins: [...yourCoinsArr]
            }
        //Renders Initial State and sets data to all data from the db
        case FETCH_PROTECTED_DATA_SUCCESS:
            console.log('FETCH action',action)
            return {
                ...state,
                data: [...action.data],
                error: null,
                yourCoins: [...action.entry],
                chartData: [...action.historicalData]
            }
        case FETCH_PROTECTED_DATA_ERROR:
            return{
                ...state,
                error: action.error
            }
        default:
            return state
    }

}
