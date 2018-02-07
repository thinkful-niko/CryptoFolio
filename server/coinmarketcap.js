//This file is scheduled to run every 10 minutes on Heroku with a free plugin called 'Heroku Scheduler'.
//It will make API requests to CoinMarketCap creating snapshots and deleting the ones that are X days old, creating Historical Data for the charts.
const request = require('request');
const Coin = require('./models/coindb');
const Snapshot = require ('./models/snapshot');
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

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
			let hoursDate = date.getHours();
			let timeStampDate = monthDate +'-'+ dayDate +'-'+ yearDate + ' hours: ' + hoursDate;

			let daysToDeletion = 1;
			let deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion))/1000;
			if (error){console.log(`Error fecthing data from CoinMarketCap API: ${error}`)};
			let arr = [];
			let snapshotArr = [];
			let snapshotObj = {};

			Coin.remove({last_updated:{$lt: deletionDate}}, function(){

				snapshotObj['date'] = timeStampDate;
				//Later on, coin and snapshot will be separated, coin will be self clearing with a remove({}) before a call is made.
				for (i=0; i<body.length; i++){
					let coin = new Coin(
						body[i]
					);
					coin.timeStampDate = date;
					console.log('COIN:', coin.id, 'COIN');
					arr.push(coin.save());

					//This needs to be an object with all coins and the date
					snapshotObj[coin.symbol] = coin.price_usd;
					//close db connection
					Promise.all(arr).then(() => {
						mongoose.connection.close();
					});
				}
				//I want to push an array inside of the existing mongo array.
				snapshotArr.push(snapshotObj);

				// Snapshot.chartPoint.push(snapshotArr);
				// Snapshot.save();

				Snapshot.update(
					{ "_id" : ObjectId("5a7a24a4e39cd8385477c9f6") }, 
				    { $push: { chartPoint:snapshotArr } })
					.exec().then(callback => {}).catch(err => {throw err});


				//Snapshot.findById('5a7a24a4e39cd8385477c9f6'}, {$push:{chartPoint:snapshotArr}});

				// let snapshot = new Snapshot({
				// 	'chartPoint': [snapshotArr]
				// });
				//Snapshot.save();
				console.log('COMPLETED:', [snapshotArr]);
			});

			// Snapshot.remove({last_updated:{$lt: deletionDate}}, function(){
			// 	let snapshot = new Snapshot({
			// 		'date': timeStampDate,
			// 		'chartPoint': snapshotArr
			// 	});
				
			// });
})
	})
		
/*Thoughts:
-What if I make it generate a new array every time and give it a timestamp myself instead of relying on 'last_updated'?
-Add javascript date to snapshot model OR add javascript date to the saved coins in users controllers;
-Fetch the doc, append the new snapshot to the existing array, call save.
-Create loop. 
-obj.chartPoint[0][0].BTC = obj.chartPoint[0][0].BTC * amount
-obj.chartPoint[0] = snapshot array
-obj.chartPoint[0][0] = object inside snapshot
-maybe send this to user controllers and add amounts there, so it's made on the server side
*/