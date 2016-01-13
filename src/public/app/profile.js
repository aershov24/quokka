/**
 * profile.js
 */
(function () {
    'use strict';
    var app= angular.module('quokka');  
    app.controller('profileController', function($scope, $http) {
        $scope.profile = {};
        // when landing on the page, get all todos and show them
        $http.get('/users/profile')
            .success(function(data) {
                $scope.profile = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

        $scope.init = function(user) {
            if (user){
                $scope.user = user;
            }
        }
    });
}());