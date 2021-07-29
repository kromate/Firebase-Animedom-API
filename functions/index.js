// const functions = require('firebase-functions');
// const quest = require('request');
// const cheerio = require('cheerio');
// const puppeteer = require('puppeteer');
// const  ytpl = require('ytpl');
// const runtimeOpts = {
//     timeoutSeconds: 540,
//     memory: '1GB'
//   }



const coinbase = require('./SpotifyAPIs.js');
const auth = require('./YouTubeAPIs.js');
const auth = require('./DeezerAPIs.js');
const auth = require('./YouTubeAPIs.js');

exports.signup = auth.signUp;
exports.CoinbaseRedirect = coinbase.CoinbaseRedirect;
exports.CoinbaseToken = coinbase.CoinbaseToken;

