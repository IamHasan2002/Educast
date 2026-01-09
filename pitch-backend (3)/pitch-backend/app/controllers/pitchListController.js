angular.module('pitchBookingApp')
.controller('PitchListController', ['$scope', 'PitchService', function($scope, PitchService) {
    $scope.pitches = [];
    $scope.loading = true;
    $scope.filters = {
        page: 1,
        limit: 12
    };
    
    $scope.statusOptions = ['Open', 'Closed', 'Under Maintenance'];
    $scope.groundTypeOptions = ['Grass', 'Artificial Turf', 'Clay'];
    $scope.environmentOptions = ['Indoor', 'Outdoor'];
    
    $scope.loadPitches = function() {
        $scope.loading = true;
        
        var filters = {};
        Object.keys($scope.filters).forEach(function(key) {
            if ($scope.filters[key]) {
                filters[key] = $scope.filters[key];
            }
        });
        
        PitchService.getPitches(filters)
            .then(function(response) {
                $scope.pitches = response.data.pitches || response.data;
                $scope.total = response.data.total || $scope.pitches.length;
                $scope.loading = false;
            })
            .catch(function(error) {
                console.error('Error loading pitches:', error);
                $scope.error = 'Failed to load pitches';
                $scope.loading = false;
            });
    };
    
    $scope.clearFilters = function() {
        $scope.filters = { page: 1, limit: 12 };
        $scope.loadPitches();
    };
    
    $scope.getRatingArray = function(rating) {
        return new Array(Math.floor(rating || 0));
    };
    
    $scope.loadPitches();
}]);
