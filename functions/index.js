const functions = require('firebase-functions');
const quest = require('request');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const  ytpl = require('ytpl');
const runtimeOpts = {
    timeoutSeconds: 540,
    memory: '1GB'
  }



//list by Letter for anime endpoint
// http://localhost:3000/letters/?name=p ================= Exp
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


//list by genre for anime endpoint
// http://localhost:3000/gl/?link=/genre/ecchi ============= exp
exports.gl = functions.https.onRequest((request, response) => {

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


//Genre list for anime endpoint ========================================================== WIP
// http://localhost:3000/genres =====================
exports.genres = functions.https.onRequest((request, response) => {

    quest(`https://www1.gogoanime.ai/`, (error, _response, html) => {
        if (!error && _response.statusCode == 200) {
              const $ = cheerio.load(html);
              const searchArray = [];

              $('nav.menu_top ul li ul li a').each((i,el) => {
                const title = $(el).text();
                const link = $(el).attr('href');
                searchArray.push({name:title, link:link })
              });
              response.set('Access-Control-Allow-Origin', '*');
              response.send(searchArray)
            }
          });
});


//Popular for anime endpoint ========================================================== WIP
// http://localhost:3000/popular/?page=2 =========== EX
exports.popular = functions.https.onRequest((request, response) => {
    quest(`https://ajax.gogo-load.com/ajax/page-recent-release-ongoing.html?page=${request.query.page}`, (error, _response, html) => {
        if (!error && _response.statusCode == 200) {
              const $ = cheerio.load(html);
              const searchArray = [];

              $('.added_series_body > ul li').each((i,el) => {
                const title = $(el).find('a').toArray()[0].attribs.title;
                const link = $(el).find('a').attr('href');
                const genre = $(el).find('p.genres').text().split(':')[1];
                const img = $(el).find('.thumbnail-popular').css('background').split("'")[1]
                const Numlatest = $(el).find('a').text().trim().split(',').length
                const last_latest = $(el).find('a').text().trim().split(',')[Numlatest-1]
                const latest = $(el).find('a').text().trim().split(',')[Numlatest-1].substring(last_latest.length - 9)
                searchArray.push({name:title, link:link, image:img , latest:latest, genre:genre})
              });
              response.set('Access-Control-Allow-Origin', '*');
              response.send(searchArray)
            }
          });
});

