angular.module('pitchBookingApp')
.controller('MainController', ['$scope', '$rootScope', 'AuthService', 
function($scope, $rootScope, AuthService) {
    $scope.isAuthenticated = AuthService.isAuthenticated;
    $scope.currentUser = AuthService.getCurrentUser();
    
    $scope.logout = function() {
        AuthService.logout();
        $rootScope.currentUser = null;
        window.location.href = '#!home';
    };
}]);
