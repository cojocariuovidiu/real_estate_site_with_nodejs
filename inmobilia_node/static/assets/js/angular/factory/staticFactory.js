angular.module('app', ['ngRoute'])

    .factory('propertyTypes', function(){
        return ['House', 'Apartment', 'Building', 'Duplex', 'Clubs', 'Haciendas', 'Fincas', 'Commercial', 'Industrials', 'Offices', 'Lands', 'Room'];
      /*return [
        { name: 'AngularJS Directives', completed: true },
        { name: 'Data binding', completed: true },
        { name: '$scope', completed: true },
        { name: 'Controllers and Modules', completed: true },
        { name: 'Templates and routes', completed: true },
        { name: 'Filters and Services', completed: false },
        { name: 'Get started with Node/ExpressJS', completed: false },
        { name: 'Setup MongoDB database', completed: false },
        { name: 'Be awesome!', completed: false },
      ];*/
    })
    
    .factory('operationTypes', function(){
        return ['Venta', 'Alquiler', 'Pre-venta'];     
    })
    
    .factory('tags', function(){
        return ['Nuevo', 'Destacado', 'Negociable'];     
    })
    .controller('Controller', ['$scope', 'Todos', function ($scope, Todos) {
      $scope.todos = Todos;
    }]);
