import {API_BASE_URL} from '../config';
import {normalizeResponseErrors} from './utils';

export const FETCH_PROTECTED_DATA_SUCCESS = 'FETCH_PROTECTED_DATA_SUCCESS';

export const fetchProtectedDataSuccess = (data, entry, historicalData, unique) => ({
    type: FETCH_PROTECTED_DATA_SUCCESS,
    data,
    entry,
    historicalData,
    unique
});

export const pushEntryToState = (data, entry, historicalData) => ({
    type: 'PUSH_ENTRY_TO_STATE',
    data,
    entry,
    historicalData
});

export const FETCH_PROTECTED_DATA_ERROR = 'FETCH_PROTECTED_DATA_ERROR';
export const fetchProtectedDataError = error => ({
    type: FETCH_PROTECTED_DATA_ERROR,
    error
});

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
        .then(({allData, entry, historicalData, unique}) => {
            //data is the data from ALL coins
            //entry is the user coins
            console.log('protected-data.js', allData, entry, historicalData, unique);
            dispatch(fetchProtectedDataSuccess(allData, entry, historicalData, unique));
        })
        .catch(err => {
            dispatch(fetchProtectedDataError(err));
        });
        
};
