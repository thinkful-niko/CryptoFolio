/* TODO:
-You are running into Asynch problems, chart data doesn't always load correctly, you have to make the client wait for the server to do its thing.

Processing Data:
	-Loop through array of objects
	-Loop through its objects
	-Loop through user coins and match with each object inside original array
	-Output new array of objects with: date, price*amount, containing only user coins.

Creating chart:
	-Loop through the new array of objects
	-For each object, create a new <Area /> with its key
*/

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

//VALUES NEED TO BE NUMBERS
const Chart = (props) => {
	let keysArr = []; //will give the user keys to <Area /> because for in loop isn't working. It HAS to be mapped.
	console.log('CHART', props.data, props.userCoins);
	let randomStroke;
	console.log(randomStroke); //Randomize the color index randomStroke[Math.Random()*TotalIndex];

//Once the synch problem is solved, this will become props.data
	let chartPointsArr = [ 
		{ 
			date: '2-6-2018',
		    BTC: 7822.27,
		    ETH: 796.439,
		    XRP: '0.785328',
		    BCH: '978.912',
		    ADA: '0.376101',
		    LTC: '144.496',
	    	NEO: '107.264' 
		},
	  	{ 
	  		date: '2-7-2018',
		    BTC: 8279.09,
		    ETH: 834.642,
		    XRP: '0.778804',
		    BCH: '1024.12',
		    ADA: '0.356802',
		    LTC: '151.572',
		    NEO: '115.092' 
		},
		{ 
	  		date: '2-8-2018',
		    BTC: 5279.09,
		    ETH: 6234.642,
		    XRP: '0.778804',
		    BCH: '1024.12',
		    ADA: '0.356802',
		    LTC: '151.572',
		    NEO: '95.092' 
		},
		{ 
	  		date: '2-9-2018',
		    BTC: 6279.09,
		    ETH: 9234.642,
		    XRP: '0.778804',
		    BCH: '1024.12',
		    ADA: '0.356802',
		    LTC: '151.572',
		    NEO: '155.092' 
		}  
	];

	let userCoins = props.userCoins;

	//This becomes the data that generates the final chart
	let userChartDataArr = [];

	//STEP 1: Loop through chartPoint Data (array of objects)
	chartPointsArr.forEach((pointObj, index)=>{
		//Create new object that will be filled with new data and pushed into new array.
		let newObj={};
		//STEP 2: Loop through the objects inside chartPointArray
		for(let key in pointObj){
			//STEP 3: Loop through User Coins and match userCoins.symbol with key, if there is a match create a new object with: symbol, price*amount and date. Push that object into a new array.
			
			//create object date.
			if(key == 'date'){
				newObj['date'] = pointObj[key]
			}
			userCoins.forEach((singleUserCoin, index)=>{
				if(singleUserCoin.symbol == key){
					newObj[key] = Number(pointObj[key])*singleUserCoin.amount;
				}
			})
		}
		userChartDataArr.push(newObj);
		console.log(userChartDataArr);
	})

	//Creating chart. It only needs to create one <Area /> per key, not per object. But, it doesn't accepts loops, you need to create an array with the keys then map it to create each <Area />
		for (let singleKey in userChartDataArr[0]){
			if(singleKey != 'date'){
				keysArr.push(singleKey)
			}
		}

		let AreaChartCreation = keysArr.map((key, index) => {
			randomStroke = props.colorRandom[Math.floor(Math.random()*100)];
			return <Area type='monotone' dataKey={key} stackId={index} stroke={randomStroke} fill={randomStroke} />
		})


	return(
		<AreaChart width={(window.innerWidth/100)*60} height={(window.innerHeight/100)*60} data={chartPointsArr}
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