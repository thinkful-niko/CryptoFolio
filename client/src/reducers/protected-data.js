import {
    FETCH_PROTECTED_DATA_SUCCESS,
    FETCH_PROTECTED_DATA_ERROR
} from '../actions/protected-data';

const initialState = {
    data: [],
    error: null,
    yourCoins: [],
    chartData: [],
    unique: [],
    randomColor: [],
    userId: null
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        //Pushes last entry into yourCoins array, also updates the chart with new data.
        case 'PUSH_ENTRY_TO_STATE':
            console.log('PUSH_ENTRY_TO_STATE', action, state);
            let yourCoinsArr = state.yourCoins;
            let lastEntry = action.entry;
            yourCoinsArr.push(lastEntry);
            let dummyData = action.historicalData;
            let chartDataUpdate = action.historicalData;
            chartDataUpdate.push(...dummyData);
            console.log(`ADDED lastEntry = ${lastEntry} TO yourCoinsArr = ${yourCoinsArr} HISTORICAL = ${chartDataUpdate}`);
            return {
                ...state,
                // data: action.data,
                error: null,
                yourCoins: [...yourCoinsArr],
                chartData: [...chartDataUpdate]
            }
        //Renders Initial State and sets data to all data from the db
        case FETCH_PROTECTED_DATA_SUCCESS:
            //Generates random color for the <chart />. Placed here to avoid re-rendering colors on state changes.
            let randomColorArr=[];
            for (let i = 0; i<52; i++){
                let randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
                randomColorArr.push(randomColor);
            }
            console.log('FETCH action',action)
            console.log(JSON.stringify(action.historicalData));
            return {
                ...state,
                data: [...action.data],
                error: null,
                yourCoins: [...action.entry],
                chartData: [...action.historicalData],
                unique: [...action.unique],
                randomColor: [...randomColorArr],
                userId: action.userId
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
