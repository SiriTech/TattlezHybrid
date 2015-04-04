/**
 * Created by bindum on 27/7/14.
 */

define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('ContactsCtrl', function ($scope, $state, contactsSrvc, joinSrvc, chatSrvc,$timeout,$rootScope,$filter) {
    	$scope.showModal = 'display-none';
    	var userNumber;
    	contactsSrvc.getallContacts().then(function (result) {
    		if(result!==null){
    			var contacts = [];
    			angular.forEach(result,function(v,k){
    				v.photo = (v.photo).replace('..','app');
    				if(v.group){
    					var groupContactNumbers = v.contactNumber;
    					contactsSrvc.getContactNamesInGroup(groupContactNumbers,result).then(function(names){
    						v.contactNumber =names;
    						contacts.push(v);
    					});
    				}
    				else
    					contacts.push(v);
    				
    			});
    			
    			$scope.contacts = contacts;
    		}
    	});
    	$scope.$watch('$scope.contacts', function (newVal) {
    		$scope.contacts = $filter('orderBy')($scope.contacts, '+contactName', false);
		}, true);
    	if(joinSrvc.mobileAndOtp.mobileNumber){
			userNumber = joinSrvc.mobileAndOtp.mobileNumber;
		}
		else{
			joinSrvc.getUserByUserId().then(function(userdata){
				userNumber = userdata.mobileNumber;
			});	
		}
		/**
	     * Start Audio/Video
	     */
	    $scope.Call=function(contactId,type){
	    	chatSrvc.getContactCommunicationIdMappings(contactId).then(function (result) {
        		$scope.communicationId = result[0].communicationId;
        		//get the contact details to display the name on screen
				contactsSrvc.getChatContactDetails(contactId).then(function(data){
					$scope.contactDetails=data[0];
					$timeout(function () {
						//Broadcast Out going call to global window(appController).
						$rootScope.$broadcast("OUT_GOING_CALL",{ContactData:$scope.contactDetails,communicationId:$scope.communicationId,userNumber:userNumber,callType:type});
					}, 0);
				});
      		});
	    	
	    };
	    /**
	     * End Audio/Video
	     */
        /**
         * Clicking on Home and Back button will navigate to history page
         */
        $scope.gotoHistory = function () {
            $state.go('history');
        };
        /**
         * Loads Adding new contact page from Contacts
         */
        $scope.addNewContact = function () {
            $state.go('addContact');
        };

        /**
         * Displays contact information of the contact
         * @param contactId
         */
        $scope.contactInfo = function (contactId, isGroup) {
            var contact = {contactId: contactId, isGroup: isGroup};
            contactsSrvc.setSelectedContactForInfo(contactId);
            $state.go('contactInfo');
        };

    	/**
		* Loads chatting page from contacts
		**/
        $scope.chat = function (contactId) {
        	contactsSrvc.setSelectedContactForChat(contactId);
        	$state.go('chat');
        };
        $scope.confirmDeleteContact = function () {
        	var index = $scope.index;
        	var contact = {};
        	contact.contactNumber = $scope.contacts[index].contactNumber;
        	contact.userId = joinSrvc.getUserId();
        	contactsSrvc.deleteContact(contact).then(function (result) {
        		if (result == 'OK') {
        			$scope.contacts.splice(index, 1);
        			contactsSrvc.refreshContacts().then(function(res){
        			});
        		}
        		else {
        		}
        		deleteContactCloseModal();
        	});
        };
        $scope.cancelDeleteContact = function () {
        	deleteContactCloseModal();
        };
        function deleteContactCloseModal() {
        	$scope.index = null;
        	$scope.showModal = 'display-none';
        }
    	/**
		* Delete contact
		**/
        $scope.deleteContact = function (index) {
        	$scope.index = index;
        	$scope.contacts[index].isopen = false;
        	$scope.showModal = 'display-block';
        };
    });
});

