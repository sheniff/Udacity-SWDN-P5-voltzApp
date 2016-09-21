'use strict';

angular
  .module('voltz.controllers.report', [])
  .controller('ReportCtrl', ['$scope', '$log', 'UserService', 'Camera',
    function ReportCtrl($scope, $log, User, Camera){

      var newReport = {
        reporter: {
          username: User.get('username'),
          id: User.get('id'),
          avatar: User.get('image') || 'https://ionic-apps.s3.amazonaws.com/img/users/users-default-avatar@2x.png'
        }
      };

      $scope.startReport = function() {
        $scope.newReport = angular.copy(newReport);
      };

      $scope.clearReport = function() {
        $scope.newReport = null;
      };

      $scope.takePicture = function() {
        Camera.getPicture().then(function(imageURI) {
          $log.log(imageURI);
          $scope.newReport.picture = imageURI;
        }, function(err) {
          $log.error(err);
        });
      };

      $scope.createReport = function() {
        var report = angular.copy($scope.newReport);
        report.date = new Date();

        $scope.reports.unshift(report);
        $scope.clearReport();
      };

      $scope.reports = [
        {
          reporter: {
            username: 'sheniff',
            id: 'ed91fd04-48ce-4e40-87dc-fd89a0270667',
            avatar: 'http://www.emoticonswallpapers.com/avatar/thumb/funny/funny8.jpg'
          },
          picture: 'http://wp.clickmechanic.com/wp-content/uploads/2013/05/really-funny-crazy-car-parking-picture2.jpg',
          message: 'Someone might\'ve messed it up today, just a hunch.',
          date: new Date()
        },{
          reporter: {
            username: 'jesusft',
            id: 'ed91fd04-48ce-4e40-87dc-fd89a0270667',
            avatar: 'https://pbs.twimg.com/profile_images/1336056255/roto2.jpg'
          },
          picture: 'https://sites.google.com/site/derickveliz/4DParking3s.jpg',
          message: 'I\'d love to get home today... Anytime...',
          date: new Date(new Date().getTime() - 123456)
        },{
          reporter: {
            username: 'sheniff',
            id: 'ed91fd04-48ce-4e40-87dc-fd89a0270667',
            avatar: 'http://www.emoticonswallpapers.com/avatar/thumb/funny/funny8.jpg'
          },
          picture: 'http://www.signsfunny.com/wp-content/uploads/2010/08/mysterious-parking-6.jpg',
          message: 'Yeah... Ok. This guy doesn\'t use gas but... where do you plug the cable? No answer needed...',
          date: new Date(new Date().getTime() - 654321)
        }
      ];

    }
  ]);
