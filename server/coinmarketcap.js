//This file is scheduled to run every 10 minutes on Heroku with a free plugin called 'Heroku Scheduler'.
//It will make API requests to CoinMarketCap creating snapshots and deleting the ones that are X days old, creating Historical Data for the charts.
const request = require('request');
const Coin = require('./models/coindb');
//const Snapshot = require ('./models/snapshot');
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
			let dayDate = date.getDate();
			let monthDate = date.getMonth()+1;
			let yearDate = date.getFullYear();
			let timeStampDate = monthDate +'-'+ dayDate +'-'+ yearDate;

			let daysToDeletion = 1;
			let deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion))/1000;
			if (error){console.log(`Error fecthing data from CoinMarketCap API: ${error}`)};
			let arr = [];
			let snapshotArr = [];
			Coin.remove({last_updated:{$lt: deletionDate}}, function(){
				for (i=0; i<body.length; i++){
					let coin = new Coin(
						body[i]
					);
					coin.timeStampDate = date;
					arr.push(coin.save());
					snapshotArr.push(coin);
					//close db connection
					Promise.all(arr).then(() => {
						mongoose.connection.close();
					});
				}
				// let snapshot = new Snapshot({
				// 	'date': date,
				// 	'chartPoint': snapshotArr
				// });
				// snapshot.save();
				// console.log('COMPLETED:', snapshotArr);
			});

			// Snapshot.remove({last_updated:{$lt: deletionDate}}, function(){
			// 	let snapshot = new Snapshot({
			// 		'date': date,
			// 		'chartPoint': snapshotArr
			// 	});
			// 	snapshot.save();
			// 	console.log('COMPLETED:', snapshotArr);
				
		});
})
/*Thoughts:
-What if I make it generate a new array every time and give it a timestamp myself instead of relying on 'last_updated'?
-Add javascript date to snapshot model OR add javascript date to the saved coins in users controllers;

*/