const request = require('request');
const Coin = require('./models/coindb');
const Snapshot = require ('./models/snapshot');
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

mongoose.connect('mongodb://nicolaskao:1234@ds119088.mlab.com:19088/cryptofolio');

return new Promise((resolve, reject) => {
	console.log('Data fecthed');
		request({
			url: `https://api.coinmarketcap.com/v1/ticker/?limit=100`,
			json: true
		}, (error, response, body) => {

			let date = new Date();
			let dayDate = date.getDate();
			let monthDate = date.getMonth()+1;
			let yearDate = date.getFullYear();
			let hoursDate = date.getHours();
			let timeStampDate = monthDate +'-'+ dayDate +'-'+ yearDate;

			if (error){console.log(`Error fecthing data from CoinMarketCap API: ${error}`)};
			let arr = [];

			Coin.remove({}, function(){

				for (i=0; i<body.length; i++){
					let coin = new Coin(
						body[i]
					);
					coin.timeStampDate = date;
					arr.push(coin.save());


					//close db connection
					
				}

				Promise.all(arr).then(() => {
						mongoose.connection.close();
				});	
			});
		});
	});