'use strict';

angular.module('App.Filters', ['App.config'])
  .filter('limitchars', function () {
    return function (x, limit) {
      if (x.length < limit) {
        return x;
      } else {
        return x.substring(0, limit) + '...';
      }
    }
  });
