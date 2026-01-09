angular.module('pitchBookingApp', ['ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegisterController'
        })
        .when('/pitches', {
            templateUrl: 'views/pitch-list.html',
            controller: 'PitchListController'
        })
        .when('/pitches/:id', {
            templateUrl: 'views/pitch-detail.html',
            controller: 'PitchDetailController'
        })
        .when('/add-pitch', {
            templateUrl: 'views/add-pitch.html',
            controller: 'AddPitchController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/login');
                    }
                }
            }
        })
        .when('/analytics', {
            templateUrl: 'views/analytics.html',
            controller: 'AnalyticsController'
        })
        .otherwise({
            redirectTo: '/home'
        });
}])

.constant('API_URL', 'http://localhost:5001/api')

.run(['$rootScope', 'AuthService', function($rootScope, AuthService) {
    $rootScope.isAuthenticated = function() {
        return AuthService.isAuthenticated();
    };
    
    $rootScope.currentUser = AuthService.getCurrentUser();
    
    $rootScope.logout = function() {
        AuthService.logout();
        $rootScope.currentUser = null;
        window.location.href = '#!home';
    };
}]);
