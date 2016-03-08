var app = angular.module('app', ['ngRoute', 'ngResource', 'ui.bootstrap'])

        .config(['$routeProvider', function ($routeProvider) {
          $routeProvider
            .when('/properties', {
              templateUrl: '/properties.jade',
              controller: 'PropertyController'
            })
    
            .when('/properties/:id', {
              templateUrl: '/PropertyDetailsController.html',
              controller: 'PropertyDetailsController'
           });
        }])

        .factory('properties', ['$resource', function($resource){
          return $resource('/properties/:id', null, {
            'update': { method:'PUT' }
          });
        }])

        .controller('PropertyController', ['$scope', 'properties', function ($scope, properties) {
          $scope.properties = properties.query();
    
          $scope.save = function(){
            properties.$save(function(property){
              $scope.properties.push(property);
              $scope.newProperty = ''; 
            });
          };
          $scope.update = function(index){
            var property = $scope.properties[index];
            properties.update({id: property._id}, property);
            $scope.editing[index] = false;
          };
    
          $scope.edit = function(index){
            $scope.editing[index] = angular.copy($scope.properties[index]);
          };
    
          $scope.cancel = function(index){
            $scope.properties[index] = angular.copy($scope.editing[index]);
            $scope.editing[index] = false;
          };
          
          $scope.remove = function(index){
            var property = $scope.todos[index];
            properties.remove({id: property._id}, function(){
              $scope.properties.splice(index, 1);
            });
          };
        }])
        
        .controller('PropertyDetailsController', ['$scope', '$routeParams', 'properties', '$location', function ($scope, $routeParams, properties, $location) {
          $scope.property = properties.get({id: $routeParams.id });
    
          $scope.update = function(){
            properties.update({id: $scope.property._id}, $scope.property, function(){
              $location.url('/');
            });
          };
        }])