angular.module('quokka', ['ngTagsInput', 'ng-sortable']).controller('quokkaController', function($scope, $http) {
    $scope.formData = {};
	$scope.newListItem = {};

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
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.lists.push(data);
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
	
	//by pressing toggleEdit button ng-click in html, this method will be hit
    $scope.toggleEdit = function () {
        this.list.editMode = !this.list.editMode;
    };
	
	//Edit top5list
    $scope.saveList = function () {
        var editList = this.list;
        $http.post('/lists/' + editList._id, editList).success(function (data) {
            editList.editMode = false;
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
);