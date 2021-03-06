import React from 'react';

const Table = (props) => (

<div className='coinsTable'>
              <tr>
                 <th className='coinTableName'>{props.coin.symbol} </th>
                  <th>{props.coin.amount} </th>
                  <th>${parseFloat(props.coin.price_usd, 10).toFixed(4)} </th>
                  <th className='coinTableValue'>${parseFloat(parseFloat(props.coin.amount, 10) * parseFloat(props.coin.price_usd, 10)).toFixed(2)} </th>
                  <th className='deleteCoin'><a title={`Delete ${props.coin.symbol}`} 
                    onClick={() => {
                      props.removeFunction(props.coin.userId, props.coin.id);
                    }}>
                      X
                    </a>
                  </th>
              </tr>
</div>

)
export default Table
