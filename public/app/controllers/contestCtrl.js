angular.module('contestCtrl', ['contestService'])


	.controller('ContestController', function(Contest, socketio) {


		var vm = this;

		Contest.all()
			.success(function(data) {
				vm.stories = data;
			});

		Contest.contestByUser()
			.success(function(contestData) {
				vm.contestByUser = contestData.length;
				vm.totalScore = 0;
				vm.lastDate = 'Not Parcipated';
				vm.lastScore = 0;
				if(contestData.length >=1 ) {
					contestData.map(function(item) {
						vm.totalScore = vm.totalScore + item.score
					})
					vm.lastDate = contestData[contestData.length-1].date;
					vm.lastScore = contestData[contestData.length-1].score;
				}

			});

		Contest.daysElapsed()
			.success(function(contestData) {
				vm.daysElapsed = 0;
				if(contestData.length > 0) {
					vm.daysElapsed = contestData.length-1;
				}
			});

		Contest.checkUserParticipation()
			.success(function(contestData) {
				if (contestData) {
					vm.hasParticipated = true;
				} else {
					vm.hasParticipated = false;
				}
			});


		socketio.on('story', function(data) {
			vm.stories.push(data);
		})

})

.controller('ContestCreateController', function(Contest, $location, $window) {

	var vm = this;

	vm.predict = function() {
		vm.message = '';

		Contest.create(vm.contestData)
			.then(function(response) {
				vm.contestData = {};
				vm.message = response.data.message;
				$location.path('/');
			})
	}

})

.controller('AllStoriesController', function(stories, socketio) {

	var vm = this;

	vm.stories = stories.data;

	socketio.on('story', function(data) {
			vm.stories.push(data);
	});



});
