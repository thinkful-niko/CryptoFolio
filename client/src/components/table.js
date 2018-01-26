import React from 'react'

const Table = (props) => (

<div className='coinsTable'>
          {/*PROBLEM: THIS IS MAPPING ON PAGE LOAD, IT NEEDS TO BE UPDATED ON BUTTON CLICK*/}
              <tr>
                 <th className='coinTableName'>{props.coin.symbol} </th>
                  <th>{props.coin.amount} </th>
                  <th>${parseFloat(props.coin.price_usd, 10).toFixed(4)} </th>
                  <th className='coinTableValue'>${parseFloat(parseFloat(props.coin.amount, 10) * parseFloat(props.coin.price_usd, 10)).toFixed(2)} </th>
              </tr>
</div>

)
export default Table
