'use strict';

var services = angular.module('guthub.services', [ 'ngResource' ]);

services.factory('Recipe', [ '$resource', function($resource) {
    return $resource('/recipes/:id', {
        id : '@id'
    });
} ]);

services.factory('MultiRecipeLoader', [ 'Recipe', '$q', function(Recipe, $q) {
    return function() {
        var delay = $q.defer();
        Recipe.query(function(recipes) {
            delay.resolve(recipes);
        }, function() {
            delay.reject('레시피를 가져올 수 없습니다');
        });
        return delay.promise;
    };
} ]);

services.factory('RecipeLoader', [ 'Recipe', '$route', '$q', function(Recipe, $route, $q) {
        return function() {
            var delay = $q.defer();
            Recipe.get({ id : $route.current.params.recipeId }, function(recipe) {
                delay.resolve(recipe);
            }, function() {
                delay.reject($route.current.params.recipeId
                    + '의 레시피를 가져올 수 없습니다');
            });
            return delay.promise;
        };
    }
]);
