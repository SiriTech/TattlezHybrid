define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('JoinCtrl', function ($scope, $state, joinSrvc) {
        $scope.mobileNumber;
        /**
         * Saves mobile number in joinService
         * generates random number
         * navigates to Authenticate page
         */
        localStorage.clear();
        //$scope.device = device;
    	$scope.join = function () {
            joinSrvc.setMobileNumber($scope.mobileNumber);
            joinSrvc.setOtp();
            $state.go('authenticate');
    	};
    });
});
