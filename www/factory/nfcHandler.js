(function(){

  angular.module('App.factory.nfcHandler', [])

    .factory('NFCHandler', ['$q', function($q) {
      var _url = undefined;

      function checkInviteURL(inviteURL) {
        var parser = document.createElement('a');
        parser.href = inviteURL;
        var res = parser.pathname.split("/");
        if(res[0]==='invite' && res[1]) {
          _url = res[1];
          return true;
        }
        else {
          return false;
        }
      }

      return {
        checkURL: checkInviteURL,
        get: function() { return _url;}
      }
    }]);
}())
