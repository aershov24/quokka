/**
 * profile.js
 */
(function () {
    'use strict';
    var app= angular.module('quokka');  
    app.controller('profileController', function($scope, $http) {
        $scope.profile = {};
        $scope.currentPage = 0;
        // when landing on the page, get all todos and show them
        $http.get('/users/profile')
            .success(function(data) {
                $scope.profile = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

        $scope.getThumbnails = function(imageUrl, width) {
          var version = imageUrl.substring(imageUrl.indexOf("upload/") + 7);
          version = version.substring(0, version.indexOf("/"));
          //console.log(version);
          if (version.length != 0)
            imageUrl = imageUrl.replace(version, "w_"+width);
          return imageUrl;
        };

        $scope.init = function(user) {
          if (user){
              $scope.user = user;
              $http.post('/lists/search/user', { userId: user._id, pg: $scope.currentPage })
                .success(function(data) {
                    $scope.lists = data;
                    var i, j;
                    for (i = 0; i < $scope.lists.length; ++i) {
                        $scope.lists[i].ngTags = [];
                        $scope.lists[i].editMode = false;
                        for (j = 0; j < $scope.lists[i].tags.length; ++j) {
                            $scope.lists[i].ngTags.push({'text': $scope.lists[i].tags[j]});
                        }
                    }
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
          }
        }
    });
}());