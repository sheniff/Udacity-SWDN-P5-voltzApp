'use strict';

angular
  .module('voltz.services.user', [])

  .provider('UserService', ['$httpProvider',
    function UserServiceProvider($httpProvider) {

    var user;

    // Register user
    this.init = function() {
      // kick off the platform web client
      Ionic.io();

      // this will give you a fresh user or the previously saved 'current user'
      user = Ionic.User.current();

      // if the user doesn't have an id, you'll need to give it one.
      if (!user.id) {
        user.id = Ionic.User.anonymousId();
      }

      //persist the user
      user.save();

      // set up as header in http provider
      $httpProvider.defaults.headers.common['X-User'] = user.id;

      return user;
    };

    this.$get = ['$http', 'API_URL', '$q', '$timeout', '$log',
      function UserService($http, API_URL, $q, $timeout, $log) {
        var demoModeOn = true;

        var timeAssigned = 1,
            timeCharging = 1,
            timeCompleted = 1;

        var fakeStateBackup = {
          current: 0,
          total: 10,
          lastTimeAssigned: new Date().getTime() - 300000, // some time before it gets to 0
          lastTimeCharged: new Date().getTime(), // some time before it gets to 0
          station: {
            name: 'Garage C 2nd Floor - 14',
            location: {
              name: 'Yahoo! Building C Garage',
              address: '701 First Avenue',
              city: 'Sunnyvale',
              state: 'CA',
              zipcode: '94089'
            },
            coordinates: {
              latitude: 37.418,
              longitude: -122.0246
            }
          },
          chargeStatus: 'unplugged'
        };

        var fakeState = fakeStateBackup;

        return {
          get: function(attr) {
            if (attr === 'id') {
              return user.id;
            }

            return user.get(attr);
          },

          set: function(attr, value) {
            user.set(attr, value);
            user.save();
          },

          // demo mode to false by default
          getDemoMode: function() {
            return demoModeOn;
          },

          enableDemoMode: function() {
            demoModeOn = true;
            fakeState = fakeStateBackup;
          },

          disableDemoMode: function() {
            demoModeOn = false;
          },

          getStatus: function() {
            // fake mode
            if(demoModeOn) {
              $log.log('[Demo Mode ON]');
              var defer = $q.defer();

              $timeout(function() {
                console.log('state', fakeState.chargeStatus);

                switch(fakeState.chargeStatus) {
                  case 'waiting':
                    if(fakeState.current-- === 0) {
                      fakeState.chargeStatus = 'assigned';
                      timeAssigned = 2;
                    }
                    break;
                  case 'assigned':
                    console.log('assigned', timeAssigned);
                    if(timeAssigned-- === 0) {
                      fakeState.chargeStatus = 'charging';
                      timeCharging = 2;
                    }
                    break;
                  case 'charging':
                    console.log('charging', timeCharging);
                    if(timeCharging-- === 0) {
                      fakeState.chargeStatus = 'completed';
                      timeCompleted = 2;
                    }
                    break;
                  case 'completed':
                    console.log('completed', timeCompleted);
                    if(timeCompleted-- === 0) {
                      fakeState.chargeStatus = 'unplugged';
                    }
                    break;
                }

                defer.resolve(fakeState);
              }, 100);

              return defer.promise;
            } else {
              return $http.get(API_URL + '/status')
                .then(function(res) { return res.data; });
            }
          },

          addPushToken: function(token) {
            user.addPushToken(token);
            user.save();
          },

          requestPlug: function() {
            if(demoModeOn) {
              $log.log('[Demo Mode ON]');
              // fake mode
              fakeState.current = 3;
              fakeState.chargeStatus = 'waiting';
              return this.getStatus();
            } else {
              return $http.post(API_URL + '/enqueue')
                .then(function(res) { return res.data; });
            }
          }
        };
      }
    ];
  }]);
