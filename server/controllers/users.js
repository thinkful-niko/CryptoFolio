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

//Remove Entry
 exports.removeEntry = function(req, res, next) {
    //Find entry by user ID and remove all 'coinName'
    Entry.remove({userId:req.body.userID, id:req.body.coinName}, (err, r) => {
        return res.json({message: 'DELETED', id: req.body.coinName})
    })
 }


//Add Entry
exports.addEntry = function(req, res, next) {
    console.log('ADD ENTRY', req.body);
    delete req.body._id;
    console.log('ADD ENTRY WITHOUT _ID', req.body);
    let entry = new Entry(req.body);
    console.log('ENTRY AFTER', Entry);
    entry['userId'] = req.user.id;
    entry.save();
    res.json({success: 'Coin Saved'});
};

exports.getCoins = function(req, res, next) {
    Coin.find().exec().then(result => {
        var index = {};
        var data = result;
        data.map(item => index[item.id] = item);
        let unique = Object.values(index);
        
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