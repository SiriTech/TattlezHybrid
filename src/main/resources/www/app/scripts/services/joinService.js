/**
 * Created by bindum on 26/7/14.
 */
define(['../modules/services'], function (services) {
	'use strict';
	services.factory('joinSrvc', function ($http, $q, $rootScope, $timeout, configSrvc) {
		var mobileAndOtp = {}, //object to save mobile number and OTP
            userProfile = {};

		// Sets mobile number from join form
		function setMobileNumber(mobileNumber) {
			mobileAndOtp.mobileNumber = mobileNumber;
		}

		/**
         * Generates 4 digit random number
         * Broadcasts Event to generate new OTP
         */
		function setOtp() {
			mobileAndOtp.otp = Math.floor(Math.random()*9000) + 1000;
			$timeout(function () {
				mobileAndOtp.otp = null;
				$rootScope.$broadcast("UPDATE_OTP");
			}, configSrvc.otpDelay);
		}

        function setProfile(profileObj) {
            userProfile.profilePic = profileObj.profilePic;
            userProfile.profileName = profileObj.profileName;
            userProfile.profileStatus = profileObj.profileStatus;
        }

		// Gets mobile and OTP object
		function getMobileAndOtp() {
			return mobileAndOtp;
		}

        function getUserProfile() {
            return userProfile;
        }

		function getUserId() {
			return localStorage.getItem(configSrvc.uidLocalStorage);
		}

		function getallUsers() {
			var future = $q.defer();
			$http.jsonp(configSrvc.serverURL+'/users/getall?callback=JSON_CALLBACK').success(function (data) {
				future.resolve(data);

			}, function (err) { future.reject(err); });
			return future.promise;
		}

		function getUserIdByMobileNumber() {
			var future = $q.defer();
			$http.get(configSrvc.serverURL+'/users/getUserIdByMobileNumber/' + mobileAndOtp.mobileNumber).success(function (data) {
				future.resolve(data);
				localStorage.setItem(configSrvc.uidLocalStorage, data);
			}, function (err) { future.reject(err); });
			return future.promise;
		}
		
		function getUserIdByContactMobileNumber(mobileNumber) {
			var future = $q.defer();
			$http.get(configSrvc.serverURL+'/users/getUserIdByMobileNumber/' + mobileNumber).success(function (data) {
				future.resolve(data);
			}, function (err) { future.reject(err); });
			return future.promise;
		}

		function addUser(user) {
			var future = $q.defer();
			$http.post(configSrvc.serverURL+'/users/addUser', user).success(function (data) {
				if (data != null) {
					localStorage.setItem(configSrvc.uidLocalStorage, data._id);
					future.resolve(data);
				}
				else {
					var promises = [];
					promises.push(getUserIdByMobileNumber());
					$q.all(promises).then(function (result) {
						future.resolve(result[0]);
					});
				}
			}).error(function (err) {
				future.reject(err);
			});
			return future.promise;
		}
		function getUserByUserId(userId){
			var future=$q.defer();
            var userId = userId ? userId : localStorage.getItem(configSrvc.uidLocalStorage);
			$http.post(configSrvc.serverURL+'/users/getUserByUserId/'+ userId).success(function(data){
				if(data!=null){
					future.resolve(data);
				}
			},function(err){
				future.reject(err);
			});
			return future.promise;
		}

        function updateUser(userProfile) {
            var future = $q.defer();
            $http.post(configSrvc.serverURL+'/users/updateUser',userProfile).success(function (data) {
                future.resolve(data);
            }, function (err) { future.reject(err); });
            return future.promise;

        }
		return {
			setMobileNumber: setMobileNumber,
			setOtp: setOtp,
            setProfile: setProfile,
            userProfile: userProfile,
            updateUser: updateUser,
			getMobileAndOtp: getMobileAndOtp,
            getUserProfile: getUserProfile,
			mobileAndOtp: mobileAndOtp,
			getallUsers: getallUsers,
			addUser: addUser,
			getUserIdByMobileNumber: getUserIdByMobileNumber,
			getUserId: getUserId,
			getUserByUserId:getUserByUserId,
			getUserIdByContactMobileNumber: getUserIdByContactMobileNumber
		};
	});
});
