//This file is scheduled to run every 10 minutes on Heroku with a free plugin called 'Heroku Scheduler'.
//It will make API requests to CoinMarketCap creating snapshots and deleting the ones that are X days old, creating Historical Data for the charts.
const request = require('request');
const Coin = require('./models/coindb');
const mongoose = require('mongoose');

mongoose.connect('mongodb://nicolaskao:1234@ds119088.mlab.com:19088/cryptofolio');

return new Promise((resolve, reject) => {
		console.log('Data fecthed');
		request({
			url: `https://api.coinmarketcap.com/v1/ticker/?limit=7`,
			json: true
		}, (error, response, body) => {
			//Delete old data that is 'daysToDeletion' days old.
			let date = new Date();
			let daysToDeletion = 1;
			let deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion))/1000;
			if (error){console.log(`Error fecthing data from CoinMarketCap API: ${error}`)};
			let arr = [];
			Coin.remove({last_updated:{$lt: deletionDate}}, function(){
				for (i=0; i<body.length; i++){
					let coin = new Coin(
						body[i]
					);
					arr.push(coin.save());
					//close db connection
					Promise.all(arr).then(() => {
						mongoose.connection.close();
					});
				}
			});
		});
})
/*Thoughts:
-What if I make it generate a new array every time and give it a timestamp myself instead of relying on 'last_updated'?

*/