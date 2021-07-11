const functions = require('firebase-functions');
const quest = require('request');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const  ytpl = require('ytpl');
const runtimeOpts = {
    timeoutSeconds: 540,
    memory: '1GB'
  }

// firebase emulators:start --only functions

exports.letters = functions.https.onRequest((request, response) => {
    console.log(request.query.name);

    quest(`https://www1.gogoanime.ai/anime-list-${request.query.name}`, (error, _response, html) => {
        if (!error && _response.statusCode == 200) {
              const $ = cheerio.load(html);
              const searchArray = [];

              $('.anime_list_body ul li a').each((i,el) => {
                const title = $(el).text();
                const link = $(el).attr('href');
                searchArray.push({name:title, link:link})
              });
              response.set('Access-Control-Allow-Origin', '*');
              response.send(searchArray)
            }
          });
});

exports.gl = functions.https.onRequest((request, response) => {
    console.log(request.query.name);

    quest(`https://www1.gogoanime.ai/${request.query.link}`, (error, _response, html) => {
        if (!error && _response.statusCode == 200) {
              const $ = cheerio.load(html);
              const searchArray = [];

              $('ul.items li').each((i,el) => {
                const title = $(el).find('p.name a').text();
                const link = $(el).find('p.name a').attr('href');
                const img = $(el).find('.img img').attr('src');
                const release = $(el).find('p.released').text();
                searchArray.push({name:title, link:link, image:img , release:release})
              });
              response.set('Access-Control-Allow-Origin', '*');
              response.send(searchArray)
            }
          });
});

exports.genres = functions.https.onRequest((request, response) => {
    console.log(request.query.name);

    quest(`https://www1.gogoanime.ai/${request.query.link}`, (error, _response, html) => {
        if (!error && _response.statusCode == 200) {
              const $ = cheerio.load(html);
              const searchArray = [];

              $('ul.items li').each((i,el) => {
                const title = $(el).find('p.name a').text();
                const link = $(el).find('p.name a').attr('href');
                const img = $(el).find('.img img').attr('src');
                const release = $(el).find('p.released').text();
                searchArray.push({name:title, link:link, image:img , release:release})
              });
              response.set('Access-Control-Allow-Origin', '*');
              response.send(searchArray)
            }
          });
});

