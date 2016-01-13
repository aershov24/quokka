/**
 * search.js
 */
(function () {
    'use strict';
    var app= angular.module('quokka');  
    app.controller('searchController', function($scope, $http) {
        $scope.formData = {};
        $scope.lists = {};
        $scope.searchTags = [];

        $scope.searchTag = null;  
        $scope.init = function(tag) {
          if (tag){
            $scope.searchTags.push({text: tag});
            $scope.tagAdded({text: tag});
          }
        }

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
                })
                .error(function(data) {
                    console.log('Error: ' + data);
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
    });
}());