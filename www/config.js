
//var domain = 'http://192.168.1.99:3000'

//var domain = 'http://localhost'
var domain = 'http://lemondev.xyz:8080'
var api = '/api';

var backend = domain + api;
data = domain;

angular.module('App.config', [])

.factory('Configuration', function() {
    return {
      backend: domain + api,
      data: domain + data
    }
});
