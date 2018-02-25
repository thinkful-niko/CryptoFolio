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

            //This stopped working, probably something to do with result being empty
            yourCoinsArr.forEach((coin)=>{
                //console.log(coin.id)
                
                    for(var r=0; r<result.length; r++){
                
                        if(result[r].id == coin.id){// if duplicate
                            result[r]['amount'] += Number(coin.amount); //add amounts
                            console.log('ADDED', coin.id);
                            return;
                        }
                    }

                result.push({symbol: coin.symbol, id:coin.id,amount:Number(coin.amount), price_usd:Number(coin.price_usd), userId: coin.userId})
            })



            //console.log('ADD UNIQUE COINS:',...addUniqueCoins)
            // let dummyData = action.historicalData;
            // let chartDataUpdate = action.historicalData;
            // chartDataUpdate.push(...dummyData);
            // console.log(`ADDED lastEntry = ${lastEntry} TO yourCoinsArr = ${yourCoinsArr} HISTORICAL = ${chartDataUpdate}`);
            return {
                ...state,
                // data: action.data,
                error: null,
                yourCoins: [...result],
            }
        //Renders Initial State and sets data to all data from the db
        case FETCH_PROTECTED_DATA_SUCCESS:
            
            console.log('FETCH action',action)
            console.log(JSON.stringify('HSD', ...action.historicalData));


            //Initiate yourCoins with coins filtered by UserID

            let allEntries = [...action.entry];
            console.log('ALLENTRIES', allEntries, 'UNIQUE',action.unique);

            //Update prices on user coins with current prices
            action.unique.forEach((allDataCoin) => {
                allEntries.forEach((userSingleCoin) => {
                    if (userSingleCoin.id == allDataCoin.id){
                        console.log('THIS COIN', userSingleCoin.price_usd);
                        userSingleCoin.price_usd = allDataCoin.price_usd;
                    }
                })
            })

            let userUniqueEntries = [];
            allEntries.forEach(coin=>{
                if(coin.userId === action.userId){
                    userUniqueEntries.push(coin);
                };
            })
            let userCoinsArr = userUniqueEntries;
            let addedResult = [] 

            userCoinsArr.forEach((coin)=>{
                //console.log(coin.id)
                
                    for(var h=0; h<addedResult.length; h++){
                
                        if(addedResult[h].id == coin.id){// if duplicate
                            addedResult[h]['amount'] += Number(coin.amount); //add amounts
                            return;
                        }
                    }

                addedResult.push({symbol: coin.symbol, id:coin.id,amount:Number(coin.amount), price_usd:Number(coin.price_usd), userId: coin.userId})
            })



            // console.log('USER UNIQUE',userUniqueEntries);
            // console.log('UNIQUE Reducer', ...action.unique);
            console.log('ACTION:', action);
            return {
                ...state,
                data: [...action.unique],
                error: null,
                yourCoins: [...addedResult],
                chartData: [...action.historicalData],
                unique: [...action.unique],
                userId: action.userId
            }

        case FETCH_PROTECTED_DATA_ERROR:
            return{
                ...state,
                error: action.error
            }
        case 'CREATE_COLORS':
            let randomColorArr=[];
            for (let i = 0; i<100; i++){
                let randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
                randomColorArr.push(randomColor);
            }
            return {
                ...state,
                randomColor: [...randomColorArr]
            }
        default:
            return state
    }

}
