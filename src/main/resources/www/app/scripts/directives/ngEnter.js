/**
 * Created by Reddy on 26-07-2014.
 */
define(['../modules/directives'], function (directives) {
    'use strict';
    directives.directive("ngEnter", function ($timeout) {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    if (!event.shiftKey) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngEnter);
                        });
                        event.preventDefault();
                    }
                }
            });
        };
    });
});