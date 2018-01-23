import {
    FETCH_PROTECTED_DATA_SUCCESS,
    FETCH_PROTECTED_DATA_ERROR
} from '../actions/protected-data';

const initialState = {
    data: [],
    error: null,
    yourCoins: [],
    entry: []
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD COIN TO LIST':
        console.log(action, state);
            console.log('Add coin to list::::::', ...state.yourCoins, ...action.data)
            return {
                ...state,
                // data: action.data,
                error: null,
                yourCoins: [...state.yourCoins, ...action.entry]
            }
        case FETCH_PROTECTED_DATA_SUCCESS:
            console.log('action',action)
            return {
                ...state,
                data: action.data,
                error: null
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
