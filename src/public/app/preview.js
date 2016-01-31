/**
 * preview.js
 */
(function () {
    'use strict';
    var app= angular.module('quokka');  
  app.controller('previewController', function($scope, $http, $window) {
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
      if (version.length != 0)
        imageUrl = imageUrl.replace(version, "w_700,h_400,c_scale");
      return imageUrl;
    };

    $scope.tagNameClicked = function(tag) {
      $window.location.href = '/search/tag/'+tag;
    };

    $scope.getThumbnails = function(imageUrl, width) {
      var version = imageUrl.substring(imageUrl.indexOf("upload/") + 7);
      version = version.substring(0, version.indexOf("/"));
      if (version.length != 0)
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