import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Chart = (props) => {
	return(
		<AreaChart width={(window.innerWidth/100)*60} height={(window.innerHeight/100)*60} data={props.data}
        margin={{top: 30, right: 30, left: 30, bottom: 0}}>
            <XAxis dataKey="date"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Area type='monotone' dataKey='BTC' stroke='#8884d8' fill='#8884d8' />
            <Area type='monotone' dataKey='ETH' stroke='#82ca9d' fill='#82ca9d' />
            <Area type='monotone' dataKey='CoinC' stroke='#ffc658' fill='#ffc658' />
        </AreaChart>
    )
}

export default Chart;