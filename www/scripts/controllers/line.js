'use strict';

angular
  .module('voltz.controllers.line', [])
  .controller('LineCtrl', ['$scope', '$timeout', '$state', '$ionicLoading', 'UserService',
    function LineCtrl($scope, $timeout, $state, $ionicLoading, User){
      var poll = function(){
        return User.getStatus().then(function(data){
          $scope.line = data;

          if($scope.line.chargeStatus === 'waiting'){
            console.log('current status', $scope.line.current);
            $timeout(poll, 5000);
          }else{
            switch($scope.line.chargeStatus) {
              case 'unplugged':
                $state.go('tab.plug');
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
          }
        });
      };

      poll().then(function(){
        $ionicLoading.hide();
      });
    }
  ]);
