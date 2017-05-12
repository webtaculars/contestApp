var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var app = express();
const CronJob = require('cron').CronJob;
const Contest = require('./app/models/contest');
const SensexValue = require('./app/models/sensexValue');
const NextDate = require('./app/models/nextDate');
const calculateScore = require('./app/helpers/calculateScore');
const random = require("random-js")();

var updateScoreJob = new CronJob('15 29 13 * * 1-5', function() {
    let date = new Date().toJSON().slice(0,10);
    let sensexValue = 0;
    SensexValue.findOne({date: date}, function(err, sensexValue) {
      sensexValue = sensexValue.value;
      Contest.find({date: date}, function(err, contests) {
        if(err) {
          console.log(err)
          return;
        }
        contests.map(function(item){
          var score = calculateScore(item.prediction, sensexValue)
          var data = item;
          data.score = score;
          Contest.findOneAndUpdate({_id: item._id}, data, {upsert: true}, function(err, doc) {
            console.log(doc)
          })
        })
      })
    })
  } , function() {
  },
  true,
  'Asia/Kolkata'
);

var sensexValueJob = new CronJob('00 30 15 * * 1-5', function() {
    let date = new Date().toJSON().slice(0,10);
    let sensexValue = new SensexValue({
      date: date,
      value: random.real(27000, 27060)
    })
    sensexValue.save(function(err) {
      if(err) {
        return console.log(err);
      }
      console.log('saved')
    });

  } , function() {
  },
  true,
  'Asia/Kolkata'
);

var nextDateJob = new CronJob('00 00 09 * * 1-5', function() {
    if (new Date().getDay() != 5 ) {
      let nextDate = new NextDate({
        nextDate: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toJSON().slice(0,10)
      })
      nextDate.save(function(err) {
        if(err) {
          return console.log(err);
        }
        console.log('saved')
      });
    } else {
      let nextDate = new NextDate({
        nextDate: new Date(new Date().getTime() + (3 * 24 * 60 * 60 * 1000)).toJSON().slice(0,10)
      })
      nextDate.save(function(err) {
        if(err) {
          return console.log(err);
        }
        console.log('saved')
      });

    }

  } , function() {
  },
  true,
  'Asia/Kolkata'
);

var http = require('http').Server(app);
var io = require('socket.io')(http);


mongoose.connect(config.database, function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log('Connected to the database');
	}
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

var api = require('./app/routes/api')(app, express, io);
app.use('/api', api);


app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/app/views/index.html');
});

http.listen(config.port, function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log("Listening on port 3000");
	}
});
