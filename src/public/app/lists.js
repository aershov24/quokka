/**
 * lists.js
 */
(function () {
    'use strict';
    var app= angular.module('quokka');	
	app.controller('quokkaController', ['$scope', '$http', 'location','Upload', function($scope, $http, location, Upload) {
		$scope.selected = 'first';
		location.get(angular.noop, angular.noop);
		$scope.lookedUpLocation = { name: '', latitude: 0, longitude: 0};
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

		$scope.file = null;
		// upload on file select or drop
		$scope.upload = function (file) {
			$scope.file = file;
			$scope.editList.image = null;
		};

		$scope.removeImage = function (editList) {
			if ($scope.file)
			  $scope.file = null;
			// remove image on server
			$http.delete('/lists/'+editList._id+'/image/'+editList.imageId)
			.success(function(data) {
			  editList.image = null;
			  editList.imageId = null;
			  for (var i = 0; i < $scope.lists.length; ++i) {
				if ($scope.lists[i]._id === editList._id){
				  $scope.lists[i].image = null;
				  $scope.lists[i].imageId = null;
				}
			  }
			})
			.error(function(data) {
			  console.log('Error: ' + data);
			});
		};
	  
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
			$scope.file = null;
			$scope.editList._id = this.list._id;
			$scope.editList.title = this.list.title;
			$scope.editList.description = this.list.description;
			$scope.editList.image = this.list.image;
			$scope.editList.imageId = this.list.imageId;
		};

		//by pressing toggleEdit button ng-click in html, this method will be hit
		$scope.openEditListItem = function () {
			$scope.editListItem._id = this.item._id;
			$scope.editListItem.listId = this.item.listId;
			$scope.editListItem.title = this.item.title;
			$scope.editListItem.description = this.item.description;
			$scope.editListItem.url = this.item.url;
			$scope.editListItem.locationName = this.item.locationName;
			$scope.lookedUpLocation.name = this.item.locationName;
			$scope.results = {};    
			$scope.lookedUpLocation.latitude = this.item.location[1];
			$scope.lookedUpLocation.longitude = this.item.location[0];
			$(".inputLocation").val("");
			$(".ulLocation").empty();
			$('a[data-toggle="tab"]:first').tab('show');
		};

		$scope.clearLocation = function (item) {
			$scope.lookedUpLocation={}; 
			item.locationName = ""; 
			item.location = [0, 0]; 
			$scope.lookedUpLocation.latitude=0; 
			$scope.lookedUpLocation.longitude=0;
		};

		//by pressing toggleEdit button ng-click in html, this method will be hit
		$scope.openAddList = function () {
			$scope.formData.title = "";
			$scope.formData.description = "";
		};
	  
	  //Edit top5list
		$scope.saveList = function () {
			for (var i = 0; i < $scope.lists.length; ++i) {
				if ($scope.lists[i]._id === $scope.editList._id) {
					$scope.lists[i].title = $scope.editList.title;
					$scope.lists[i].description = $scope.editList.description;
				}
			}
			var editList = $scope.editList;
			$http.post('/lists/' + editList._id, editList).success(function (data) {
                if ($scope.file){
                 Upload.upload({
					url: '/lists/'+ editList._id+'/upload',
					data: {file: $scope.file}
				}).then(function (resp) {
					console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
					for (i = 0; i < $scope.lists.length; ++i) {
						if ($scope.lists[i]._id === editList._id) {
							$scope.lists[i].image = resp.data.image;
							$scope.lists[i].imageId = resp.data.imageId;
						}
					}
					editList.image = resp.data.image;
					editList.imageId = resp.data.imageId;
                    $scope.file = null;
				}, function (resp) {
					console.log('Error status: ' + resp.status);
				}, function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
				});
                }

				$scope.editList = {};
				$scope.editListForm.$setPristine();
				$scope.dismiss();
			}).error(function (data) {
				$scope.error = "An Error has occured while Saving list! " + data;
			});

		 
		};

		$scope.saveListItem = function () {
			if ($scope.lookedUpLocation.longitude != 0 && $scope.lookedUpLocation.latitude != 0)
			{
				$scope.editListItem.locationName = $scope.lookedUpLocation.name;
				$scope.editListItem.location = [$scope.lookedUpLocation.longitude, $scope.lookedUpLocation.latitude];
			}

			var editListItem = $scope.editListItem;
			$http.post('/lists/' + editListItem.listId+'/items/'+editListItem._id, editListItem).success(function (data) {
				var i, j;
				for (var i = 0; i < $scope.lists.length; ++i) {
					for (var j = 0; j < $scope.lists[i].items.length; ++j) {
						if ($scope.lists[i].items[j]._id === editListItem._id)
						{
							$scope.lists[i].items[j].title = editListItem.title;
							$scope.lists[i].items[j].description = editListItem.description;
							$scope.lists[i].items[j].url = editListItem.url;
							$scope.lists[i].items[j].location = editListItem.location;
							$scope.lists[i].items[j].locationName = editListItem.locationName;
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
			//$scope.newListItem.location = '[0, 0]';
		$scope.newListItem.description = '';
			$scope.newListItem.url = '';
			$scope.newListItem.locationName = '';
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
				this.list.ngTags[i].text = this.list.ngTags[i].text.toLowerCase();
				tags.push(this.list.ngTags[i].text.toLowerCase());
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
	}]);
}());