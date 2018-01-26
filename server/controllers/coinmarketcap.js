const request = require('request');
const Coin = require('../models/coindb');
//https://api.coinmarketcap.com/v1/ticker/?limit=1000


return new Promise((resolve, reject) => {

		console.log('Data fecthed');
		request({
			url: `https://api.coinmarketcap.com/v1/ticker/?limit=5`,
			json: true
		}, (error, response, body) => {
			if (error){console.log(`Error fecthing data from CoinMarketCap API: ${error}`)};
//If you remove and replace the data new _ids are created, so you need to update the document
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