/* TODO:
-USE DUMMY DATA TO DEVELOP THIS PART
-You are running into Asynch problems, chart data doesn't always load correctly, you have to make the client wait for the server to do its thing.
-Process incoming data so:
	*It is user uniquer (filter and match symbols)
	*Multiply user coin amount and coin price (changing value to number)
	*Render <Area />
*/

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

//VALUES NEED TO BE NUMBERS
const Chart = (props) => {
	console.log('CHART', props.data, props.userCoins);
	let randomStroke = props.colorRandom;
	console.log(randomStroke); //Randomize the color index randomStroke[Math.Random()*TotalIndex];

	let chartPointsArr = props.data;
	let userCoins = props.userCoins;
//PROBLEM: THIS IS RETURNING ONCE FOR EACH SNAPSHOT, is this a problem? Maybe it's time to structure a new series of objects.
	//Loop through user added coins object
	userCoins.forEach((userCoin, i) => {
		//Loop Through Chart Points Array
		chartPointsArr.forEach((chartPoint, i) => {
			//Loop Through Object Keys in each chartPoint object
			for (var chartPointKey in chartPoint){
				if (chartPointKey == userCoin.symbol){
					console.log('User Has:', chartPointKey);
				}
			}
		})
		
	});

	//Preparing key for 'datKey' in <Area /> component.
	// let keyObj = props.data[0]; //get one object
	// console.log('keyObj:', keyObj);
	// let keysArr = [];

	// let i=0; //to loop later

	// for (let key in keyObj) {
	//     keysArr.push(key); //getting one of each object key in keyObj
	//     //keysArr = ['BTC','date', 'coin2', 'coin3', 'etc...']
	// }

	// keysArr.forEach((key,index)=>{ //removes 'date' key
	// 	console.log(key);
	// 	if(key === 'date'){
	// 		delete keysArr[index];
	// 	}
	// 	//keysArr = ['BTC', removed, 'coin2', 'coin3', 'etc...']
	// });


	// let AreaChartElement = props.data.map((item, index)=>{
	// 	let oneKey = keysArr[i]; //sets the key to one of the array
	// 	console.log(oneKey);
	// 	//i++; //changes key
 //            return <Area type='monotone' dataKey={oneKey} stroke={randomStroke[i]} fill={randomStroke[i]} />
 //        })

 	let AreaChartElement = props.data.map((chartPointObj, index) => {
 		console.log('CHARTPOINT!!!!', chartPointObj);
 		//I want to get each snapshot and create a <Area/> for each of the keys inside the snapshot.
 		for (let oneKey in chartPointObj){
 			console.log('ONEKEY!!!', oneKey);
 			if(oneKey !== 'date'){
 				return <Area type='monotone' dataKey={oneKey} stroke={randomStroke[index]} fill={randomStroke[index+2]} />
 			}
 		}
 		
 		
 	})

	return(
		<AreaChart width={(window.innerWidth/100)*60} height={(window.innerHeight/100)*60} data={props.data}
        margin={{top: 30, right: 30, left: 30, bottom: 0}}>
            <XAxis dataKey="date"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Area type='monotone' dataKey='BTC' stroke={randomStroke[3]} fill={randomStroke[8+2]} />
        </AreaChart>
    )
}

export default Chart;