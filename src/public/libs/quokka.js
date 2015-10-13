angular.module('quokka', ['ngTagsInput', 'ng-sortable']).controller('quokkaController', function($scope, $http) {
	$scope.tags = [
            { text: 'just' },
            { text: 'some' },
            { text: 'cool' },
            { text: 'tags' }
          ];
		  
    $scope.formData = {};

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
        $scope.loading = true;
        var editList = this.list;
        $http.put('/lists/' + frien._id, editList).success(function (data) {
            frien.editMode = false;
        }).error(function (data) {
            $scope.error = "An Error has occured while Saving list! " + data;
        });
    };

    // delete a todo after checking it
    $scope.deleteList = function(id) {
        $http.delete('/lists/' + id)
            .success(function(data) {
                $scope.lists = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
}
);