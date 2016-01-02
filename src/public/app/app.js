/**
 * app.js
 */
 
(function () {
    'use strict';
     angular.module('quokka', ['ngTagsInput', 'ng-sortable', 'locator', 'ngMap', 'ngFileUpload'])
	 .directive('loading', ['$http', function ($http) {
		return {
		  restrict: 'A',
		  link: function (scope, element, attrs) {
			scope.isLoading = function () {
			  return $http.pendingRequests.length > 0;
			};
			scope.$watch(scope.isLoading, function (value) {
			  if (value) {
				element.removeClass('ng-hide');
			  } else {
				element.addClass('ng-hide');
			  }
			});
		  }
		};
	}])
	.directive('myModal', function() {
			return {
				restrict: 'A',
				link: function(scope, element, attr) {
					scope.dismiss = function() {
					element.modal('hide');
					scope.editList = {};
					scope.formData = {};
					scope.editListItem = {};
					scope.lookedUpLocation = {};
				};
			}
		} 
	});
})();