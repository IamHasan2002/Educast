angular.module('pitchBookingApp')
.controller('LoginController', ['$scope', '$location', '$rootScope', 'AuthService', 
function($scope, $location, $rootScope, AuthService) {
    $scope.credentials = {};
    $scope.error = '';
    
    $scope.login = function() {
        $scope.loading = true;
        $scope.error = '';
        
        AuthService.login($scope.credentials)
            .then(function(response) {
                $rootScope.currentUser = response.data.user;
                $location.path('/pitches');
            })
            .catch(function(error) {
                $scope.error = error.data.message || 'Login failed';
                $scope.loading = false;
            });
    };
}]);
