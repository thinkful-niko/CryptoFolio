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
            //MAKE COIN ADDITION USER UNIQUE - IF TWO USERS ARE LOGGED IN, WILL THEY SEE EACH OTHER ADDING COINS WITHOUT A FILTER HERE?
            yourCoinsArr.push(lastEntry);
            console.log('ADDED COINS:',yourCoinsArr);

            let addUniqueCoins = [];
//PROBLEMATIC ---->Handles Unique Coins What if multiple users are logged in and they add coins (it should be fine, because it doesnt update over the server)? For some reason this is not triggering a render
            // yourCoinsArr.forEach((coin)=>{
            //     if(coin.userId === action.userId){
            //         console.log('User Ids:', coin)
            //         addUniqueCoins.push(coin);
            //     };
            // })

            let result = [] 
            yourCoinsArr.forEach((coin)=>{
                //console.log(coin.id)
                
                    for(var r=0; r<result.length; r++){
                
                        if(result[r].id == coin.id){// if duplicate
                            result[r]['amount'] += Number(coin.amount); //add amounts
                            return;
                        }
                    }

                result.push({symbol: coin.symbol, id:coin.id,amount:Number(coin.amount), price_usd:Number(coin.price_usd), userId: coin.userId})
            })



            console.log('ADD UNIQUE COINS:',...addUniqueCoins)
            let dummyData = action.historicalData;
            let chartDataUpdate = action.historicalData;
            chartDataUpdate.push(...dummyData);
            console.log(`ADDED lastEntry = ${lastEntry} TO yourCoinsArr = ${yourCoinsArr} HISTORICAL = ${chartDataUpdate}`);
            return {
                ...state,
                // data: action.data,
                error: null,
                yourCoins: [...result],
                chartData: [...chartDataUpdate]
            }
        //Renders Initial State and sets data to all data from the db
        case FETCH_PROTECTED_DATA_SUCCESS:
            //Generates random color for the <chart />. Placed here to avoid re-rendering colors on state changes.
            //THERE HAS TO BE A BETTER PLACE TO CODE THE RANDOM COLOR, also their randomness is in very close ranges (sometimes resulting in similar colors).
            let randomColorArr=[];
            for (let i = 0; i<100; i++){
                let randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
                randomColorArr.push(randomColor);
            }
            console.log('FETCH action',action)
            console.log(JSON.stringify('HSD', ...action.historicalData));

            //Initiate yourCoins with coins filtered by UserID
            let allEntries = [...action.entry];
            let userUniqueEntries = [];
            allEntries.forEach(coin=>{
                if(coin.userId === action.userId){
                    userUniqueEntries.push(coin);
                };
            })
            console.log('USER UNIQUE',userUniqueEntries);
            console.log('UNIQUE Reducer', ...action.unique);
            return {
                ...state,
                data: [...action.data],
                error: null,
                yourCoins: [...userUniqueEntries],
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
