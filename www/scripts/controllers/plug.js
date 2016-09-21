'use strict';

angular
  .module('voltz.controllers.plug', [])
  .controller('PlugCtrl', ['$scope', '$timeout', '$state', '$ionicLoading', 'UserService',
    function PlugCtrl($scope, $timeout, $state, $ionicLoading, User){
      var startTime, endTime, timeoutHandler,
          delay = 1000,
          transition = function(status){
            if(status.chargeStatus === 'assigned') {
              $state.go('^.plugCountdown');
            } else {
              $state.go('^.line');
            }
          },
          requestPlug = function() {
            $ionicLoading.show({
              template: 'Loading...'
            });

            User
              .requestPlug()
              .then(transition);
          };

      $scope.hideButton = false;
      $scope.tapped = false;

      // request user status
      User.getStatus().then(function(status) {
        switch(status.chargeStatus) {
          case 'waiting':
            $state.go('tab.line');
          break;
          case 'assigned':
            $state.go('tab.plugCountdown');
          break;
          case 'charging':
            $state.go('tab.charging');
          break;
          case 'completed':
            $state.go('tab.unplugCountdown');
          break;
        }
      });

      angular.extend($scope, {
        hold: function(){
          startTime = new Date().getTime();
          $scope.tapped = true;
          timeoutHandler = $timeout($scope.release, delay);
        },
        release: function(){
          $timeout.cancel(timeoutHandler);

          endTime = new Date().getTime();

          if($scope.hideButton){
            return;
          }

          if(endTime - startTime >= delay){
            $scope.hideButton = true;
            requestPlug();
          }else{
            $scope.tapped = false;
          }
        }
      });
    }
  ]);
