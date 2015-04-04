/**
 * Created by Reddy on 28-07-2014.
 */
define(['../modules/services'], function (services) {
    'use strict';
    services.factory('addContactSrvc', function ($http,$q,$rootScope, $timeout, configSrvc) {
        //Adds Contact to database
        function addContact(contact){
            var future = $q.defer();
            $http.post(configSrvc.serverURL+'/contacts/addContact',contact).success(function(data){
                future.resolve(data);
            },function(err){future.reject(err);});
            return future.promise;
        }

        return {
            addContact: addContact
        };
    });
});
