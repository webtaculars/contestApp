angular.module('contestService', [])


.factory('Contest', function($http) {
	var contestFactory = {};

	contestFactory.allStories = function() {
		return $http.get('/api/all_stories');
	}

	contestFactory.all = function() {
		return $http.get('/api/');
	}

	contestFactory.contestByUser = function() {
		return $http.get('/api/contestByUserId');
	}

	contestFactory.daysElapsed = function() {
		return $http.get('/api/daysElapsed');
	}

	contestFactory.checkUserParticipation = function() {
		return $http.get('/api/checkUserParticipation');
	}

	contestFactory.create = function(contestData) {
		return $http.post('/api/addContest', contestData);
	}

	return contestFactory;

})

.factory('socketio', function($rootScope) {

	var socket = io.connect();
	return {

		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},

		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}

	};

});
