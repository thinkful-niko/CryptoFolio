import React from 'react'


//How to create the href? You will need to pass in the user ID and coin ID (delete on match?, if user XYZXYXYZ has bitcoin, delete all iterations of bitcoins for this user), or create a new _id for the entry (easier, but how to handle duplicates?).

const Table = (props) => (

<div className='coinsTable'>
              <tr>
                 <th className='coinTableName'>{props.coin.symbol} </th>
                  <th>{props.coin.amount} </th>
                  <th>${parseFloat(props.coin.price_usd, 10).toFixed(4)} </th>
                  <th className='coinTableValue'>${parseFloat(parseFloat(props.coin.amount, 10) * parseFloat(props.coin.price_usd, 10)).toFixed(2)} </th>
                  <th className='deleteCoin'><a title={`Delete ${props.coin.symbol}`} href={`/delete/${props.coin.userId}/${props.coin.id}`}>X</a></th>
              </tr>
</div>

)
export default Table
