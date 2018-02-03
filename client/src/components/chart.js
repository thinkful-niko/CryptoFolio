import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Chart = (props) => {
	console.log('CHART', props.data);
	let randomStroke = props.colorRandom;
	console.log(randomStroke);

	//Preparing key for 'datKey' in <Area /> component.
	let keyObj = props.data[0]; //get one object
	let keysArr = [];

	let i=0; //to loop later

	for (let key in keyObj) {
	    keysArr.push(key); //getting one of each object key in keyObj
	    //keysArr = ['BTC','date', 'coin2', 'coin3', 'etc...']
	}

	keysArr.forEach((key,index)=>{ //removes 'date' key
		console.log(key);
		if(key === 'date'){
			delete keysArr[index];
		}
		//keysArr = ['BTC', removed, 'coin2', 'coin3', 'etc...']
	});


	let AreaChartElement = props.data.map((item, index)=>{
		let oneKey = keysArr[i]; //sets the key to one of the array
		i++; //changes key
            return <Area type='monotone' dataKey={oneKey} stroke={randomStroke[i]} fill={randomStroke[i]} />
        })

	return(
		<AreaChart width={(window.innerWidth/100)*60} height={(window.innerHeight/100)*60} data={props.data}
        margin={{top: 30, right: 30, left: 30, bottom: 0}}>
            <XAxis dataKey="date"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            {AreaChartElement}
        </AreaChart>
    )
}

export default Chart;