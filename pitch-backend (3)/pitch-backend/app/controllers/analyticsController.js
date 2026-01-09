angular.module('pitchBookingApp')
.controller('AnalyticsController', ['$scope', 'AnalyticsService', 
function($scope, AnalyticsService) {
    $scope.loading = true;
    $scope.avgPriceData = [];
    $scope.topRatedData = [];
    
    AnalyticsService.getAvgPriceByGround()
        .then(function(response) {
            $scope.avgPriceData = response.data;
        })
        .catch(function(error) {
            console.error('Error loading price analytics:', error);
        });
    
    AnalyticsService.getTopRated()
        .then(function(response) {
            $scope.topRatedData = response.data;
            $scope.loading = false;
        })
        .catch(function(error) {
            console.error('Error loading top rated pitches:', error);
            $scope.loading = false;
        });
    
    $scope.getRatingArray = function(rating) {
        return new Array(Math.floor(rating || 0));
    };
}]);
