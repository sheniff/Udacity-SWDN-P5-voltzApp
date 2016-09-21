'use strict';

angular
  .module('voltz.controllers.chat', [])
  .controller('ChatDetailCtrl', ['$scope', '$stateParams', 'Chats',
    function ChatDetailCtrl($scope, $stateParams, Chats){
      $scope.chat = Chats.get($stateParams.chatId);
    }
  ]);
