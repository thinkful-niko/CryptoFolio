import {API_BASE_URL} from '../config';
import {normalizeResponseErrors} from './utils';

export const FETCH_PROTECTED_DATA_SUCCESS = 'FETCH_PROTECTED_DATA_SUCCESS';
//Not being used anymore
export const fetchProtectedDataSuccess = (data, entry, historicalData) => ({
    type: FETCH_PROTECTED_DATA_SUCCESS,
    data,
    entry,
    historicalData
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

// export const fetchProtectedData = () => (dispatch, getState) => {
//     const authToken = getState().auth.authToken;
//     return fetch(`${API_BASE_URL}/protected`, {
//         method: 'GET',
//         headers: {
//             // Provide our auth token as credentials
//             Authorization: `Bearer ${authToken}`
//         }
//     })
//         .then(res => normalizeResponseErrors(res))
//         .then(res => res.json())
//         .then(({data}) => {
//             console.log('protected-data.js22', data);
//             dispatch(fetchProtectedDataSuccess(data))
//         })
//         .catch(err => {
//             dispatch(fetchProtectedDataError(err));
//         });
// };

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
        .then(({data, entry, historicalData}) => {
            //data is the data from ALL coins
            //entry is the user coins
            console.log('protected-data.js', data, entry, historicalData);
            dispatch(fetchProtectedDataSuccess(data, entry, historicalData));
        })
        .catch(err => {
            dispatch(fetchProtectedDataError(err));
        });
        
};

