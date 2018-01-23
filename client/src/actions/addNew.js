import {API_BASE_URL} from '../config';
import {normalizeResponseErrors} from './utils';

export const FETCH_PROTECTED_DATA_SUCCESS = 'FETCH_PROTECTED_DATA_SUCCESS';
export const fetchProtectedDataSuccess = data => ({
    type: FETCH_PROTECTED_DATA_SUCCESS,
    data
});

export const FETCH_PROTECTED_DATA_ERROR = 'FETCH_PROTECTED_DATA_ERROR';
export const fetchProtectedDataError = error => ({
    type: FETCH_PROTECTED_DATA_ERROR,
    error
});


// export const sendEntry = (entry) => (dispatch, getState) => {
//     const authToken = getState().auth.authToken;
//     console.log(authToken);
//     console.log(entry);
//     return fetch(`${API_BASE_URL}/add`, {
//         method: 'POST',
//         body: JSON.stringify(entry),
//         headers: {
//             // Provide our auth token as credentials
//             Authorization: `Bearer ${authToken}`,
//             'Accept': 'application/json, text/plain, */*',
//             'Content-Type': 'application/json'
//         }
//     })
//     .then((response) => {
//         console.log(response);
// //         // socket.emit('add entry', entries);

//       })
// }

export const saveCoinData = (entry) => (dispatch, getState) => {
    const authToken = getState().auth.authToken;
    console.log('entry', entry);
    return fetch(`${API_BASE_URL}/addCoin`, {
        method: 'POST',
        body: JSON.stringify(entry.coinData),
        headers: {
            // Provide our auth token as credentials
            Authorization: `Bearer ${authToken}`,
             'Accept': 'application/json, text/plain, */*',
             'Content-Type': 'application/json'
        }
    })
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then(({data}) => dispatch(fetchProtectedDataSuccess(data)))
        .catch(err => {
            dispatch(fetchProtectedDataError(err));
        });
};