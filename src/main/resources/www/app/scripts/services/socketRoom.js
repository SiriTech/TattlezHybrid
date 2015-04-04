define(['../modules/services'], function (services) {
'use strict';

    services.provider('socketroom', function() {
        return {
            $get: function (configSrvc) {
            	var socketroom = io.connect(configSrvc.serverURL+"/AV");
                return socketroom;
            }
        };
    });
});