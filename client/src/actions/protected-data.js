import {API_BASE_URL} from '../config';
import {normalizeResponseErrors} from './utils';

export const FETCH_PROTECTED_DATA_SUCCESS = 'FETCH_PROTECTED_DATA_SUCCESS';

export const fetchProtectedDataSuccess = (data, entry, historicalData, unique, userId) => ({
    type: FETCH_PROTECTED_DATA_SUCCESS,
    data,
    entry,
    historicalData,
    unique,
    userId
});

export const removeUserCoinSuccess = (removedData) => ({
    type: 'REMOVE_HANDLER',
    removedData,
});

export const pushEntryToState = (data, entry, userId) => ({
    type: 'PUSH_ENTRY_TO_STATE',
    data,
    entry,
    // historicalData,
    userId

});


export const FETCH_PROTECTED_DATA_ERROR = 'FETCH_PROTECTED_DATA_ERROR';
export const fetchProtectedDataError = error => ({
    type: FETCH_PROTECTED_DATA_ERROR,
    error
});

export const createColors = () => ({
    type: 'CREATE_COLORS'
})

export const getCoinData = () => (dispatch, getState) => {
    const authToken = getState().auth.authToken;
    return fetch(`${API_BASE_URL}/coinData`, {
        method: 'GET',
        headers: {
            // Provide our auth token as credentials
            Authorization: `Bearer ${authToken}`
        }
    })
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then(({allData, entry, historicalData, unique, userId}) => {
            //data is the data from ALL coins
            //entry is the user coins
            console.log('protected-data.js', allData, entry, historicalData, unique, userId);
            dispatch(fetchProtectedDataSuccess(allData, entry, historicalData, unique, userId));
        })
        .catch(err => {
            dispatch(fetchProtectedDataError(err));
        });
        
};

export const removeUserCoin = (userRemoved, coinRemove) => (dispatch, getState) => {
    console.log(userRemove, coinRemove);
    console.log(getState().auth.currentUser.id);
    let userRemove = getState().auth.currentUser.id;
    const authToken = getState().auth.authToken;
    return fetch(`${API_BASE_URL}/remove`, {
        method: 'DELETE',
        body: JSON.stringify({
            userID: userRemove, 
            coinName: coinRemove
        }),
        headers: {
            // Provide our auth token as credentials
              // Provide our auth token as credentials
            Authorization: `Bearer ${authToken}`,
             'Accept': 'application/json, text/plain, */*',
             'Content-Type': 'application/json'
        }
    })
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then(res => {
            console.log('removeUserCoin', res);
            dispatch(removeUserCoinSuccess(res));
        })
        .catch(err => {
            //dispatch(fetchProtectedDataError(err));
        });
        
};