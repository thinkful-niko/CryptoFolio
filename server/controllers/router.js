const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');

const {basicStrategy, jwtStrategy, googleStrategy} = require('./strategies');


const router = express.Router();

const jsonParser = bodyParser.json();

console.log('Mango');
const UsersController = require('./users');
const AuthController = require('./auth');

//Register User
router.post('/register', jsonParser, UsersController.register);

//Login User
router.post('/login', passport.authenticate('basic', {session: false}), AuthController.login);

//Refresh Token
router.post('/refresh', passport.authenticate('jwt', {session: false}), AuthController.refresh);

//Add Entry
router.post('/addCoin', [passport.authenticate('jwt', {session: false}), jsonParser],UsersController.addEntry);

//Remove Entry- Not sure how to hanlde this in the controler, is /:id/:coin correct?
//router.delete('/delete/:id/:coin', [passport.authenticate('jwt', {session: false}), jsonParser], UsersController.removeEntry);

//Coin Data
router.get('/coinData', [passport.authenticate('jwt', {session: false}), jsonParser], UsersController.getCoins);
// router.get('/latestCoinData', [passport.authenticate('jwt', {session: false}), jsonParser], UsersController.getLatestCoins);



    // send to google to do the authentication
router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }), UsersController.register);

        // the callback after google has authenticated the user
router.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));





module.exports = {router, basicStrategy, jwtStrategy};