define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('LoadingCtrl', function ($scope, $interval, $state) {
    	$scope.appName = 'TATTLEZ';
    	$scope.progress = 0;
    	var stopProgress = $interval(updateProgress, 10);
    	function updateProgress() {
    		if ($scope.progress != 100)
    			$scope.progress += 2;
    		if ($scope.progress == 100)
    			$state.go('join');
    	}
    	// listen on DOM destroy (removal) event, and cancel the next UI update
    	// to prevent updating time after the DOM element was removed.
    	$scope.$on('$destroy', function () {
    		$interval.cancel(stopProgress);
    	});
    });
});
