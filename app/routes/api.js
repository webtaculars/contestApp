const User = require('../models/user');
const Contest = require('../models/contest');
const SensexValue = require('../models/sensexValue');
const NextDate = require('../models/nextDate');
const config = require('../../config');
const secretKey = config.secretKey;
const jsonwebtoken = require('jsonwebtoken');

function createToken(user) {
	const token = jsonwebtoken.sign({
		id: user._id,
		name: user.name,
		username: user.username
	}, secretKey, {
		expirtesInMinute: 1440
	});
	return token;
}

module.exports = function(app, express, io) {

	const api = express.Router();

	api.post('/signup', function(req, res) {

		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password
		});
		var token = createToken(user);
		user.save(function(err) {
			if(err) {
				res.send(err);
				return;
			}

			res.json({
				success: true,
				message: 'User has been created!',
				token: token
			});
		});
	});


	api.get('/users', function(req, res) {

		User.find({}, function(err, users) {
			if(err) {
				res.send(err);
				return;
			}

			res.json(users);

		});
	});

	api.get('/contests', function(req, res) {

		Contest.find({}, function(err, contests) {
			if(err) {
				res.send(err);
				return;
			}

			res.json(contests);

		});
	});

	api.post('/login', function(req, res) {

		User.findOne({
			username: req.body.username
		}).select('name username password').exec(function(err, user) {

			if(err) throw err;

			if(!user) {

				res.send({ message: "User doenst exist"});
			} else if(user){

				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword) {
					res.send({ message: "Invalid Password"});
				} else {

					///// token
					var token = createToken(user);

					res.json({
						success: true,
						message: "Successfuly login!",
						token: token
					});
				}
			}
		});
	});

	api.use(function(req, res, next) {

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		// check if token exist
		if(token) {



			jsonwebtoken.verify(token, secretKey, function(err, decoded) {

				if(err) {
					res.status(403).send({ success: false, message: "Failed to authenticate user"});
				} else {
					req.decoded = decoded;
					next();
				}
			});
		} else {
			res.status(403).send({ success: false, message: "No Token Provided"});
		}

	});



	api.post('/addContest', (req, res) => {

		NextDate.findOne({}, {}, { sort: { '_id' : -1 } }, (err, nextDate) => {
			if(err) {
				res.send(err);
				return;
			}
			const contest = new Contest({
				userId: req.decoded.id,
				prediction: req.body.prediction,
				date: nextDate.nextDate,
				score: 0
			});
			contest.save(function(err) {
				if(err) {
					res.send(err);
					return;
				}

				res.json({
					success: true,
					message: 'User has applied for today\' contest!',
				});
			});

		})

	});

	api.get('/contestByUserId', (req, res) => {

		Contest.find({userId: req.decoded.id}, (err, contests) => {
			if(err) {
				res.send(err);
				return;
			}
			res.json(contests);

		});
	});

	api.get('/daysElapsed', (req, res) => {
		SensexValue.find({}, (err, sensexValues) => {
			if(err) {
				res.send(err);
				return;
			}
			res.json(sensexValues);

		})
	})

	api.get('/nextDate', (req, res) => {
		NextDate.findOne({}, {}, { sort: { '_id' : -1 } }, (err, nextDate) => {
			if(err) {
				res.send(err);
				return;
			}
			res.json(nextDate);

		})
	})

	api.get('/checkUserParticipation', (req, res) => {
		NextDate.findOne({}, {}, { sort: { '_id' : -1 } }, (err, nextDate) => {
			if(err) {
				res.send(err);
				return;
			}

			Contest.findOne({userId:req.decoded.id, date:nextDate.nextDate}, (err, contestData) => {
				if(err) {
					res.send(err);
					return;
				}
				res.json(contestData)
			})
		})

	})

	api.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	return api;
}
