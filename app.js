const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const http = require('http');
// const server       = http.createServer(app);
const fileUpload = require('express-fileupload');
const path = require('path');
const cron = require('node-cron');
const fs = require('fs');

const helmet = require('helmet');

const Memcached = require('memcached');
const memcached = new Memcached('18.117.233.92:3000');

global.TextEncoder = require("text-encoding").TextEncoder;
global.TextDecoder = require("text-encoding").TextDecoder;


//const redis = require('redis');
//const client = redis.createClient();

//app.use(helmet());
// SSL information	
// const httpsOptions = {	
//   cert : fs.readFileSync('./ssl/playactio_com.crt'),	
//   ca : fs.readFileSync('./ssl/playactio_com.ca-bundle'),	
//   key : fs.readFileSync('./ssl/privatekey.key')	
// }	
// const https       = require('https');	
// const server       = https.createServer(httpsOptions,app);

// const server       = http.createServer(httpsOptions,app);
// paypal requirements
const engines = require("consolidate");

app.engine("ejs", engines.ejs);
app.set("views", "./views");
app.set("view engine", "ejs");

require('dotenv').config();

// For in app accessing of ip address
app.set('trust proxy', true)

app.use(express.static(path.join(__dirname, '')));

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '100mb' }));

app.use(fileUpload());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST'
  );
  res.setHeader(
    'Access-Control-Allow-Headers', 'Content-Type,Authorization'
  );
  next();
})


app.get('/api/data', (req, res) => {
  const cacheKey = 'data'; // Unique key for the cache

  console.log("Check if data is available in Memcached cache00000000000000000000000000000000000000000000000000000000000000000000");

  memcached.get(cacheKey, (err, cachedData) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching data from cache');
    }
    if (cachedData !== undefined) {
      console.log('Returning data from cache...');
      return res.send(cachedData);
    }

    // If data is not in the Memcached cache, fetch it from the PostgreSQL database and store it in Memcached
    console.log('Fetching data from PostgreSQL database...');
    fetchDataFromPostgreSQL().then((data) => {
      // Store data in Memcached with a TTL of 60 seconds
      memcached.set(cacheKey, data, 60, (err) => {
        if (err) {
          console.error(err);
        }
      });
      res.send(data);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error fetching data from PostgreSQL database');
    });
  });
});

// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });

/* ---  Route --- */
require('./server/route/v1/subscriber')(app);
require('./server/route/v1/common')(app);
require('./server/route/v1/registration')(app);
require('./server/route/v1/profile')(app);
require('./server/route/v1/friends')(app);
require('./server/route/v1/feed')(app);
require('./server/route/v1/notification')(app);
require('./server/route/v1/chat')(app);
require('./server/route/v1/dashboard')(app);
require('./server/route/v1/tournament')(app);
require('./server/route/v1/olympic')(app);
require('./server/route/v1/kpi')(app);
require('./server/route/v1/payment')(app);
require('./server/route/v1/calendar')(app);

/* ---  ADMIN -- */
require('./server/route/v1/admin/subscriber')(app);
require('./server/route/v1/admin/event')(app);
require('./server/route/v1/admin/match')(app);
require('./server/route/v1/admin/master')(app);
require('./server/route/v1/admin/venue')(app);
require('./server/route/v1/admin/role')(app);
require('./server/route/v1/admin/kpi')(app);

require('./server/route/v1/admin/sport')(app);
require('./server/route/v1/admin/sub_sports')(app);
require('./server/route/v1/admin/banner_website')(app);
require('./server/route/v1/admin/testimonial_website')(app);
require('./server/route/v1/admin/activitie')(app);
require('./server/route/v1/admin/planet')(app);
require('./server/route/v1/admin/mycareer')(app);
require('./server/route/v1/admin/award')(app);
require('./server/route/v1/admin/training')(app);
require('./server/route/v1/admin/matchnew')(app);
require('./server/route/v1/admin/meeting')(app);
require('./server/route/v1/admin/position')(app);
require('./server/route/v1/admin/calendardata')(app);
require('./server/route/v1/admin/stroke')(app);
require('./server/route/v1/admin/distance')(app);
require('./server/route/v1/admin/discipline')(app);
require('./server/route/v1/admin/parameter')(app);
require('./server/route/v1/admin/performancesportmast')(app);
require('./server/route/v1/admin/award_master')(app);
require('./server/route/v1/admin/sportstarts')(app);
require('./server/route/v1/admin/tours')(app);
require('./server/route/v1/admin/course')(app);
require('./server/route/v1/admin/country_city')(app);
require('./server/route/v1/admin/inclutions')(app);
require('./server/route/v1/admin/exclusions')(app);

require('./server/route/v1/admin/match_schedule')(app);






/* ----- Website ------- */
require('./server/route/v1/website/website_tournament')(app);
require('./server/route/v1/website/subscriber_team')(app);
require('./server/route/v1/website/subscriber_coach')(app);
require('./server/route/v1/website/subscriber_manager')(app);
require('./server/route/v1/website/subscriber_others')(app);
require('./server/route/v1/website/team_player')(app);
require('./server/route/v1/website/stud_registration')(app);
require('./server/route/v1/website/athlete')(app);

