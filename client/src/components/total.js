import React from 'react'

const Total = (props) => {
let totalCount = 0
	return(
		<div>
           {props.coins.map((item, index)=>{
        		totalCount += parseFloat(parseFloat(item.amount, 10) * parseFloat(item.price_usd, 10));
        		console.log(totalCount);
   			})}
		<p>${parseFloat(totalCount, 10).toFixed(2)}</p>
        </div>
    )
}

export default Total;