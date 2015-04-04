/**
 * Created by Reddy on 26-07-2014.
 */
define(['../modules/directives'], function (directives) {
    'use strict';
    directives.directive("focus", function ($timeout) {
        return {
            scope : {
                trigger : '@focus'
            },
            link : function(scope, element) {
                scope.$watch('trigger', function(value) {
                    if (value === "true") {
                        $timeout(function() {
                            element[0].focus();
                        });
                    }
                });
            }
        };
    });
});

