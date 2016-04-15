var domain = 'https://karite.xyz';
var api = '/api';

var backend = domain + api;
data = domain;

angular.module('App.config', [])

  .factory('Configuration', function () {
    return {
      backend: domain + api,
      data: domain + data
    }
  });
