/**
 * Created by bindum on 27/7/14.
 */
define(['../modules/controller'], function (controllers) {
	'use strict';
	controllers.controller('addContactCtrl', function ($scope, $state, addContactSrvc, joinSrvc, contactsSrvc) {
		$scope.contactName;
		$scope.contactNumber;
		$scope.showAlert = false;
		/**
         * Clicking cancel and back button in the Footer will navigate to Contacts form
         */
		$scope.gotoContactsForm = function () {
			$state.go('contacts');
		};

        /**
         * Clicking Home button in the Footer will navigate to History page
         */
        $scope.gotoHistory = function () {
            $state.go('history');
        };


		/**
         * Clicking Save will save contact to database
         */
		$scope.addContact = function () {
			var contact = {};
			contact.group = false;
			contact.contactName = $scope.contactName;
			contact.contactNumber = $scope.contactNumber;
			contact.userId = joinSrvc.getUserId();
			addContactSrvc.addContact(contact).then(function (result) {
				if (result == 'OK'){
					contactsSrvc.refreshContacts().then(function(res){
        				$state.go('contacts');
        			});
				}	
				else {
					$scope.showAlert = true;
				}
			});

		};
	});
});
