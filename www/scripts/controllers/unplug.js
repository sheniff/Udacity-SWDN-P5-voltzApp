'use strict';

angular
  .module('voltz.controllers.unplug', [])
  .controller('UnplugCountdownCtrl', ['$scope', '$interval', '$state', '$ionicLoading', 'UserService', 'GLOBAL',
    function UnplugCountdownCtrl($scope, $interval, $state, $ionicLoading, User, GLOBAL){
      $scope.totalTime = GLOBAL.timeToUnplug;
      $scope.maxKarma = GLOBAL.maxPositiveKarma;
      $scope.minKarma = Math.abs(GLOBAL.maxNegativeKarma);

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
            $scope.absTime = Math.abs(--$scope.time);
            $scope.karma = Math.max( Math.round($scope.time * 1.0 / GLOBAL.timeToUnplug * GLOBAL.maxPositiveKarma), GLOBAL.maxNegativeKarma);
            $scope.absKarma = Math.abs($scope.karma);
          },

          pollFn = function(){
            User.getStatus().then(function(data){
              if(data.chargeStatus !== 'completed'){
                cancelIntervals();

                switch(data.chargeStatus) {
                  case 'unplugged':
                    $state.go('tab.plug');
                  break;
                  case 'waiting':
                    $state.go('tab.line');
                  break;
                  case 'assigned':
                    $state.go('tab.plugCountdown');
                  break;
                  case 'charging':
                    $state.go('tab.charging');
                  break;
                }
              }
            });
          };

      $ionicLoading.show({
        template: 'Loading...'
      });

      User.getStatus()
        .then(function(data){
          var now = new Date().getTime(),
              sincePlugged = parseInt((now - data.lastTimeCharged) / 1000, 10);

          $scope.status = data;
          $scope.absTime = Math.abs($scope.time = GLOBAL.timeToUnplug - sincePlugged);

          runIntervals();

          $ionicLoading.hide();
        });
    }
  ]);
