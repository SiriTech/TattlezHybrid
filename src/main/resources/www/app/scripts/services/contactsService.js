/**
 * Created by Reddy on 28-07-2014.
 */
define(['../modules/services'], function (services) {
    'use strict';
    services.factory('contactsSrvc', function ($http, $q, joinSrvc, configSrvc,$rootScope,$filter) {
        //get all contacts
    	function getallContacts() {
    		var userId = joinSrvc.getUserId();
    		var future = $q.defer();
    		if (localStorage.getItem(userId + '_C')) {
    			future.resolve(JSON.parse(localStorage.getItem(userId + '_C')));
    		}
    		else {
    			$http.jsonp(configSrvc.serverURL+'/contacts/getallContacts/' + userId + '?callback=JSON_CALLBACK').success(function (data) {
                    console.log(data);
    				if(data!==null){
						localStorage.setItem(userId + '_C', JSON.stringify(data));
					}
                    future.resolve(data);
    				
    			}, function (err) { future.reject(err); });
    		}

            return future.promise;
        }
        function refreshContacts(){
        	var userId = joinSrvc.getUserId();
        	var future = $q.defer();
        	$http.jsonp(configSrvc.serverURL+'/contacts/getallContacts/' + userId + '?callback=JSON_CALLBACK').success(function (data) {
    				if(data!==null){
						localStorage.setItem(userId + '_C', JSON.stringify(data));
						$rootScope.$broadcast("ESTABLISH_COMMUNICATION");
					}
					else{
						localStorage.removeItem(userId + '_C');
						localStorage.removeItem(userId + '_CCM');
					}
    				future.resolve(data);
    			}, function (err) { 
    				future.reject(err); 
    				});
    		return future.promise;
        }
        //Delete Contact from database
        function deleteContact(contact) {
            var future = $q.defer();
            $http.post(configSrvc.serverURL+'/contacts/deleteContact', contact).success(function (data) {
                future.resolve(data);
            }, function (err) { future.reject(err); });
            return future.promise;
        }
        //set Selected Contact for chat.
        function setSelectedContactForChat(contactId) {
            localStorage.setItem(configSrvc.cidLocalStorage, contactId);
        }
        //get Selected Contact for chat.
        function getSelectedContactForChat() {
            return localStorage.getItem(configSrvc.cidLocalStorage);
        }
        //set Selected Contact for info.
        function setSelectedContactForInfo(contactId) {
            localStorage.setItem(configSrvc.cinfoLocalStorage, contactId);
        }
        //get Selected Contact for info.
        function getSelectedContactForInfo() {
            return localStorage.getItem(configSrvc.cinfoLocalStorage);
        }

        //remove Selected Contact for chat
        function removeSelectedContactForChat(){
        	localStorage.removeItem(configSrvc.cidLocalStorage);
        }
        //get details of chat contact
        function getChatContactDetails(contactId) {
            var future = $q.defer();
            $http.jsonp(configSrvc.serverURL+'/contacts/getChatContactDetails/' + contactId + '?callback=JSON_CALLBACK').success(function (data) {
                future.resolve(data);
            }, function (err) {
                future.reject(err);
            });
            return future.promise;
        }
        function getContactNamesInGroup(groupContactNumbers,Contacts){
        	var future = $q.defer();
    		var contactNumbers = groupContactNumbers.split(',');
    		var names = [];
    		angular.forEach(contactNumbers,function(v,k){
    			var contact = $filter('filter')(Contacts,{contactNumber:v},true)[0];
				if(contact)
					names.push(contact.contactName);
				else
					names.push(v);
			});
			future.resolve(names.join(','));
    		return future.promise;
    	};
        return {
            getallContacts: getallContacts,
            deleteContact: deleteContact,
            setSelectedContactForChat: setSelectedContactForChat,
            getSelectedContactForChat: getSelectedContactForChat,
            setSelectedContactForInfo: setSelectedContactForInfo,
            getSelectedContactForInfo: getSelectedContactForInfo,
            removeSelectedContactForChat: removeSelectedContactForChat,
            getChatContactDetails: getChatContactDetails,
            refreshContacts: refreshContacts,
            getContactNamesInGroup: getContactNamesInGroup
        };
    });
});
