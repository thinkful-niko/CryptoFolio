import {
    FETCH_PROTECTED_DATA_SUCCESS,
    FETCH_PROTECTED_DATA_ERROR
} from '../actions/protected-data';

const initialState = {
    data: [],
    error: null,
    yourCoins: [],
    chartData: [],
    unique: []

};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        //Pushes last entry into yourCoins array, also updates the chart with new data.
        case 'PUSH_ENTRY_TO_STATE':
            console.log('PUSH_ENTRY_TO_STATE', action, state);
            let yourCoinsArr = state.yourCoins;
            let lastEntry = action.entry;
            yourCoinsArr.push(lastEntry);
            let dummyData = [{"BTC":55159.449999999999,"date":5,"ETH":2284.52,"MIOTA":821.876}];
            let chartDataUpdate = action.historicalData;
            chartDataUpdate.push(dummyData[0]);
            console.log(`ADDED lastEntry = ${lastEntry} TO yourCoinsArr = ${yourCoinsArr}`);
            return {
                ...state,
                // data: action.data,
                error: null,
                yourCoins: [...yourCoinsArr],
                chartData: [...chartDataUpdate]
            }
        //Renders Initial State and sets data to all data from the db
        case FETCH_PROTECTED_DATA_SUCCESS:
            console.log('FETCH action',action)
            console.log(JSON.stringify(action.historicalData));
            return {
                ...state,
                data: [...action.data],
                error: null,
                yourCoins: [...action.entry],
                chartData: [...action.historicalData],
                unique: [...action.unique]
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
