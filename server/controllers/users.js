const {
    User
} = require('../models/users');
const Entry = require('../models/entries');
const Coin = require('../models/coindb');
const Snapshot = require('../models/snapshot');


// Post to register a new user
exports.register = function(req, res, next) {
    // router.post('/', jsonParser, (req, res) => {
    console.log('Banana', req.body);
    const requiredFields = ['email', 'password'];
    const missingField = requiredFields.find(field => !(field in req.body));

    console.log(req.body);
    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }

    const stringFields = ['email', 'password'];
    const nonStringField = stringFields.find(
        field => field in req.body && typeof req.body[field] !== 'string'
    );

    if (nonStringField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Incorrect field type: expected string',
            location: nonStringField
        });
    }

    // If the username and password aren't trimmed we give an error.  Users might
    // expect that these will work without trimming (i.e. they want the password
    // "foobar ", including the space at the end).  We need to reject such values
    // explicitly so the users know what's happening, rather than silently
    // trimming them and expecting the user to understand.
    // We'll silently trim the other fields, because they aren't credentials used
    // to log in, so it's less of a problem.
    const explicityTrimmedFields = ['email', 'password'];
    const nonTrimmedField = explicityTrimmedFields.find(
        field => req.body[field].trim() !== req.body[field]
    );

    if (nonTrimmedField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Cannot start or end with whitespace',
            location: nonTrimmedField
        });
    }

    const sizedFields = {
        email: {
            min: 1
        },
        password: {
            min: 4,
            // bcrypt truncates after 72 characters, so let's not give the illusion
            // of security by storing extra (unused) info
            max: 72
        }
    };
    const tooSmallField = Object.keys(sizedFields).find(
        field =>
        'min' in sizedFields[field] &&
        req.body[field].trim().length < sizedFields[field].min
    );
    const tooLargeField = Object.keys(sizedFields).find(
        field =>
        'max' in sizedFields[field] &&
        req.body[field].trim().length > sizedFields[field].max
    );

    if (tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField ?
                `Must be at least ${sizedFields[tooSmallField]
                      .min} characters long` :
                `Must be at most ${sizedFields[tooLargeField]
                      .max} characters long`,
            location: tooSmallField || tooLargeField
        });
    }

    let {
        email,
        password
    } = req.body;
    // Username and password come in pre-trimmed, otherwise we throw an error
    // before this

    return User.find({
            email
        })
        .count()
        .then(count => {
            if (count > 0) {
                // There is an existing user with the same username
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Email already taken',
                    location: 'email'
                });
            }
            // If there is no existing user, hash the password
            return User.hashPassword(password);
        })
        .then(hash => {
            return User.create({
                email,
                password: hash,
            });
        })
        .then(user => {
            return res.status(201).json(user.apiRepr());
        })
        .catch(err => {
            // Forward validation errors on to the client, otherwise give a 500
            // error because something unexpected has happened
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            console.log(err);
            res.status(500).json({
                code: 500,
                message: 'Internal server error'
            });
        });
};

/*Remove Entry
 exports.removeEntry = function(req, res, next) {
    Entry.findOneAndRemove({_id:})
    -Get ID
    -Validate ID
    -Remove by ID
 }
 */

//Add Entry
exports.addEntry = function(req, res, next) {
    console.log('addEntry Called', req.body);
    let entry = new Entry(req.body);
    entry['userId'] = req.user.id;
    entry.save();
};

exports.getCoins = function(req, res, next) {
    console.log('getCoins Called');
    Coin.find().exec().then(result => {
        //console.log('RESULT:', result, '<-RESULT')
        var index = {};
        var data = result;
        //console.log('ZEBRA:',result,'DOG');
        data.map(item => index[item.id] = item);
        let unique = Object.values(index);
        console.log('UNIQUE',unique, 'UNIQUE');
        
//historicalSnapshots has to be populates BEFORE getCoins()
        let historicalSnapshots=[];

//This needs to synch better.
        Snapshot.find().exec().then(snapshot => {
            snapshot[0].chartPoint.forEach( element => {
              historicalSnapshots.push(element[0])
            });
            
            Entry.find({
                userId: req.user.id
            }).exec().then(entryResult => {
                //filter by user id
                //console.log('UNIQUE2',unique, 'UNIQUE2');
                //if(historicalSnapshots !=[]){
                    return res.json({
                        entry: entryResult,
                        allData: result,
                        historicalData: historicalSnapshots,
                        unique: unique,
                        userId: req.user.id
                    });
                //}
            }).catch(err => {
                throw err
            })


        }).catch(err => {throw err});

        // Entry.find({
        //     userId: req.user.id
        // }).exec().then(entryResult => {
        //     //filter by user id
        //     //console.log('UNIQUE2',unique, 'UNIQUE2');
        //     //if(historicalSnapshots !=[]){
        //         return res.json({
        //             entry: entryResult,
        //             allData: result,
        //             historicalData: historicalSnapshots,
        //             unique: unique,
        //             userId: req.user.id
        //         });
        //     //}
        // }).catch(err => {
        //     throw err
        // });

    }).catch(err => {
        throw err
    });
};

