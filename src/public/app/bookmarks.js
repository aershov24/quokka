/**
 * bookmarks.js
 */
(function () {
    'use strict';
    var app= angular.module('quokka');	
	app.controller('bookmarksController', function($scope, $http) {
		$scope.bookmarks = {};
		// when landing on the page, get all todos and show them
		$http.get('/users/profile')
			.success(function(data) {
				$scope.profile = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	   // when landing on the page, get all todos and show them
		$http.get('/bookmarks')
			.success(function(data) {
				$scope.bookmarks = data;
				var i, j;
				for (var i = 0; i < $scope.bookmarks.length; ++i) {
					$scope.bookmarks[i].listId.ngTags = [];
					for (var j = 0; j < $scope.bookmarks[i].listId.tags.length; ++j) {
						$scope.bookmarks[i].listId.ngTags.push({'text': $scope.bookmarks[i].listId.tags[j]});
					}
				}
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});

			 // when submitting the add form, send the text to the node API
		$scope.deleteBookmark = function(id) {
			$http.delete('/bookmarks/'+id)
				.success(function(data) {
					  $.each($scope.bookmarks, function (i) {
						if ($scope.bookmarks[i]._id === id) {
							$scope.bookmarks.splice(i, 1);
							return false;
						}
					});
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		};
	});
}());