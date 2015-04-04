/**
 * Created by bindum on 6/8/14.
 */
define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('newGroupCtrl', function ($scope, $state, addContactSrvc, contactsSrvc, joinSrvc,$q) {
        $scope.groupName;
        $scope.selectedContacts = [];

        contactsSrvc.getallContacts().then(function (response) {
            $scope.contactsList = response;
        });
    	/**
         * Clicking on Home button will navigate to history page
         */
        $scope.gotoHistory = function () {
        	$state.go('history');
        };
    	/**
         * Clicking on Back button will navigate to contacts page
         */
        $scope.gotoContacts = function () {
        	$state.go('contacts');
        };
        
        $scope.handleAddedGroupContacts = function (contact) {
            $scope.selectedContacts.push(contact.contactNumber);
        };
       // $scope.groupContactNumber;

        $scope.createGroup = function () {
        	var userNumber;
        	var groups=[];
        	var getUserIdPromises=[];
        	var addContactPromises=[];
		if(joinSrvc.mobileAndOtp.mobileNumber){
			userNumber = joinSrvc.mobileAndOtp.mobileNumber;
			$scope.newGroup(userNumber,groups,getUserIdPromises,addContactPromises);
		}
		else{
			joinSrvc.getUserByUserId().then(function(userdata){
				userNumber = userdata.mobileNumber;
				$scope.newGroup(userNumber,groups,getUserIdPromises,addContactPromises);
			});	
		}  	
        	
        	
        };
		$scope.newGroup=function(userNumber,groups,getUserIdPromises,addContactPromises){
			angular.forEach($scope.selectedContacts, function(value, key) {
			  getUserIdPromises.push(
			  	joinSrvc.getUserIdByContactMobileNumber(value).then(function(result){
			  		return result;
			  	})
			  );
			}, groups);
			$q.all(getUserIdPromises).then(function (response) {
				angular.forEach($scope.selectedContacts, function(value, key) {
			  		var newGroup = {};
		        	newGroup.group = true;
		            newGroup.contactName = $scope.groupName;
		            newGroup.contactNumber = $scope.selectedContacts.join(",")+','+userNumber;
		            newGroup.userId = response[key];
		            newGroup.groupAdmin = userNumber;
		            addContactPromises.push(
		            	addContactSrvc.addContact(newGroup).then(function (result) {
		            		return result;
		            	})
		            );
				}, groups);
			});
			$q.all(addContactPromises).then(function(res){
				var newGroup = {};
        	newGroup.group = true;
            newGroup.contactName = $scope.groupName;
            newGroup.contactNumber = $scope.selectedContacts.join(",")+','+userNumber;
            newGroup.userId = joinSrvc.getUserId();
            console.log(newGroup.userId);
            newGroup.groupAdmin = userNumber;
            addContactSrvc.addContact(newGroup).then(function (result) {
                if (result == 'OK'){
                    contactsSrvc.refreshContacts().then(function(res){
        				$state.go('contacts');
        			});
    			}
                else {
                    $scope.showAlert = true;
                }
            });
			});
		};
    });
});