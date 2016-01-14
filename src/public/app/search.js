/**
 * search.js
 */
(function () {
    'use strict';
    var app= angular.module('quokka');  
    app.controller('searchController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
        $scope.formData = {};
        $scope.lists = {};
        $scope.searchTags = [];
        $scope.bookSuccess = false;
        $scope.bookError = false;

        $scope.searchTag = null;  
        $scope.init = function(tag) {
          if (tag){
            $scope.searchTags.push({text: tag});
            $scope.tagAdded({text: tag});
          }
        }

        $scope.showBookError = function(error){
          //reset
          $scope.bookError = false;
          $scope.bookError = true;
          $scope.errorMessage = error;
          $timeout(function(){
            $scope.bookError = false;
          }, 2500);
        };

        $scope.showBookSuccess = function(){
          //reset
          $scope.bookSuccess = false;
          $scope.bookSuccess = true;
          $timeout(function(){
            $scope.bookSuccess = false;
          }, 2500);
        };

        // when landing on the page, get all todos and show them
        $http.get('/users/profile')
            .success(function(data) {
                $scope.profile = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

        // when submitting the add form, send the text to the node API
        $scope.searchList = function() {
            if ($scope.formData.str){
                $http.post('/lists/search/name', $scope.formData)
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
        };

         // when submitting the add form, send the text to the node API
        $scope.addBookmark = function() {
            $http.post('/bookmarks', { listId: this.list._id, userId: this.list.userId._id })
                .success(function(data) {
                  $scope.showBookSuccess();
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    $scope.showBookError(data);
                });
        };

        $scope.tagAdded = function (tag) {
            var i = 0;
            var tags = [];
            for (i = 0; i < $scope.searchTags.length; ++i) {
                $scope.searchTags[i].text = $scope.searchTags[i].text.toLowerCase();
                tags.push($scope.searchTags[i].text.toLowerCase());
            }

            $http.post('/lists/search/tags', { tags: tags} )
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
        };

        $scope.tagRemoved = function (tag) {
            var i = 0;
            var tags = [];
            for (i = 0; i < $scope.searchTags.length; ++i) {
                tags.push($scope.searchTags[i].text.toLowerCase());
            }

            $http.post('/lists/search/tags', { tags: tags} )
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
        };
    }]);
}());