'use strict';

angular
  .module('voltz.directives.countdown', [])
  .directive('countdown', [
    function countdown(){
      return {
        restrict: 'E',
        transclude: true,
        scope: {
          progress: '='
        },
        templateUrl: 'templates/directives/countdown.html',
        link: function(scope, iElement, iAttrs){

          scope.$watch('progress', function(nv){
            drawProgress(nv);
          });

          var clamp = function (n, min, max){
            return Math.max(min, Math.min(max, n));
          };

          var drawProgress = function(percent){

            if(isNaN(percent)){
              return;
            }

            percent = clamp(parseFloat(percent), 0, 1);

            // 360 loops back to 0, so keep it within 0 to < 360
            var angle = clamp(percent * 360, 0, 359.99999);
            var paddedRadius = 50 + 1;
            var radians = (angle * Math.PI / 180);
            var x = Math.sin(radians) * paddedRadius;
            var y = Math.cos(radians) * - paddedRadius;
            var mid = (angle > 180) ? 1 : 0;
            var pathData = 'M 0 0 v -%@ A %@ %@ 1 '.replace(/%@/gi, paddedRadius)
                + mid + ' 1 '
                + x + ' '
                + y + ' z';

            var bar = iElement[0].querySelector('.progress-radial-bar');
            bar.setAttribute( 'd', pathData );
          };

          drawProgress(scope.progress);
        }
      }
    }
  ]);
