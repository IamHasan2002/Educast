angular.module('pitchBookingApp')
.controller('RegisterController', ['$scope', '$location', 'AuthService', 
function($scope, $location, AuthService) {
    $scope.user = {};
    $scope.error = '';
    
    $scope.register = function() {
        $scope.loading = true;
        $scope.error = '';
        
        if ($scope.user.password !== $scope.user.confirmPassword) {
            $scope.error = 'Passwords do not match';
            $scope.loading = false;
            return;
        }
        
        AuthService.register($scope.user)
            .then(function(response) {
                $location.path('/login');
            })
            .catch(function(error) {
                $scope.error = error.data.message || 'Registration failed';
                $scope.loading = false;
            });
    };
}]);
