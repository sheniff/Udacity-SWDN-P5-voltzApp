'use strict';

angular
  .module('voltz.controllers.account', [])
  .controller('AccountCtrl', ['$scope', 'UserService',
    function AccountCtrl($scope, User){
      $scope.user = {
        id: User.get('id'),
        username: User.get('username'),
        image: User.get('image') || 'https://ionic-apps.s3.amazonaws.com/img/users/users-default-avatar@2x.png'
      };

      $scope.update = function(form) {
        User.set('username', $scope.user.username);
        form.$setPristine();
      };

      $scope.demo = {
        mode: User.getDemoMode()
      };

      $scope.$watch('demo.mode', function(newVal) {
        console.log('demo mode', newVal);
        if(newVal) {
          User.enableDemoMode();
        } else {
          User.disableDemoMode();
        }
      });
    }
  ]);
