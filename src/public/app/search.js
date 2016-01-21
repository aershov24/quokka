/**
 * search.js
 */
(function () {
    'use strict';
    var app= angular.module('quokka');  
    app.controller('searchController', ['$scope', '$http', '$timeout', 'growl', function($scope, $http, $timeout, growl) {
        $scope.formData = {};
        $scope.lists = {};
        $scope.searchTags = [];
        $scope.bookSuccess = false;
        $scope.bookError = false;

        $scope.searchTag = null;  
        $scope.init = function(tag, searchStr) {
          if (tag){
            $scope.searchTags.push({text: tag});
            $scope.tagAdded({text: tag});
          }
          if (searchStr){
            $scope.formData.str = searchStr;
             $http.post('/lists/search/name', {str: searchStr})
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

        $scope.getThumbnails = function(imageUrl, width) {
          var version = imageUrl.substring(imageUrl.indexOf("upload/") + 7);
          version = version.substring(0, version.indexOf("/"));
          console.log(version);
          imageUrl = imageUrl.replace(version, "w_"+width);
          return imageUrl;
        };

        // when submitting the add form, send the text to the node API
        $scope.searchList = function(searchStr) {
          $scope.formData.str = searchStr;
          if (searchStr){
          $scope.formData.str = searchStr;
           $http.post('/lists/search/name', {str: searchStr})
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

        // when landing on the page, get all todos and show them
        $http.get('/users/profile')
            .success(function(data) {
                $scope.profile = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

        // when submitting the add form, send the text to the node API
        $scope.searchListKey = function() {
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
                  growl.success('The bookmark added.',{title: 'Success!', ttl: 2000});
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    growl.error('An error has occured while adding bookmark.',{title: 'Error!', ttl: 2000});
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