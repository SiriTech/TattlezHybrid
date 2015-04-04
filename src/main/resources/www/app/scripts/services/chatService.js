/**
* Created by Reddy on 08-08-2014.
*/
define(['../modules/services'], function (services) {
    'use strict';
    services.factory('chatSrvc', function ($http, $q, $rootScope, $timeout, joinSrvc, $filter,configSrvc) {
    	//An array to hold the communicationIds for each ContactId.
    	var contactCommunications = [];
    	//Adds Contact to database
        function getCommunicationId(contactNumber,isGrp,grpAdminNumber) {
        	var future = $q.defer();
        	if(!isGrp){
	            
	            var mobileNumber;
	            if(joinSrvc.mobileAndOtp.mobileNumber){
	            	$http.get(configSrvc.serverURL+'/communications/getCommunicationId/' + joinSrvc.mobileAndOtp.mobileNumber + '/' + contactNumber).success(function (data) {
	            		future.resolve(data);
	            	}, function (err) { future.reject(err); });
	            }
	            else{
		            joinSrvc.getUserByUserId().then(function(userdata){
						$http.get(configSrvc.serverURL+'/communications/getCommunicationId/' + userdata.mobileNumber + '/' + contactNumber).success(function (data) {
		            		future.resolve(data);
		            	}, function (err) { future.reject(err); });
					});	
	            }
            }else{
            	$http.get(configSrvc.serverURL+'/communications/getCommunicationId/' + grpAdminNumber + '/' + contactNumber).success(function (data) {
		            		future.resolve(data);
		            	}, function (err) { future.reject(err); });
            }
            return future.promise;
        }

        function addMessage(doc) {
            var future = $q.defer();
            $http.post(configSrvc.serverURL+'/messages/addMessage', doc).success(function (data) {
                future.resolve(data);
            }, function (err) { future.reject(err); });
            return future.promise;
        }

        function updateContactCommunicationIdMappings(obj) {
        	var userId = joinSrvc.getUserId();
        	
        	console.log(contactCommunications);
        	if(userId){
        		contactCommunications.push(obj);
        		localStorage.setItem(userId + "_CCM", JSON.stringify(contactCommunications));
        	}
        }
        function clearContactCommunicationsArray(){
        	contactCommunications=[];
        }
        function getContactCommunicationIdMappings(contactIdToMap) {
        	var future = $q.defer();
        	var userId = joinSrvc.getUserId();
        	var communicationMappings = JSON.parse(localStorage.getItem(userId + "_CCM"));
        	future.resolve($filter('filter')(communicationMappings, { contactId: contactIdToMap }));
        	return future.promise;
        }
        //remove Selected Communication ID for chat
        function removeSelectedCommunicationIdForChat(){
        	localStorage.removeItem(configSrvc.cmidLocalStorage);
        }
        function getMessagesByCommunicationId(communicationId){
        	var future = $q.defer();
        	$http.get(configSrvc.serverURL+'/messages/getMessagesByCommunicationId/' + communicationId ).success(function (data) {
        		future.resolve(data);
        	}).error(function(errData){
        		console.log(errData);
        		future.reject(errData);
        	});
        	return future.promise;
        }
        function getHistoryByUser(){
        	var future = $q.defer();
        	var userId = joinSrvc.getUserId();
        	var communicationMappings = JSON.parse(localStorage.getItem(userId + "_CCM"));
        	$http.post(configSrvc.serverURL+'/messages/getHistoryByUser',communicationMappings).success(function (data) {
        		future.resolve(data);
        	}).error(function(errData){
        		console.log(errData);
        		future.reject(errData);
        	});
        	return future.promise;
        }
        return {
            getCommunicationId: getCommunicationId,
            addMessage: addMessage,
            updateContactCommunicationIdMappings: updateContactCommunicationIdMappings,
            getContactCommunicationIdMappings: getContactCommunicationIdMappings,
            removeSelectedCommunicationIdForChat: removeSelectedCommunicationIdForChat,
            getMessagesByCommunicationId: getMessagesByCommunicationId,
            getHistoryByUser: getHistoryByUser,
            clearContactCommunicationsArray: clearContactCommunicationsArray
        };
    });
});