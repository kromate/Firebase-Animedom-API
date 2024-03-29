const functions = require('firebase-functions');
const quest = require('request');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer-extra')
const ytpl = require('ytpl');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')

const runtimeOpts = {
    timeoutSeconds: 1200,
    memory: '1GB'
  }

puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: '2captcha',
      token: '78495a8b6de979fb26a4c8140bf51b52' 
    },
    visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
  })
)

// firebase emulators:start

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


//Recent for anime endpoint ================================================== WIP
// the link here is for direct download only not details
// http://localhost:3000/recent/?page=2 ============= EX
exports.recent = functions.https.onRequest((request, response) => {
  console.log(puppeteer)
    quest(`https://ajax.gogo-load.com/ajax/page-recent-release.html?page=${request.query.page}`, (error, _response, html) => {
    if (!error && _response.statusCode == 200) {
          const $ = cheerio.load(html);
          const searchArray = [];

          $('ul.items li').each((i,el) => {
            const title = $(el).find('p.name a').text();
            const episode = $(el).find('p.episode').text();
            const link = $(el).find('p.name a').attr('href');
            const img = $(el).find('.img img').attr('src');
            searchArray.push({name:title, link:link, image:img, episode:episode })
          });
          response.set('Access-Control-Allow-Origin', '*');
          response.send(searchArray)
        }
      });
});


//search for anime endpoint
exports.search = functions.https.onRequest((request, response) => {
    quest(`https://www1.gogoanime.ai/search.html?keyword=${request.query.name}`, (error, _response, html) => {
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


//GET Anime details
exports.desc = functions.https.onRequest((request, response) => {
    quest(`https://www1.gogoanime.ai${request.query.link}`, (error, _response, html) => {
        if (!error && _response.statusCode == 200) {
              const $ = cheerio.load(html);
              const availableepisodes = [];
              const infoArray = [];
                const name= (request.query.link).split('/')[2]
                const id = $('input#movie_id').attr('value')
              $('.anime_info_body p.type').each((i,el) => {
                const det = $(el).text().split(':')[1]
                infoArray.push({i:det})
              })

              $('ul#episode_page li').each((i,el) => {
                const start = $(el).text().split('-')[0]
                const end = $(el).text().split('-')[1]
                availableepisodes.push({start:start, end:end})
              })

             let searchArray=   {
                 id:id,
                name:name,
                type:infoArray[0].i,
                    summary:infoArray[1].i,
                    genre:infoArray[2].i,
                    release:infoArray[3].i,
                    status:infoArray[4].i,
                    otherNames:infoArray[5].i,
                     episodes:availableepisodes}

                     response.set('Access-Control-Allow-Origin', '*');
              response.send(searchArray)
            }
          });
});


//get Episode for anime endpoint
exports.episodes = functions.https.onRequest((request, response) => {
    quest(`https://ajax.gogocdn.net/ajax/load-list-episode?ep_start=${request.query.start}&ep_end=${request.query.end}&id=${request.query.id}&default_ep=0&alias=${request.query.name}`, (error, _response, html) => {
        if (!error && _response.statusCode == 200) {
          const $ = cheerio.load(html);
          const episodeArr = [];
          $('a').each((i,el) => {
                const title = $(el).text()
                const link = $(el).attr('href');
                episodeArr.push({name:title, link:link})

          });
          response.set('Access-Control-Allow-Origin', '*');
          response.send(episodeArr)
        }
      });
});


exports.downloadLink = functions.https.onRequest((request, response) =>
{
  quest(`https://www1.gogoanime.ai/${request.query.link}`, (error, _response, html) =>
  {
    if (!error && _response.statusCode == 200) {
      const $ = cheerio.load(html);
      const Dlink = $('li.dowloads > a').attr('href');
      DownloadLink(Dlink).then((data) =>
      {
        console.log(data);
        response.send(data)
      }).catch(console.error);
    }
  })
});



function DownloadLink (link) {
    return new Promise(async (resolve, reject) => {
        try {
          const browser = await puppeteer.launch({
              headless:false,
                args: [
                  '--no-sandbox',
                  '--disable-setuid-sandbox',
                ],
              });
            const page = await browser.newPage();
          await page.goto(link, { waitUntil: 'networkidle2' });
             console.log('solved3')
          await page.solveRecaptchas()
          console.log('solved2')
          await page.waitForSelector('#btn-submit',{visible: true})
          await page.evaluate(() => { 
 document.querySelector('#btn-submit').click()
          })
             
             console.log('solved1')
            await page.waitForSelector('.dowload>a',{visible: true})
           
            let urls = await page.evaluate(() => {
                let results = document.querySelectorAll('.dowload>a')
              // document.querySelectorAll('.dowload>a')
                
                 return results;
            })
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}