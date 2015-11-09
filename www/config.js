

//var domain = 'http://localhost:3000/api'
var domain = 'http://lemondev.xyz:3000/api'





var backend = domain;
angular.module('App.config', [])

.factory('Configuration', function() {
    return {
        backend: backend
    }
});
