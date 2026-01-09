angular.module('pitchBookingApp')
.service('AuthService', ['$http', '$window', 'API_URL', function($http, $window, API_URL) {
    this.register = function(userData) {
        return $http.post(API_URL + '/auth/register', userData);
    };
    
    this.login = function(credentials) {
        return $http.post(API_URL + '/auth/login', credentials)
            .then(function(response) {
                if (response.data.token) {
                    $window.localStorage.setItem('token', response.data.token);
                    $window.localStorage.setItem('user', JSON.stringify(response.data.user));
                }
                return response;
            });
    };
    
    this.logout = function() {
        $window.localStorage.removeItem('token');
        $window.localStorage.removeItem('user');
    };
    
    this.getToken = function() {
        return $window.localStorage.getItem('token');
    };
    
    this.isAuthenticated = function() {
        return this.getToken() !== null;
    };
    
    this.getCurrentUser = function() {
        var user = $window.localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    };
    
    this.getAuthHeader = function() {
        return {
            headers: {
                'Authorization': 'Bearer ' + this.getToken()
            }
        };
    };
}]);