exports.getYourCoins = function(req, res, next) {
    console.log('getYourCoins');

};

exports.getLatestCoins = function(req, res, next) {
    console.log('getLatestCoins');
    Coin.find().sort({
        last_updated: -1
    }).limit(7).exec().then(result => {
        //console.log("Coin Sort",result);
        return res.json({
            latestCoins: result,
        });
    }).catch(err => {
        throw err
    });

};

function groupBy(arr, property) {
    return arr.reduce(function(memo, x) {
        if (!memo[x[property]]) {
            memo[x[property]] = [];
        }
        memo[x[property]].push(x);
        return memo;
    }, {});
}

let chartData = [];

// function makeHistoricalDataChart(userId, entryResult) {
    
// //WHAT IF YOU MAKE THIS FILTER IN THE FRONT END? The goal is to filter user entries (so it only shows added coins) and calculate the total (price*amount)
//     Snapshot.find().exec().then(snapshot => {
//         let snapshots = snapshot[0].chartPoint;

//         snapshots.forEach((hD, i) => {

//             hD.forEach((r) => {

//                 for (var coinSymbol in r) {
//                     entryResult.forEach((userCoin, index) => {

//                         if (userCoin.userId == userId) {
//                             if (coinSymbol == userCoin.symbol) {

//                                 r[coinSymbol] *= userCoin.amount;

//                             }
//                         }
//                     });
//                 }
//             //This needs to be fixed, it needs to be filtered by user added coins and duplicates must be removed.
//                 chartData.push(r);
               
//             });
//         });
//     });
//     console.log('ChartData:', chartData);
//     return chartData;
// }




// function makeHistoricalDataChart(userId, entryResult) {
//     let chartData = [];
//     Snapshot.find().exec().then(snapshot => {

//             //console.log('SNAP:',JSON.stringify(snapshot[0].chartPoint));
//             let snapshots = snapshot[0].chartPoint;
//             //console.log('HD', historicalData);

//             //Adds user amount to price.
//             snapshots.forEach((hD, i) => { //all coindb arrays being looped
//                 console.log('HD', hD, 'HD');
//                 //console.log('ENTRYRESULT:', entryResult[0].userId, userId );
//                 hD.forEach((r) => {
//                     for (var coinSymbol in r) {
//                         entryResult.forEach((userCoin, index) => {
//                             if (userCoin.userId == userId) {
//                                 if (coinSymbol == userCoin.symbol) {
//                                     r[coinSymbol] *= userCoin.amount;
//                                 }
//                             }
//                         })
//                     }
//                     chartData.push(r);
//                     console.log(r)

//                 })


//             })

//         }

//         console.log('NEW CHARTDATA:', chartData);
//         return chartData;

