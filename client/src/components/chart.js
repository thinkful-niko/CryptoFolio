/* TODO:
-Recharts only needs the dataKey, so there should be no need to recreate chartPoints data on 'userChartDataArr', it can be a collection of keys matched from user and historical.
-Use a normal for loop instead of a foreach.
-You have to handle amounts though


Processing Data:
	-Loop through array of objects (main historical data)
	-Loop through its objects (snapshots)
	-Loop through user coins and match with each object inside original array (snapshots)
	-Output new array of objects with: date, price*amount, containing only user coins.

Creating chart:
	-Loop through the new array of objects
	-For each object, create a new <Area /> with its key


	chartPointsArr = [{date, btc,th,io,dfs,dfsd},{tc,th,io,dfs,dfsd},{tc,th,io,dfs,dfsd},{tc,th,io,dfs,dfsd},{tc,th,io,dfs,dfsd},....]
	userCoins = [{btc},{eth}]

	userChartDataArr = [{btc,eth}]


	for(var i=0; i<myCoins; i++){ 
    for(var j=o; j<snapShot; j++){
     if (match){ do logic; return; }
  }
}


*/

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

//VALUES NEED TO BE NUMBERS
const Chart = (props) => {
	let colorArr = ['#ff0c00', '#b2b200', '#00b217', '#04a0a0', '#0422d1', '#aa08af', '#7f133e', '#000000', '#af0024', '#ffa100', '#b523bc','#68464d','#2b6c77', '#007ec4','#a09d00', '#0e700c', '#42a040', '#29510c', '#026d29', '#098c7a', '#1daf9b', '#11423b',  '#32484c', '#2d627f', '#015c8e',  '#0e1a6d', '#333968', '#0f1228', '#45336d', '#63107f', '#91175c', '#4f052f', '#4f0516', '#756b49', '#4b7549', '#425954', '#424b59', '#433356', '#1a1d26', '#745b7a'];
	let keysArr = []; //will give the user keys to <Area /> because for in loop isn't working. It HAS to be mapped.
	console.log('CHART', props);
	let randomStroke;

	let chartPointsArr = props.data;

	let userCoins = props.userCoins;

	//This becomes the data that generates the final chart
	let userChartDataArr = [];

	console.log('CHARTDATA',chartPointsArr)

	//NEW HIGH EFFICIENCY LOOP, it loops only twice and never loops through the object, it matches symbol through a dynamic object key '[coinSymbol]'
	//For EACH snapshot:
	for(let dD = 0; dD < chartPointsArr.length; dD++){
		//Create an object (user unique snapshot)
	  	let newObj = {};
	  	//Give it a date
	  	newObj.date = chartPointsArr[dD].date;
	  	//For each user coin
	  	for(let uC = 0; uC < userCoins.length; uC++){
	  		//Get the symbol
	    	let coinSymbol = userCoins[uC].symbol;
	    	//Give the newObj a symbol and get the data from the historical snap, multiply it by the user amount.
	    	newObj[coinSymbol] = chartPointsArr[dD][coinSymbol]*userCoins[uC].amount;
	  	}
	  	//construct the user unique snapshot array (userChartDataArr)
	  	userChartDataArr.push(newObj);
	  	console.log(newObj);
	}

	
		for (let singleKey in userChartDataArr[0]){
			if(singleKey != 'date'){
				keysArr.push(singleKey)
			}
		}
//Creating chart. It only needs to create one <Area /> per key, not per object. But, it doesn't accepts loops, you need to create an array with the keys then map it to create each <Area />
		let AreaChartCreation = keysArr.map((key, index) => {
			randomStroke = colorArr[index];
			return <Area type='monotone' dataKey={key} stackId={index} stroke={randomStroke} fill={randomStroke} />
		})


	return(
		<AreaChart width={(window.innerWidth/100)*60} height={(window.innerHeight/100)*60} data={userChartDataArr}
        margin={{top: 30, right: 30, left: 30, bottom: 0}}>
            <XAxis dataKey="date"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            {AreaChartCreation}
        </AreaChart>
    )
}

export default Chart;