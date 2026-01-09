angular.module('pitchBookingApp')
.controller('HomeController', ['$scope', 'PitchService', function($scope, PitchService) {
    $scope.loading = true;
    $scope.featuredPitches = [];
    
    PitchService.getPitches({ limit: 6, sort: 'PitchPrice', dir: 'asc' })
        .then(function(response) {
            $scope.featuredPitches = response.data.pitches || response.data;
            $scope.loading = false;
        })
        .catch(function(error) {
            console.error('Error loading pitches:', error);
            $scope.error = 'Failed to load pitches';
            $scope.loading = false;
        });
}]);
