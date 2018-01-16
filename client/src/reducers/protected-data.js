import {
    FETCH_PROTECTED_DATA_SUCCESS,
    FETCH_PROTECTED_DATA_ERROR
} from '../actions/protected-data';

const initialState = {
    data: [],
    error: null
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
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
