/* TODO:
-You are running into Asynch problems, chart data doesn't always load correctly, you have to make the client wait for the server to do its thing.

Processing Data:
	-Loop through array of objects (main historical data)
	-Loop through its objects (snapshots)
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

	let chartPointsArr = props.data;

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
					console.log('VALUE');
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
			randomStroke = props.colorRandom[index];
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