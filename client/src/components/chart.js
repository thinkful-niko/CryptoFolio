/* 
The logic behind the historical data formating can be found here: https://codepen.io/DevNeek/pen/ddgoyR?editors=0010
*/

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

//VALUES NEED TO BE NUMBERS
const Chart = (props) => {
	//Random colors wasn't consistent enough, switched to premade color Array;
	let colorArr = [ '#ff0c00', '#b2b200', '#00b217', '#04a0a0', '#0422d1', '#aa08af', '#7f133e', '#000000', '#af0024', '#ffa100', '#b523bc','#68464d','#2b6c77', '#007ec4','#a09d00', '#0e700c', '#42a040', '#29510c', '#026d29', '#098c7a', '#1daf9b', '#11423b',  '#32484c', '#2d627f', '#015c8e',  '#0e1a6d', '#333968', '#0f1228', '#45336d', '#63107f', '#91175c', '#4f052f', '#4f0516', '#756b49', '#4b7549', '#425954', '#424b59', '#433356', '#1a1d26', '#745b7a'];
	let keysArr = []; //will give the user keys to <Area /> because for in loop isn't working. It HAS to be mapped.
	let randomStroke;

	let chartPointsArr = props.data;

	let userCoins = props.userCoins;

	//This becomes the data that generates the final chart
	let userChartDataArr = [];

	//NEW LOOP: it loops only twice and never loops through the object, it matches user symbols through a dynamic object key '[coinSymbol]'
	//For EACH snapshot:
	for(let dD = 0; dD < chartPointsArr.length; dD++){
		//Create an object (user unique snapshot)
	  	let newObj = {TOTAL: 0};
	  	//Give it a date
	  	newObj.date = chartPointsArr[dD].date;
	  	//For each user coin
	  	for(let uC = 0; uC < userCoins.length; uC++){
	  		//Get the symbol
	    	let coinSymbol = userCoins[uC].symbol;
	    	//Give the newObj a symbol and get the data from the historical snap, multiply it by the user amount.
	    	newObj[coinSymbol] = chartPointsArr[dD][coinSymbol]*userCoins[uC].amount;
	    	newObj['TOTAL'] += chartPointsArr[dD][coinSymbol]*userCoins[uC].amount;
	  	}
	  	//construct the user unique snapshot array (userChartDataArr)
	  	userChartDataArr.push(newObj);
	}
		//Construct keys array to be used as dataKey atribute for recharts, removing 'date' from this array
		for (let singleKey in userChartDataArr[0]){
			if(singleKey != 'date' && singleKey !='TOTAL'){
				keysArr.push(singleKey)
			
			}
		}
//Creating chart. It only needs to create one <Area /> per key, not per object. But, it doesn't accepts loops, you need to create an array with the keys then map it to create each <Area />
		let AreaChartCreation = keysArr.map((key, index) => {
			randomStroke = colorArr[index];
			return <Area type='monotone' dataKey={key} stackId={index} stroke={randomStroke} fill='none' />
		})


	return(
		<div>
			<h2 title="Historical Amounts Not Yet Supported">Historical Portfolio Value:</h2>
	        <AreaChart width={(window.innerWidth/100)*60} height={(window.innerHeight/100)*18} data={userChartDataArr}
	        margin={{top: 10, right: 30, left: 30, bottom: 0}}>
	        	<XAxis dataKey="date"/>
	            <YAxis/>
	            <CartesianGrid strokeDasharray="3 3"/>
	            <Tooltip/>
	            <Area type='monotone' dataKey='TOTAL' stackId='999' stroke='#05875e' fill='#2C9699' />
	        </AreaChart>

			<h2 title="Historical Amounts Not Yet Supported">Historical Coin Value:</h2>
			<AreaChart width={(window.innerWidth/100)*60} height={(window.innerHeight/100)*50} data={userChartDataArr}
	        margin={{top: 0, right: 30, left: 30, bottom: 0}}>
	            <XAxis dataKey="date"/>
	            <YAxis/>
	            <CartesianGrid strokeDasharray="3 3"/>
	            <Tooltip/>
	            {AreaChartCreation}
	        </AreaChart>
        </div>
    )
}

export default Chart;