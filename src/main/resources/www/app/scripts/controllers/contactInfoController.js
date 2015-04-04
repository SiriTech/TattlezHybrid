/**
 * Created by bindu on 24/03/15.
 */
define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('ContactInfoCtrl', function ($scope,$filter, $state, contactsSrvc, joinSrvc) {
        $scope.contactInfo = {};
        $scope.groupContactInfo = {};
        $scope.groupContactInfoArray = [];
            // Fetches the contact Id
        $scope.contactId = contactsSrvc.getSelectedContactForInfo();
        var userId = joinSrvc.getUserId();

        //get the contact details to display
        if($scope.contactId) {
            contactsSrvc.getChatContactDetails($scope.contactId).then(function(data){
                // gets all the contact details except status.
                $scope.contactInfo=data[0];

                /**
                 * For individual contacts show the status
                 * For group, show all the members and their statuses.
                 */
                if (!$scope.contactInfo.group) {
                    //Get contact id based on his mobile number.
                    joinSrvc.getUserIdByContactMobileNumber($scope.contactInfo.contactNumber).then(function(userId){
                        // Now get profile status from this
                        joinSrvc.getUserByUserId(userId).then(function (userdata){
                            $scope.contactInfo.status = userdata.profileStatus;
                        });
                    });
                } else {
                    var allContactsArray = JSON.parse(localStorage.getItem(userId + '_C'));
                    var groupContacts = $scope.contactInfo.contactNumber.split(',');
                    /**
                     * For group show all the participants of the group
                     * If the group member exists in contacts list show his name
                     * If not show the contact number for name also.
                     */
                    angular.forEach(groupContacts,function(v,k){
                        var obj = {};
                        var contact = $filter('filter')(allContactsArray,{contactNumber: v},true)[0];
                        if(contact)
                            obj.contactName = contact.contactName;
                        else
                            obj.contactName =  v;
                        obj.contactNumber = v;
                        obj.photo = (contact && contact.photo) ? contact.photo : "../images/default_profile_M.jpg";
                        $scope.groupContactInfoArray.push(obj);
                    });
                }
            });
        }

        $scope.gotoContacts = function () {
            $state.go("contacts");
        }

        $scope.gotoHistory = function () {
            $state.go("history");
        }

    });
});