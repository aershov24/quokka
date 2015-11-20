angular.module('quokka', ['ngTagsInput', 'ng-sortable'])
.controller('bookmarksController', function($scope, $http) {
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
            for (i = 0; i < $scope.bookmarks.length; ++i) {
                $scope.bookmarks[i].listId.ngTags = [];
                for (j = 0; j < $scope.bookmarks[i].listId.tags.length; ++j) {
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
})
.controller('profileController', function($scope, $http) {
    $scope.profile = {};
    // when landing on the page, get all todos and show them
    $http.get('/users/profile')
        .success(function(data) {
            $scope.profile = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
})
.controller('loginController', function($scope, $http) {
})
.controller('searchController', function($scope, $http) {
    $scope.formData = {};
    $scope.lists = {};
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

})
.controller('quokkaController', function($scope, $http) {

    $scope.editList = {};
    $scope.editListItem = {};
    $scope.formData = {};
	$scope.newListItem = {};
    $scope.sortConfig = {
            animation: 150,
            handle: ".my-handle",
            // Changed sorting within list
            // Called by any change to the list (add / update / remove)
            onSort: function (evt) {
                var i;
                $http.post('/lists/'+evt.model.listId+'/sortItems', { oldIndex: evt.oldIndex, newIndex: evt.newIndex })
                   .success(function(data) {
                       console.log(data);
                   })
                   .error(function(data) {
                       console.log('Error: ' + data);
                   });
            },
        };
	
	// when landing on the page, get all todos and show them
    $http.get('/users/profile')
        .success(function(data) {
            $scope.profile = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
	
    // when landing on the page, get all todos and show them
    $http.get('/lists')
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

    // when submitting the add form, send the text to the node API
    $scope.createList = function() {
        $http.post('/lists', $scope.formData)
            .success(function(data) {
                $scope.lists.splice(0, 0, data);
                $scope.lists[0].ngTags = [];
                $scope.lists[0].editMode = false;
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.addListForm.$setPristine();
                $scope.dismiss();
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // when submitting the add form, send the text to the node API
    $scope.closeList = function() {
        $scope.formData = {};
        $scope.editList = {};
        $scope.addListForm.$setPristine();
        $scope.editListForm.$setPristine();
        $scope.dismiss();
    };

    // when submitting the add form, send the text to the node API
    $scope.closeListItem = function() {
        $scope.editListItem = {};
        $scope.editListItemForm.$setPristine();
        $scope.dismiss();
    };
	
	//by pressing toggleEdit button ng-click in html, this method will be hit
    $scope.toggleEdit = function () {
        this.list.editMode = !this.list.editMode;
    };

    //by pressing toggleEdit button ng-click in html, this method will be hit
    $scope.openEditList = function () {
        $scope.editList._id = this.list._id;
        $scope.editList.title = this.list.title;
        $scope.editList.description = this.list.description;
    };

    //by pressing toggleEdit button ng-click in html, this method will be hit
    $scope.openEditListItem = function () {
        $scope.editListItem._id = this.item._id;
        $scope.editListItem.listId = this.item.listId;
        $scope.editListItem.title = this.item.title;
        $scope.editListItem.description = this.item.description;
        $scope.editListItem.url = this.item.url;
    };

    //by pressing toggleEdit button ng-click in html, this method will be hit
    $scope.openAddList = function () {
        $scope.formData.title = "";
        $scope.formData.description = "";
    };
	
	//Edit top5list
    $scope.saveList = function () {
        for (i = 0; i < $scope.lists.length; ++i) {
            if ($scope.lists[i]._id === $scope.editList._id) {
                $scope.lists[i].title = $scope.editList.title;
                $scope.lists[i].description = $scope.editList.description;
            }
        }
        var editList = $scope.editList;
        $http.post('/lists/' + editList._id, editList).success(function (data) {
            $scope.editList = {};
            $scope.editListForm.$setPristine();
            $scope.dismiss();
        }).error(function (data) {
            $scope.error = "An Error has occured while Saving list! " + data;
        });
    };

    $scope.saveListItem = function () {
        var editListItem = $scope.editListItem;
        $http.post('/lists/' + editListItem.listId+'/items/'+editListItem._id, editListItem).success(function (data) {
            var i, j;
            for (i = 0; i < $scope.lists.length; ++i) {
                for (j = 0; j < $scope.lists[i].items.length; ++j) {
                    if ($scope.lists[i].items[j]._id === editListItem._id)
                    {
                        $scope.lists[i].items[j].title = editListItem.title;
                        $scope.lists[i].items[j].description = editListItem.description;
                        $scope.lists[i].items[j].url = editListItem.url;
                    }
                }
            }
            $scope.editListItem = {};
            $scope.editListItemForm.$setPristine();
            $scope.dismiss();
        }).error(function (data) {
            $scope.error = "An Error has occured while Saving list! " + data;
        });
    };

   // delete a todo after checking it
    $scope.deleteList = function(id) {
        $http.delete('/lists/' + id)
            .success(function(data) {
                 $.each($scope.lists, function (i) {
                    if ($scope.lists[i]._id === id) {
                        $scope.lists.splice(i, 1);
                        return false;
                    }
                });
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
	
	// when submitting the add form, send the text to the node API
    $scope.createListItem = function() {
		var buf = this.list;
        $scope.newListItem.listId = buf._id;
        $scope.newListItem.orderId = buf.items.length;
        $http.post('/lists/'+this.list._id+'/items/', $scope.newListItem)
            .success(function(data) {
                $scope.newListItem = {};
                buf.items = data;
				return false;
            })
            .error(function(data) {
                return false;
            });
    };
	
    $scope.deleteListItem = function(id) {
		var buf = this.list;
        $http.delete('/lists/' + this.list._id+'/items/'+id)
            .success(function(data) {
                 $.each(buf.items, function (i) {
                    if (buf.items[i]._id === id) {
                        buf.items.splice(i, 1);
                        return false;
                    }
                });
            })
            .error(function(data) {
                return false;
            });
    };
	
	$scope.tagAdded = function (tag) {
		var i = 0;
		var tags = [];
		for (i = 0; i < this.list.ngTags.length; ++i) {
            tags.push(this.list.ngTags[i].text);
		}
        $http.post('/lists/'+ this.list._id+'/tags', { tags: tags }).success(function (data) {

        }).error(function (data) {
            $scope.error = "An Error has occured while Saving tag! " + data;
        });
    };

    $scope.tagRemoved = function (tag) {
		var i = 0;
		var tags = [];
		for (i = 0; i < this.list.ngTags.length; ++i) {
            tags.push(this.list.ngTags[i].text);
		}
        $http.post('/lists/'+ this.list._id+'/tags', { tags: tags }).success(function (data) {

        }).error(function (data) {
            $scope.error = "An Error has occured while Saving tag! " + data;
        });
    };
}
)
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
            };
        }
    } 
    });
;