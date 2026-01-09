angular.module('pitchBookingApp')
.controller('AddPitchController', ['$scope', '$location', 'PitchService', 
function($scope, $location, PitchService) {
    $scope.pitch = {
        location: {}
    };
    
    $scope.statusOptions = ['Open', 'Closed', 'Under Maintenance'];
    $scope.groundTypeOptions = ['Grass', 'Artificial Turf', 'Clay'];
    $scope.environmentOptions = ['Indoor', 'Outdoor'];
    $scope.bowlingMachineOptions = ['available', 'not available', 'chargable'];
    
    $scope.submitPitch = function() {
        $scope.loading = true;
        $scope.error = '';
        
        var pitchData = {
            Pitch: $scope.pitch.Pitch,
            Ground: $scope.pitch.Ground,
            location: {
                latitude: parseFloat($scope.pitch.location.latitude),
                longitude: parseFloat($scope.pitch.location.longitude)
            },
            PitchPrice: parseInt($scope.pitch.PitchPrice),
            Status: $scope.pitch.Status,
            GroundType: $scope.pitch.GroundType,
            Environment: $scope.pitch.Environment,
            'Bowling Machine': $scope.pitch.BowlingMachine
        };
        
        PitchService.createPitch(pitchData)
            .then(function(response) {
                $location.path('/pitches/' + response.data._id);
            })
            .catch(function(error) {
                console.error('Error creating pitch:', error);
                $scope.error = error.data.message || 'Failed to create pitch';
                $scope.loading = false;
            });
    };
}]);
