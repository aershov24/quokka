/**
 * login.js
 */
(function () {
    'use strict';
    var app= angular.module('quokka');	
	app.controller('loginController', function($scope, $http) {
    // when landing on the page, get 3 random list
    $http.get('/lists/random')
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
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
	});
}());