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
            let yourCoinsArr = state.yourCoins;
            let lastEntry = action.entry;
            //MAKE COIN ADDITION USER UNIQUE - IF TWO USERS ARE LOGGED IN, WILL THEY SEE EACH OTHER ADDING COINS WITHOUT A FILTER HERE?
            yourCoinsArr.push(lastEntry);

            let addUniqueCoins = [];

            let result = [] ;
            //This stopped working, probably something to do with result being empty
            yourCoinsArr.forEach((coin)=>{
                console.log('COIN',coin);
                
                    for(var r=0; r<result.length; r++){
                
                        if(result[r].id == coin.id){// if duplicate
                            result[r]['amount'] += Number(coin.amount); //add amounts
                            //console.log('ADDED', coin.id);
                            return;
                        }
                    }

                result.push({symbol: coin.symbol, id:coin.id,amount:Number(coin.amount), price_usd:Number(coin.price_usd), userId: coin.userId})
            })

            return {
                ...state,
                // data: action.data,
                error: null,
                yourCoins: [...result],
            }
        //Renders Initial State and sets data to all data from the db
        case FETCH_PROTECTED_DATA_SUCCESS:

            //Initiate yourCoins with coins filtered by UserID

            let allEntries = [...action.entry];

            //Update prices on user coins with current prices
            action.unique.forEach((allDataCoin) => {
                allEntries.forEach((userSingleCoin) => {
                    if (userSingleCoin.id == allDataCoin.id){
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
        case 'REMOVE_HANDLER':
            console.log('REMOVE_HANDLER', action.removedData.id, state);
            let newYourCoinsArr = state.yourCoins.filter(obj => {
                return obj.id !== action.removedData.id
            });
            console.log(newYourCoinsArr);
            
            return{
                ...state,
                yourCoins: newYourCoinsArr

            }
        default:
            return state
    }


}
