'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.initConfig({
        connect: {
            client: {
                options: {
                    protocol: 'http',
                    port: 9000,
                    base: 'app',
                    hostname: 'localhost',
                    keepalive: true,
                    livereload:true,
                    open: {
                        callback: function () {
                            console.log('new connection');
                        }
                    }

                }
            }
        }
    });

};