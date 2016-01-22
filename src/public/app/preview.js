/**
 * preview.js
 */
(function () {
    'use strict';
    var app= angular.module('quokka');  
  app.controller('previewController', function($scope, $http) {
    $scope.profile = {};
    $scope.list = {};

    $scope.init = function(list) {
        if (list){
            $scope.list = list;
        }
    }

    $scope.getPreviewImage = function(imageUrl) {
      var version = imageUrl.substring(imageUrl.indexOf("upload/") + 7);
      version = version.substring(0, version.indexOf("/"));
      console.log(version);
      imageUrl = imageUrl.replace(version, "w_700");
      return imageUrl;
    };

    $scope.getThumbnails = function(imageUrl, width) {
      var version = imageUrl.substring(imageUrl.indexOf("upload/") + 7);
      version = version.substring(0, version.indexOf("/"));
      console.log(version);
      imageUrl = imageUrl.replace(version, "w_"+width);
      return imageUrl;
    };
        
    // when landing on the page, get all todos and show them
    $http.get('/users/profile')
      .success(function(data) {
        $scope.profile = data;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    });
}());