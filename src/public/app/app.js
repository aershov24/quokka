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
	})
  .directive('inlineEdit', function($timeout) {
    return {
      scope: {
        model: '=inlineEdit',
        handleSave: '&onSave',
        handleCancel: '&onCancel'
      },
      link: function(scope, elm, attr) {
        var previousValue;
        
        scope.edit = function() {
          scope.editMode = true;
          previousValue = scope.model;
          
          $timeout(function() {
            elm.find('input')[0].focus();
          }, 0, false);
        };
        scope.save = function() {
          scope.editMode = false;
          scope.handleSave({value: scope.model});
        };
        scope.cancel = function() {
          scope.editMode = false;
          scope.model = previousValue;
          scope.handleCancel({value: scope.model});
        };
      },
      templateUrl: './templates/inline-edit.html'
    };
  });
})();