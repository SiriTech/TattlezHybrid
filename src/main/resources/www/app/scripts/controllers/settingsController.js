/**
 * Created by bindu on 22/02/15.
 */
define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('settingsCtrl', function ($scope, $state) {

        $scope.settingsList = [
            {
                name: 'Help',
                icon: 'pencil'
            },
            {
                name: 'Profile',
                icon:'user'

            },
            {
                name: 'Account',
                icon:'gear'
            }
        ];

        $scope.handleSettings = function(itemIndex, itemLabel) {
            if (itemLabel == $scope.settingsList[itemIndex].name) {
                if (itemIndex == 0) {
                    //$state.go('help');
                } else if (itemIndex == 1) {
                    $state.go('profile');
                }
            }
        };
        $scope.gotoHistory = function() {
            $state.go('history');
        }
    });
});
