# Setup All Frontend Files
Write-Host "Setting up Pitch Booking Frontend Files..." -ForegroundColor Green

# CSS Files
Write-Host "`nCreating CSS files..." -ForegroundColor Cyan

$cssContent = @'
body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.container-fluid {
    flex: 1;
}

.pitch-card {
    transition: transform 0.2s;
    height: 100%;
}

.pitch-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.badge-status {
    font-size: 0.85rem;
}

.filter-section {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.rating {
    color: #ffc107;
}

.price-tag {
    font-size: 1.5rem;
    font-weight: bold;
    color: #28a745;
}

.review-item {
    border-left: 3px solid #007bff;
    padding-left: 15px;
}

.stat-card {
    border-left: 4px solid #007bff;
}

.stat-card h3 {
    color: #007bff;
    font-size: 2rem;
    font-weight: bold;
}

.loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
}

.error-message {
    padding: 20px;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 5px;
    color: #721c24;
}

.success-message {
    padding: 20px;
    background: #d4edda;
    border: 1px solid #c3e6cb;
    border-radius: 5px;
    color: #155724;
}

footer {
    margin-top: auto;
}

.hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 60px 0;
    text-align: center;
    margin-bottom: 30px;
}

.hero-section h1 {
    font-size: 3rem;
    font-weight: bold;
}

.feature-icon {
    font-size: 3rem;
    color: #007bff;
    margin-bottom: 15px;
}

.pagination {
    margin-top: 20px;
}
'@

$cssContent | Out-File -FilePath "css\style.css" -Encoding utf8
Write-Host "Created css\style.css"

# App.js
Write-Host "`nCreating app configuration..." -ForegroundColor Cyan

$appJsContent = @'
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
'@

$appJsContent | Out-File -FilePath "app\app.js" -Encoding utf8
Write-Host "Created app\app.js"

# Services
Write-Host "`nCreating services..." -ForegroundColor Cyan

$authServiceContent = @'
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
'@

$authServiceContent | Out-File -FilePath "app\services\authService.js" -Encoding utf8
Write-Host "Created app\services\authService.js"

$pitchServiceContent = @'
angular.module('pitchBookingApp')
.service('PitchService', ['$http', 'API_URL', 'AuthService', function($http, API_URL, AuthService) {
    this.getPitches = function(filters) {
        var params = filters || {};
        return $http.get(API_URL + '/pitches', { params: params });
    };
    
    this.getPitchById = function(id) {
        return $http.get(API_URL + '/pitches/' + id);
    };
    
    this.createPitch = function(pitchData) {
        return $http.post(API_URL + '/pitches', pitchData, AuthService.getAuthHeader());
    };
    
    this.updatePitch = function(id, pitchData) {
        return $http.patch(API_URL + '/pitches/' + id, pitchData, AuthService.getAuthHeader());
    };
    
    this.deletePitch = function(id) {
        return $http.delete(API_URL + '/pitches/' + id, AuthService.getAuthHeader());
    };
    
    this.addReview = function(pitchId, reviewData) {
        return $http.post(API_URL + '/pitches/' + pitchId + '/reviews', reviewData, AuthService.getAuthHeader());
    };
    
    this.updateReview = function(pitchId, reviewId, reviewData) {
        return $http.patch(API_URL + '/pitches/' + pitchId + '/reviews/' + reviewId, reviewData, AuthService.getAuthHeader());
    };
    
    this.deleteReview = function(pitchId, reviewId) {
        return $http.delete(API_URL + '/pitches/' + pitchId + '/reviews/' + reviewId, AuthService.getAuthHeader());
    };
}]);
'@

$pitchServiceContent | Out-File -FilePath "app\services\pitchService.js" -Encoding utf8
Write-Host "Created app\services\pitchService.js"

$analyticsServiceContent = @'
angular.module('pitchBookingApp')
.service('AnalyticsService', ['$http', 'API_URL', function($http, API_URL) {
    this.getAvgPriceByGround = function() {
        return $http.get(API_URL + '/pitches/analytics/avg-price-by-ground');
    };
    
    this.getTopRated = function() {
        return $http.get(API_URL + '/pitches/analytics/top-rated');
    };
}]);
'@

$analyticsServiceContent | Out-File -FilePath "app\services\analyticsService.js" -Encoding utf8
Write-Host "Created app\services\analyticsService.js"

Write-Host "`nAll frontend files created successfully!" -ForegroundColor Green
Write-Host "`nNext: Run setup_controllers.ps1 to create controllers"
'@

$setupContent | Out-File -FilePath "setup_frontend_files.ps1" -Encoding utf8
Write-Host "Created setup_frontend_files.ps1"
