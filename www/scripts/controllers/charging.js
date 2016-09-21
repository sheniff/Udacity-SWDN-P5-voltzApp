'use strict';

angular
  .module('voltz.controllers.charging', [])
  .controller('ChargingCtrl', ['$scope', '$interval', '$state', 'UserService',
    function ChargingCtrl($scope, $interval, $state, User){
      var poll = $interval(function(){

        User.getStatus().then(function(data){
          if(data.chargeStatus !== 'charging') {
            $interval.cancel(poll);

            switch(data.chargeStatus) {
              case 'unplugged':
                // TODO: $state.go('^.carUnpluggedAlert');
                // options there: "it's me who unplugged", "report misbehavior"
                $state.go('tab.plug');
              break;
              case 'waiting':
                $state.go('tab.line');
              break;
              case 'assigned':
                $state.go('tab.plugCountdown');
              break;
              case 'completed':
                $state.go('tab.unplugCountdown');
              break;
            }
          }
        });
      }, 5000);
    }
  ]);
