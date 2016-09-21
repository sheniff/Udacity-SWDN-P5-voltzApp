'use strict';

angular
  .module('voltz.controllers.countdown', [])
  .controller('PlugCountdownCtrl', ['$scope', '$interval', '$state', '$ionicLoading', 'UserService', 'GLOBAL',
    function PlugCountdownCtrl($scope, $interval, $state, $ionicLoading, User, GLOBAL){

      $scope.totalTime = GLOBAL.timeToPlug;

      var countdownInterval,
          pollInterval,

          runIntervals = function(){
            countdownInterval = $interval(countdownFn, 1000);
            pollInterval = $interval(pollFn, 5000);
          },

          cancelIntervals = function(){
            $interval.cancel(countdownInterval);
            $interval.cancel(pollInterval);
          },

          countdownFn = function(){
            if(--$scope.time <= 0){
              cancelIntervals();
              // reallocate in line and redirect to '^.line'
            }
          },

          pollFn = function(){
            User.getStatus().then(function(status){
              if(status.chargeStatus !== 'assigned'){
                cancelIntervals();

                switch(status.chargeStatus) {
                  case 'unplugged':
                    $state.go('tab.plug');
                  break;
                  case 'waiting':
                    $state.go('tab.line');
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

          $ionicLoading.show({
            template: 'Loading...'
          });

      User.getStatus().then(function(data){
        var now = new Date().getTime(),
            sinceAssigned = parseInt((now - data.lastTimeAssigned) / 1000, 10);

        $scope.status = data;
        $scope.time = GLOBAL.timeToPlug - sinceAssigned;

        runIntervals();

        $ionicLoading.hide();
      });
    }
  ]);
