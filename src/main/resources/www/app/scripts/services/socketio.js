define(['../modules/services'], function (services) {
'use strict';

    services.provider('socketio', function() {
        return {
            $get: function (configSrvc) {
            	var socketio = io.connect(configSrvc.serverURL+"/chat");
                return socketio;
            }
        };
    });
});