

//var domain = 'http://localhost:3000/api'
var domain = 'http://lemondev.xyz:3000'
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
