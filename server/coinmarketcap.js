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
			url: `https://api.coinmarketcap.com/v1/ticker/?limit=100`,
			json: true
		}, (error, response, body) => {
			//Delete old data that is 'daysToDeletion' days old.
			let date = new Date();
			let dayDate = date.getDate();
			let monthDate = date.getMonth()+1;
			let yearDate = date.getFullYear();
			let hoursDate = date.getHours();
			let timeStampDate = monthDate +'-'+ dayDate +'-'+ yearDate;

			let daysToDeletion = 1;
			let deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion))/1000;
			if (error){console.log(`Error fecthing data from CoinMarketCap API: ${error}`)};
			let arr = [];
			let snapshotArr = [];
			let snapshotObj = {};

			Coin.find({}, function(err, res){
				console.log('THIS IS RES', res, 'THIS IS RES');
				snapshotObj['date'] = timeStampDate;
				//Later on, coin and snapshot will be separated, coin will be self clearing with a remove({}) before a call is made.
				for (i=0; i<res.length; i++){
					let coin = res[i];

					//This needs to be an object with all coins and the date
					snapshotObj[coin.symbol] = coin.price_usd;
					//close db connection
					
				}
				//I want to push an array inside of the existing mongo array.
				snapshotArr.push(snapshotObj);

				//Push new snap array into document, clear 'snapAmount' from document (old snaps).
				Snapshot.findOne({}, function (err, snapshot) {

					snapshot.chartPoint.push(snapshotArr)

					console.log('SNAP UPDATE', snapshot.chartPoint.length);
					let snaplLength = snapshot.chartPoint.length;
					let snapAmount = 150;
					let snapShiftDiff = snapshot.chartPoint.length - snapAmount;

					// if (snapshot.chartPoint.length >= snapAmount){
					let removedSnap = snapshot.chartPoint.splice(0, snapShiftDiff);
					console.log('New', snapshot.chartPoint);

					snapshot.save(function (err) {
				        if(err) {
				            console.error('ERROR!');
				        }});
					//}
				});
				


				console.log('COMPLETED:', [snapshotArr]);

			});


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



-Add 100 coins to Coin Collection every 10 minutes and clear the old document
-Create Snapshot with coin.symbol and coin.price_usd









*/