//     }




    //This function is sorting and comparing result(all data) and entryResults(userData), then it creates an object of arrays with historical data.
    //It is cascading down into the levels of data (historicalData[which will be an array of different snapshots of the main data], current data and user entries).
    //It creates an object that is composed of arrays, holding different data at different times.

    //Idea: use entryResult to filter userIds
    // function makeHistoricalDataChart(userId, entryResult){
    //     //let historicalData = result;
    //     Snapshot.find().exec().then(snapshot => {
    //         let chartData = [];
    //         //console.log('SNAP:',JSON.stringify(snapshot[0].chartPoint));
    //         let snapshots = snapshot[0].chartPoint;
    //         //console.log('HD', historicalData);

    // //Adds user amount to price.
    //         snapshots.forEach((hD, i)=>{ //all coindb arrays being looped
    //         console.log('HD',hD, 'HD');
    //         //console.log('ENTRYRESULT:', entryResult[0].userId, userId );
    //                 hD.forEach((r)=>{
    //                     for (var coinSymbol in r) {
    //                         entryResult.forEach((userCoin, index) =>{
    //                             if(userCoin.userId == userId){
    //                                 if(coinSymbol == userCoin.symbol){
    //                                     r[coinSymbol] *= userCoin.amount;
    //                                 }
    //                             }
    //                         })
    //                     }
    //                     chartData.push(r);
    //                     console.log(r)

    //                 })
    //         console.log('NEW CHARTDATA:', chartData);
    //         return chartData;

    //         // let date = hD[0].timeStampDate;
    //         // let chartPoint = {};//creating object to be used as chart source, arrays will be pushed inside it.
    //         // hD.forEach((r)=>{ // one of coindb arrays inside of the snapshot.
    //         //     let total = 0; //creating total to be added later
    //         //     entryResult.forEach((eR)=>{ //User Entries Array coming from parameters, being looped
    //         //         if(r.id === eR.id){ //if there is a coin on user entries that is in the main coin collection
    //         //             total += (Number(eR.price_usd) * Number(eR.amount)); // Set the value of each entry, even if it is repeated.
    //         //             chartPoint[eR.symbol] = total; //set the objet key ('chartPoin.eRSymbol' but in bracket notation) to 'total'
    //         //             chartPoint['date'] = date; // bracket notation for chartPoint.date = date
    //         //             // console.log(r.id, "ID MATCHED", date, total);
    //         //         }
    //         //     })
    //         });

    //         //chartData.push(chartPoint);


    //     });
    //     // console.log('RESULT', result ,'RESULT');
    //    // let o = groupBy(result, 'timeStampDate');

    //     // for(var key in o){
    //     //   historicalData.push(o[key])
    //     // }
    //     //console.log('R',result,'R');
    //     //console.log('HistoricalD',historicalData,'HistoricalD');
    //     // console.log("Make Historical Data:",result);
    //    // let historicalData = [result, result, result];//This will be replaced by an array with different snapshots of coinDB collection
    //    // console.log('RESULT:', result);
    //     // let chartData = [];
    //     // historicalData.forEach((hD, i)=>{ //all coindb arrays being looped
    //     //     let UNIX = Number(hD[0].last_updated + '000'); //Correct UNIX timestamp and make it a number
    //     //     let date = new Date(UNIX).toISOString().substring(0, 10); //Create date with UNIX timestamp, converto to ISO then format into YYYY-MM-DD
    //     //     let chartPoint = {};//creating object to be used as chart source, arrays will be pushed inside it.
    //     //     hD.forEach((r)=>{ // one of coindb arrays inside of the snapshot.
    //     //         let total = 0; //creating total to be added later
    //     //         entryResult.forEach((eR)=>{ //User Entries Array coming from parameters, being looped
    //     //             if(r.id === eR.id){ //if there is a coin on user entries that is in the main coin collection
    //     //                 total += (Number(eR.price_usd) * Number(eR.amount)); // Set the value of each entry, even if it is repeated.
    //     //                 chartPoint[eR.symbol] = total; //set the objet key ('chartPoin.eRSymbol' but in bracket notation) to 'total'
    //     //                 chartPoint['date'] = date; // bracket notation for chartPoint.date = date
    //     //                 // console.log(r.id, "ID MATCHED", date, total);
    //     //             }
    //     //         })
    //     //     });
    //     //     chartData.push(chartPoint);
    //     // })

    // //     for (var key in historicalData) {
    // //     // skip loop if the property is from prototype
    // //     if (!historicalData.hasOwnProperty(key)) continue;

    // //     var obj = historicalData[key];
    // //     for (var prop in obj) {
    // //         // skip loop if the property is from prototype
    // //         if(!obj.hasOwnProperty(prop)) continue;

    // //         // your code
    // //         console.log(prop + " = " + obj[prop]);
    // //     }
    // // }

    // //     for (let dateStamp in historicalData){

    // //     }

    //     // historicalData.forEach((hD, i)=>{ //all coindb arrays being looped
    //     //     //console.log('HD',hD, 'HD');
    //     //     let date = hD[0].timeStampDate;
    //     //     let chartPoint = {};//creating object to be used as chart source, arrays will be pushed inside it.
    //     //     hD.forEach((r)=>{ // one of coindb arrays inside of the snapshot.
    //     //         let total = 0; //creating total to be added later
    //     //         entryResult.forEach((eR)=>{ //User Entries Array coming from parameters, being looped
    //     //             if(r.id === eR.id){ //if there is a coin on user entries that is in the main coin collection
    //     //                 total += (Number(eR.price_usd) * Number(eR.amount)); // Set the value of each entry, even if it is repeated.
    //     //                 chartPoint[eR.symbol] = total; //set the objet key ('chartPoin.eRSymbol' but in bracket notation) to 'total'
    //     //                 chartPoint['date'] = date; // bracket notation for chartPoint.date = date
    //     //                 // console.log(r.id, "ID MATCHED", date, total);
    //     //             }
    //     //         })
    //     //     });

    //     //     chartData.push(chartPoint);
    //     // })
    //     // //console.log('CHARTDATA:',chartData, 'CHARTDATA');
    //     // //console.log("THIS IS CHARDATA:",chartData);
    //     // return chartData;//chart data is an array of objects [{BTC: value of BTC, date: X ETH: value of ETH}, {... ,date: X+1, ...}]. The value of each repeated entry is added.
    //     // go to chart.js to add the key values, create a loop (map) that does it all by itself.
    // }