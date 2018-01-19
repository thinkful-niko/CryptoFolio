const request = require('request');
const Coin = require('../models/coindb');
//https://api.coinmarketcap.com/v1/ticker/?limit=1000
console.log('Data fecthed');

return new Promise((resolve, reject) => {
		request({
			url: `https://api.coinmarketcap.com/v1/ticker/?limit=1000`,
			json: true
		}, (error, response, body) => {
			Coin.remove({}, function(){
				for (i=0; i<body.length; i++){
					let coin = new Coin(
						body[i]
					);
					coin.save();
				}
			});
		});
	})