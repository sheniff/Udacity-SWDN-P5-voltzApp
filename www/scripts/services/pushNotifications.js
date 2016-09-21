'use strict';

angular
  .module('voltz.services.pushNotifications', [])
  .service('PushNotificationsService', ['$rootScope', '$ionicPush', 'UserService', 'NodePushServer', 'GCM_SENDER_ID',
    function PushNotificationsService($rootScope, $ionicPush, UserService, NodePushServer, GCM_SENDER_ID){
      /* apple recommends you register your application for push notifications
      on the device every time it’s run since tokens can change. The documentation
      says: ‘By requesting the device token and passing it to the provider every
      time your application launches, you help to ensure that the provider has the
      current token for the device. If a user restores a backup to a device other
      than the one that the backup was created for (for example, the user migrates
        data to a new device), he or she must launch the application at least once
      for it to receive notifications again. If the user restores backup data to a
        new device or reinstalls the operating system, the device token changes.
      Moreover, never cache a device token and give that to your provider; always
      get the token from the system whenever you need it.’ */
      return {
        register: function(cb, err){

          $ionicPush.init({
            debug: true,

            onNotification: function(notification) {
              var payload = notification.payload;
              console.log('notification', notification, payload);
              alert('notification received: ' + payload.text);
            },

            onRegister: function(token) {
              UserService.addPushToken(token);
              cb();
            },

            pluginConfig: {
              ios: {
                badge: true,
                sound: true,
                alert: true
               },
               android: {
                 iconColor: '#343434',
                 senderID: GCM_SENDER_ID
               }
            }
          });

          $ionicPush.register();
        }
      }
    }
  ]);
