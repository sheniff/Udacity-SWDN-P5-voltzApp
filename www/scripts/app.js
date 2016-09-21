angular
  .module('voltz', [
    'voltz.thirdparties',
    'voltz.controllers',
    'voltz.directives',
    'voltz.services',
    'voltz.templates'
  ])
  .config(function($stateProvider, $urlRouterProvider){
    $stateProvider
      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:
      .state('tab.plug', {
        url: '/plug',
        views: {
          'tab-plug': {
            templateUrl: 'templates/plug-start.html',
            controller: 'PlugCtrl'
          }
        }
      })

      .state('tab.line', {
        url: '/line',
        views: {
          'tab-plug': {
            templateUrl: 'templates/plug-line.html',
            controller: 'LineCtrl'
          }
        }
      })

      .state('tab.plugCountdown', {
        url: '/plugcountdown',
        views: {
          'tab-plug': {
            templateUrl: 'templates/plug-plugcountdown.html',
            controller: 'PlugCountdownCtrl'
          }
        }
      })

      .state('tab.charging', {
        url: '/charging',
        views: {
          'tab-plug': {
            templateUrl: 'templates/plug-charging.html',
            controller: 'ChargingCtrl'
          }
        }
      })

      .state('tab.unplugCountdown', {
        url: '/unplug',
        views: {
          'tab-plug': {
            templateUrl: 'templates/plug-unplugcountdown.html',
            controller: 'UnplugCountdownCtrl'
          }
        }
      })

      .state('tab.report', {
        url: '/report',
        views: {
          'tab-report': {
            templateUrl: 'templates/tab-report.html',
            controller: 'ReportCtrl'
          }
        }
      })

      .state('tab.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/tab/plug');
  })

  .config(function(UserServiceProvider){
    // User initialization
    UserServiceProvider.init();
  })

  .run(function($ionicPlatform, PushNotificationsService, UserService, $rootScope, $state, $ionicConfig, $timeout){

    // handle ready state
    $ionicPlatform.ready(function(){

      if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if(window.StatusBar){
        StatusBar.styleLightContent();
      }

      // register push notifications
      PushNotificationsService.register(function(){
        $rootScope.pushNotifications = true;
      });
    });

    // This fixes transitions for transparent background views
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      // set transitions to android to avoid weird visual effect in the walkthrough transitions
      $timeout(function(){
        $ionicConfig.views.transition('android');
        $ionicConfig.views.swipeBackEnabled(false);
        console.log('setting transition to android and disabling swipe back');
      }, 0);
    });

    // handle resume state
    $ionicPlatform.on('resume', function(){
      // if push notifications haven't been enabled yet, annoy the user
      if(!$rootScope.pushNotifications) {
        PushNotificationsService.register(function(){
          $rootScope.pushNotifications = true;
        });
      }
    });
  })

  .constant('GLOBAL', {
    timeToPlug: 60 * 60,    // seconds
    timeToUnplug: 60 * 60,  // seconds
    maxPositiveKarma: 60,
    maxNegativeKarma: -120
  })

  .constant('GCM_SENDER_ID', '574597432927')

  .constant('API_URL', 'http://dwellingspelling.corp.ne1.yahoo.com:3000/mobile');

