'use strict';

angular.module('App.Filters', ['App.config'])
  .filter('limitchars', function () {
    return function (x, limit) {
      if (x) {
        if (x.length < limit) {
          return x;
        } else {
          return x.substring(0, limit) + '...';
        }
      }

    }
  }).filter('externalLinks', function() {
  return function(text) {
    return String(text).replace(/href=/gm, "class=\"ex-link\" href=");
  }
});
