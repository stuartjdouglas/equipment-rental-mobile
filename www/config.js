
var domain = 'http://192.168.1.99:3000'

// var domain = 'http://localhost:3000'
// var domain = 'http://lemondev.xyz:3000'
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