require('./server/route/v1/website/athlete')(app);

require('./server/route/v1/website/registration')(app);
require('./server/route/v1/website/performance')(app);
require('./server/route/v1/website/tours')(app);
require('./server/route/v1/website/calendar')(app);

require('./server/route/v1/website/contactus')(app);
require('./server/route/v1/website/callbackRequest')(app);
require('./server/route/v1/website/login')(app);

require('./server/route/v1/website/notification')(app);

require('./server/route/v1/website/master_permission')(app);

require('./server/route/v1/website/match_she')(app);

require('./server/route/v1/website/match_score')(app);


require('./server/route/v1/website/subscriberinfo')(app);

require('./server/route/v1/website/scoreboard')(app);



//MongoDb...............................................

//require('./mongoserver/route/admin/demo')(app);
//require('./mongoserver/route/admin_mongo/admin_acount')(app);

require('./mongoserver/routemg/admin_mongo')(app);

require('./mongoserver/routemg/admin_acount')(app);
require('./mongoserver/routemg/master')(app);

require('./mongoserver/routemg/menu')(app);
require('./mongoserver/routemg/userdata')(app);

require('./mongoserver/routemg/level')(app);
require('./mongoserver/routemg/staff')(app);
require('./mongoserver/routemg/batch')(app);

require('./mongoserver/routemg/curriculum')(app);
require('./mongoserver/routemg/players')(app);

require('./mongoserver/routemg/attendance')(app);

//.................   MOBILE   ...................

require('./mongoserver/routemg/mobile/login')(app);





//var CityRouter = require('./src/routes/admin/city');
//require('./server/route/website/tournament')(app);


//var tournamentRouter = require('./server/route/website/tournament.js');
//var subscriber_coachRouter = require('./server/route/website/subscriber_coach.js');
//var subscriber_managerRouter = require('./server/route/website/subscriber_manager.js');
//var subscriber_othersRouter = require('./server/route/website/subscriber_others.js');
//var subscriber_teamRouter = require('./server/route/website/subscriber_team.js');
//var team_playerRouter = require('./server/route/website/team_player.js');

console.log("app");

//app.use('/website/tournament', tournamentRouter);
//app.use('/website/subscriber_coach', subscriber_coachRouter);
//app.use('/website/subscriber_manager', subscriber_managerRouter);
//app.use('/website/subscriber_others', subscriber_othersRouter);
//app.use('/website/subscriber_team', subscriber_teamRouter);
//app.use('/website/team_player', team_playerRouter);

const cronJob = require('./server/controller/admin/cron');
/* ---  Route --- */


//var CountryApiV1Router = require('./server/route/profile/country');
//var CityV1Router = require('./server/route/profile/city');

// app.use('/website',studRouter);


app.use('/', (req, res) =>
  res.send({
    data: req.path,
    msg: 'Page not found....'
  })
);

app.use('*', (req, res) =>
  res.status(process.env.STATUS_405).send({
    msg: 'welcome To Actio , Method Not Allowed Here'
  })
);

app.use((error, req, res, next) => {
  const status = error.statusCode || process.env.STATUS_500;
  const message = error.message;
  const data = error.data;
  res.status(status).send({ msg: message, data: data });
})

//app.use('/v1/profile/country',CountryApiV1Router);
//app.use('/v1/profile/city',CityV1Router);

// require('./server/controller/socket')(io);

/* Socket Connection End */

/* -----  Cron JoB ----- */
// cron.schedule("*/1 * * * * *", function() { 
//    cronJob.teamplayerEmail();
//   });

cron.schedule("* * * * * *", function () {
  cronJob.notify();
});

// cron.schedule("* * * * * *", function() {
//     cronJob.sendreminder();
//   });

cron.schedule("0 0 */72 * * *", function () {
  cronJob.teamplayerexpired();
});

cron.schedule("*/5 * * * * *", function () {
  cronJob.subscriberPush();
  cronJob.subscriberBulk();
  cronJob.updateSubscriber();
});

cron.schedule("1 0 * * *", function () {
  cronJob.menuPermission();
});


cron.schedule("*/15 * * * *", function () {
  cronJob.registerEmail();
  cronJob.registerstatusEmail();
  cronJob.registerSMS();
});

cron.schedule("0 0 18 * * *", () => {
  cronJob.backupDB();
});

///-------------------------------------------------------------//
//const cronJobmongo = require('/var/www/code/play_actio_api/mongoserver/controller/admin_md/cron.js');



//const cronJobmongo = require('/var/www/code/play_actio_api/mongoserver/controller/admin_md/cron.js');
const cronJobmongo = require('./mongoserver/controller/admin_md/cron.js');



cron.schedule("0 0 0 * * *", () => {
  cronJobmongo.rollout();
  cronJobmongo.twoDaysBefore();
});

// cron.schedule("* * * * * *", () => {
//   cronJobmongo.sessionemail();

// });


module.exports = app;




// var createError = require('http-errors');
// var express = require('express');
// var path = require('path'); 
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// require('dotenv').config();

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
