/**
 * app.js
 */
 
(function () {
    'use strict';
    angular.module('quokka', ['NgSwitchery','ngTagsInput', 'ng-sortable', 'locator', 'ngMap', 'ngFileUpload', 'angular-growl', 'autoGrow', 'nsPopover'])
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
  .directive('inlineTitleEdit', function($timeout) {
    return {
      scope: {
        model: '=inlineTitleEdit',
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
        scope.isEmpty = function (str) {
            return (!str || 0 === str.length);
        }
      },
      templateUrl: './templates/inline-title-edit.html'
    };
  })
  .directive('inlineDescriptionEdit', function($timeout) {
    return {
      scope: {
        model: '=inlineDescriptionEdit',
        handleSave: '&onSave',
        handleCancel: '&onCancel'
      },
      link: function(scope, elm, attr) {
        var previousValue;
        
        scope.edit = function() {
          scope.editMode = true;
          previousValue = scope.model;
          
          $timeout(function() {
            elm.find('textarea')[0].focus();
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
        scope.isEmpty = function (str) {
            return (!str || 0 === str.length);
        }
      },
      templateUrl: './templates/inline-description-edit.html'
    };
  })
  .directive("progressbar", function () {
    return {
        restrict: "A",
        scope: {
            total: "=",
            current: "="
        },
        link: function (scope, element) {
            scope.$watch("current", function (value) {
                element.css("width", scope.current / scope.total * 100 + "%");
            });
            scope.$watch("total", function (value) {
                element.css("width", scope.current / scope.total * 100 + "%");
            })
        }
    };
  })
  .directive('xngClearable', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        compile: function(tElement) {

            // Add css class to input
            tElement.addClass('xng-clearable');

            // Class name for clear button
            var clearClass = 'clear_button';

            // Add clear button DOM element
            tElement.after('<a tabindex="-1" class="' + clearClass + '">&times;</a>');
            var btn = tElement.next();
            btn.css('font-size', Math.round(tElement.prop('offsetHeight') * 0.8) + 'px');

            return function(scope, iElement, iAttrs) {

                if (iElement[0].tagName === 'INPUT') {
                    var text = angular.element(iElement[0]);

                    btn.bind('mousedown', function(e) {
                        text.val('');
                        text.triggerHandler('input');
                        e.preventDefault();
                    });

                    scope.$watch(iAttrs.ngModel, function(v) {
                        if (v && v.length > 0) {
                            btn.css('display', 'block');
                        } else {
                            btn.css('display', 'none');
                        }
                    });
                }
            };

        }
    };
  })
})();