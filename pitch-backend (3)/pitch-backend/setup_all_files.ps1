# Complete Frontend Setup Script
# This script creates all necessary files for the AngularJS frontend

Write-Host "================================================" -ForegroundColor Green
Write-Host "  Pitch Booking Frontend - Complete Setup" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Create directory structure
Write-Host "Creating directory structure..." -ForegroundColor Cyan
$directories = @("css", "app", "app\controllers", "app\services", "app\directives", "views")
foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  Created: $dir" -ForegroundColor Gray
    }
}

# File contents as here-strings
$files = @{

# CSS
"css\style.css" = @'
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

# App.js
"app\app.js" = @'
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

# Auth Service
"app\services\authService.js" = @'
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

# Pitch Service
"app\services\pitchService.js" = @'
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

# Analytics Service
"app\services\analyticsService.js" = @'
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

# Main Controller
"app\controllers\mainController.js" = @'
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
'@

# Home Controller
"app\controllers\homeController.js" = @'
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
'@

# Login Controller
"app\controllers\loginController.js" = @'
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
'@

# Register Controller
"app\controllers\registerController.js" = @'
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
'@

# Pitch List Controller
"app\controllers\pitchListController.js" = @'
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
'@

# Pitch Detail Controller
"app\controllers\pitchDetailController.js" = @'
angular.module('pitchBookingApp')
.controller('PitchDetailController', ['$scope', '$routeParams', '$location', 'PitchService', 'AuthService',
function($scope, $routeParams, $location, PitchService, AuthService) {
    $scope.loading = true;
    $scope.pitch = null;
    $scope.newReview = {};
    $scope.isAuthenticated = AuthService.isAuthenticated();
    $scope.currentUser = AuthService.getCurrentUser();
    
    $scope.loadPitch = function() {
        PitchService.getPitchById($routeParams.id)
            .then(function(response) {
                $scope.pitch = response.data;
                $scope.loading = false;
            })
            .catch(function(error) {
                console.error('Error loading pitch:', error);
                $scope.error = 'Failed to load pitch details';
                $scope.loading = false;
            });
    };
    
    $scope.addReview = function() {
        if (!$scope.isAuthenticated) {
            $location.path('/login');
            return;
        }
        
        var reviewData = {
            reviewer: $scope.currentUser.username,
            rating: $scope.newReview.rating,
            comment: $scope.newReview.comment
        };
        
        PitchService.addReview($routeParams.id, reviewData)
            .then(function(response) {
                $scope.newReview = {};
                $scope.loadPitch();
                $scope.success = 'Review added successfully!';
            })
            .catch(function(error) {
                console.error('Error adding review:', error);
                $scope.error = 'Failed to add review';
            });
    };
    
    $scope.deleteReview = function(reviewId) {
        if (confirm('Are you sure you want to delete this review?')) {
            PitchService.deleteReview($routeParams.id, reviewId)
                .then(function() {
                    $scope.loadPitch();
                    $scope.success = 'Review deleted successfully!';
                })
                .catch(function(error) {
                    console.error('Error deleting review:', error);
                    $scope.error = 'Failed to delete review';
                });
        }
    };
    
    $scope.getRatingArray = function(rating) {
        return new Array(Math.floor(rating || 0));
    };
    
    $scope.loadPitch();
}]);
'@

# Add Pitch Controller
"app\controllers\addPitchController.js" = @'
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
'@

# Analytics Controller
"app\controllers\analyticsController.js" = @'
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
'@

# Pitch Card Directive
"app\directives\pitchCard.js" = @'
angular.module('pitchBookingApp')
.directive('pitchCard', function() {
    return {
        restrict: 'E',
        scope: {
            pitch: '='
        },
        template: '<div class="card pitch-card">' +
            '<div class="card-body">' +
                '<h5 class="card-title">{{pitch.Pitch}}</h5>' +
                '<h6 class="card-subtitle mb-2 text-muted">{{pitch.Ground}}</h6>' +
                '<p class="card-text">' +
                    '<span class="badge bg-{{getStatusClass(pitch.Status)}}">{{pitch.Status}}</span> ' +
                    '<span class="badge bg-secondary">{{pitch.GroundType}}</span> ' +
                    '<span class="badge bg-info">{{pitch.Environment}}</span>' +
                '</p>' +
                '<p class="price-tag">₹{{pitch.PitchPrice}}</p>' +
                '<a href="#!pitches/{{pitch._id}}" class="btn btn-primary">View Details</a>' +
            '</div>' +
        '</div>',
        link: function(scope) {
            scope.getStatusClass = function(status) {
                switch(status) {
                    case 'Open': return 'success';
                    case 'Closed': return 'danger';
                    case 'Under Maintenance': return 'warning';
                    default: return 'secondary';
                }
            };
        }
    };
});
'@

# Home View
"views\home.html" = @'
<div class="hero-section">
    <h1><i class="fas fa-baseball-ball"></i> Welcome to Pitch Booking</h1>
    <p class="lead">Find and book the perfect cricket pitch for your practice sessions</p>
    <a href="#!pitches" class="btn btn-light btn-lg mt-3">Browse Pitches</a>
</div>

<div class="container">
    <div class="row text-center mb-5">
        <div class="col-md-4">
            <div class="feature-icon">
                <i class="fas fa-search"></i>
            </div>
            <h4>Easy Search</h4>
            <p>Find pitches based on location, price, and facilities</p>
        </div>
        <div class="col-md-4">
            <div class="feature-icon">
                <i class="fas fa-star"></i>
            </div>
            <h4>Reviews & Ratings</h4>
            <p>Read reviews from other players before booking</p>
        </div>
        <div class="col-md-4">
            <div class="feature-icon">
                <i class="fas fa-calendar-check"></i>
            </div>
            <h4>Quick Booking</h4>
            <p>Book your slot in just a few clicks</p>
        </div>
    </div>
    
    <h2 class="text-center mb-4">Featured Pitches</h2>
    
    <div ng-if="loading" class="loading-spinner">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    
    <div ng-if="error" class="error-message">
        {{error}}
    </div>
    
    <div class="row" ng-if="!loading && !error">
        <div class="col-md-4 mb-4" ng-repeat="pitch in featuredPitches">
            <pitch-card pitch="pitch"></pitch-card>
        </div>
    </div>
    
    <div class="text-center mt-4" ng-if="!loading">
        <a href="#!pitches" class="btn btn-primary btn-lg">View All Pitches</a>
    </div>
</div>
'@

# Login View
"views\login.html" = @'
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title text-center mb-4">Login</h2>
                    
                    <div ng-if="error" class="alert alert-danger">{{error}}</div>
                    
                    <form ng-submit="login()">
                        <div class="mb-3">
                            <label class="form-label">Email or Username</label>
                            <input type="text" class="form-control" ng-model="credentials.email" required>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Password</label>
                            <input type="password" class="form-control" ng-model="credentials.password" required>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-100" ng-disabled="loading">
                            <span ng-if="!loading">Login</span>
                            <span ng-if="loading">Logging in...</span>
                        </button>
                    </form>
                    
                    <div class="text-center mt-3">
                        <p>Don't have an account? <a href="#!register">Register here</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
'@

# Register View
"views\register.html" = @'
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title text-center mb-4">Register</h2>
                    
                    <div ng-if="error" class="alert alert-danger">{{error}}</div>
                    
                    <form ng-submit="register()">
                        <div class="mb-3">
                            <label class="form-label">Username</label>
                            <input type="text" class="form-control" ng-model="user.username" required>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" ng-model="user.email" required>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Password</label>
                            <input type="password" class="form-control" ng-model="user.password" required>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Confirm Password</label>
                            <input type="password" class="form-control" ng-model="user.confirmPassword" required>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-100" ng-disabled="loading">
                            <span ng-if="!loading">Register</span>
                            <span ng-if="loading">Registering...</span>
                        </button>
                    </form>
                    
                    <div class="text-center mt-3">
                        <p>Already have an account? <a href="#!login">Login here</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
'@

# Pitch List View
"views\pitch-list.html" = @'
<div class="container-fluid">
    <h2 class="mb-4">Browse Pitches</h2>
    
    <div class="filter-section">
        <h5>Filters</h5>
        <div class="row">
            <div class="col-md-3 mb-3">
                <label class="form-label">Search</label>
                <input type="text" class="form-control" ng-model="filters.q" placeholder="Search...">
            </div>
            <div class="col-md-3 mb-3">
                <label class="form-label">Ground</label>
                <input type="text" class="form-control" ng-model="filters.ground">
            </div>
            <div class="col-md-3 mb-3">
                <label class="form-label">Status</label>
                <select class="form-control" ng-model="filters.status">
                    <option value="">All</option>
                    <option ng-repeat="status in statusOptions" value="{{status}}">{{status}}</option>
                </select>
            </div>
            <div class="col-md-3 mb-3">
                <label class="form-label">Ground Type</label>
                <select class="form-control" ng-model="filters.type">
                    <option value="">All</option>
                    <option ng-repeat="type in groundTypeOptions" value="{{type}}">{{type}}</option>
                </select>
            </div>
            <div class="col-md-3 mb-3">
                <label class="form-label">Environment</label>
                <select class="form-control" ng-model="filters.env">
                    <option value="">All</option>
                    <option ng-repeat="env in environmentOptions" value="{{env}}">{{env}}</option>
                </select>
            </div>
            <div class="col-md-3 mb-3">
                <label class="form-label">Min Price</label>
                <input type="number" class="form-control" ng-model="filters.min_price">
            </div>
            <div class="col-md-3 mb-3">
                <label class="form-label">Max Price</label>
                <input type="number" class="form-control" ng-model="filters.max_price">
            </div>
            <div class="col-md-3 mb-3">
                <label class="form-label">Bowling Machine</label>
                <select class="form-control" ng-model="filters.has_bowling_machine">
                    <option value="">All</option>
                    <option value="true">Available</option>
                    <option value="false">Not Available</option>
                </select>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <button class="btn btn-primary" ng-click="loadPitches()">Apply Filters</button>
                <button class="btn btn-secondary ms-2" ng-click="clearFilters()">Clear</button>
            </div>
        </div>
    </div>
    
    <div ng-if="loading" class="loading-spinner">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    
    <div ng-if="error" class="error-message">{{error}}</div>
    
    <div class="row" ng-if="!loading && !error">
        <div class="col-md-4 mb-4" ng-repeat="pitch in pitches">
            <pitch-card pitch="pitch"></pitch-card>
        </div>
    </div>
    
    <div ng-if="pitches.length === 0 && !loading" class="text-center">
        <p class="text-muted">No pitches found matching your criteria.</p>
    </div>
</div>
'@

# Pitch Detail View
"views\pitch-detail.html" = @'
<div class="container">
    <div ng-if="loading" class="loading-spinner">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    
    <div ng-if="error" class="error-message">{{error}}</div>
    <div ng-if="success" class="success-message">{{success}}</div>
    
    <div ng-if="!loading && pitch">
        <div class="row">
            <div class="col-md-8">
                <h1>{{pitch.Pitch}}</h1>
                <h3 class="text-muted">{{pitch.Ground}}</h3>
                
                <div class="mb-4">
                    <span class="badge bg-{{pitch.Status === 'Open' ? 'success' : 'danger'}} me-2">{{pitch.Status}}</span>
                    <span class="badge bg-secondary me-2">{{pitch.GroundType}}</span>
                    <span class="badge bg-info me-2">{{pitch.Environment}}</span>
                    <span class="badge bg-{{pitch['Bowling Machine'] === 'available' ? 'success' : 'warning'}}">
                        Bowling Machine: {{pitch['Bowling Machine']}}
                    </span>
                </div>
                
                <div class="price-tag mb-4">₹{{pitch.PitchPrice}} / session</div>
                
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Location</h5>
                        <p>
                            <i class="fas fa-map-marker-alt"></i> 
                            Latitude: {{pitch.location.latitude}}, 
                            Longitude: {{pitch.location.longitude}}
                        </p>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Reviews</h5>
                        
                        <div ng-if="pitch.Reviews && pitch.Reviews.length > 0">
                            <div class="review-item mb-3 pb-3 border-bottom" ng-repeat="review in pitch.Reviews">
                                <div class="d-flex justify-content-between">
                                    <strong>{{review.reviewer}}</strong>
                                    <span class="rating">
                                        <i class="fas fa-star" ng-repeat="star in getRatingArray(review.rating)"></i>
                                    </span>
                                </div>
                                <p class="mb-0 mt-2">{{review.comment}}</p>
                            </div>
                        </div>
                        
                        <div ng-if="!pitch.Reviews || pitch.Reviews.length === 0">
                            <p class="text-muted">No reviews yet. Be the first to review!</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-4">
                <div class="card" ng-if="isAuthenticated">
                    <div class="card-body">
                        <h5 class="card-title">Add a Review</h5>
                        <form ng-submit="addReview()">
                            <div class="mb-3">
                                <label class="form-label">Rating</label>
                                <select class="form-control" ng-model="newReview.rating" required>
                                    <option value="">Select rating</option>
                                    <option value="1">1 Star</option>
                                    <option value="2">2 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="5">5 Stars</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Comment</label>
                                <textarea class="form-control" ng-model="newReview.comment" rows="3" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Submit Review</button>
                        </form>
                    </div>
                </div>
                
                <div class="card" ng-if="!isAuthenticated">
                    <div class="card-body text-center">
                        <p>Please <a href="#!login">login</a> to add a review</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
'@

# Add Pitch View
"views\add-pitch.html" = @'
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title mb-4">Add New Pitch</h2>
                    
                    <div ng-if="error" class="alert alert-danger">{{error}}</div>
                    
                    <form ng-submit="submitPitch()">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Pitch Name</label>
                                <input type="text" class="form-control" ng-model="pitch.Pitch" required>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Ground Name</label>
                                <input type="text" class="form-control" ng-model="pitch.Ground" required>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Latitude</label>
                                <input type="number" step="any" class="form-control" ng-model="pitch.location.latitude" required>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Longitude</label>
                                <input type="number" step="any" class="form-control" ng-model="pitch.location.longitude" required>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Price (₹)</label>
                                <input type="number" class="form-control" ng-model="pitch.PitchPrice" required>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Status</label>
                                <select class="form-control" ng-model="pitch.Status" required>
                                    <option value="">Select status</option>
                                    <option ng-repeat="status in statusOptions" value="{{status}}">{{status}}</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Ground Type</label>
                                <select class="form-control" ng-model="pitch.GroundType" required>
                                    <option value="">Select type</option>
                                    <option ng-repeat="type in groundTypeOptions" value="{{type}}">{{type}}</option>
                                </select>
                            </div>
                            
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Environment</label>
                                <select class="form-control" ng-model="pitch.Environment" required>
                                    <option value="">Select environment</option>
                                    <option ng-repeat="env in environmentOptions" value="{{env}}">{{env}}</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Bowling Machine</label>
                            <select class="form-control" ng-model="pitch.BowlingMachine" required>
                                <option value="">Select option</option>
                                <option ng-repeat="option in bowlingMachineOptions" value="{{option}}">{{option}}</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="btn btn-primary" ng-disabled="loading">
                            <span ng-if="!loading">Create Pitch</span>
                            <span ng-if="loading">Creating...</span>
                        </button>
                        <a href="#!pitches" class="btn btn-secondary ms-2">Cancel</a>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
'@

# Analytics View
"views\analytics.html" = @'
<div class="container">
    <h2 class="mb-4">Analytics Dashboard</h2>
    
    <div ng-if="loading" class="loading-spinner">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    
    <div ng-if="!loading">
        <div class="row mb-4">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Average Price by Ground</h4>
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Ground</th>
                                        <th>Average Price</th>
                                        <th>Total Pitches</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr ng-repeat="item in avgPriceData">
                                        <td>{{item.ground}}</td>
                                        <td>₹{{item.avg_price | number:2}}</td>
                                        <td>{{item.count}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Top Rated Pitches</h4>
                        <div class="row">
                            <div class="col-md-4 mb-3" ng-repeat="pitch in topRatedData">
                                <div class="card stat-card">
                                    <div class="card-body">
                                        <h5>{{pitch.Pitch}}</h5>
                                        <p class="text-muted">{{pitch.Ground}}</p>
                                        <div class="rating">
                                            <i class="fas fa-star" ng-repeat="star in getRatingArray(pitch.avg_rating)"></i>
                                            <span class="ms-2">{{pitch.avg_rating | number:1}}</span>
                                        </div>
                                        <p class="mt-2">
                                            <strong>₹{{pitch.PitchPrice}}</strong> / session
                                        </p>
                                        <a href="#!pitches/{{pitch._id}}" class="btn btn-sm btn-primary">View Details</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
'@

}

# Create all files
Write-Host "`nCreating application files..." -ForegroundColor Cyan
$fileCount = 0
foreach ($file in $files.Keys) {
    $files[$file] | Out-File -FilePath $file -Encoding utf8 -Force
    Write-Host "  Created: $file" -ForegroundColor Gray
    $fileCount++
}

Write-Host "`n================================================" -ForegroundColor Green
Write-Host "  Setup Complete! Created $fileCount files" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Make sure backend is running on http://localhost:5001" -ForegroundColor White
Write-Host "2. Install http-server: npm install -g http-server" -ForegroundColor White
Write-Host "3. Start frontend: http-server -p 8080 -c-1" -ForegroundColor White
Write-Host "4. Open browser: http://localhost:8080" -ForegroundColor White
Write-Host "`nEnjoy your Pitch Booking application!" -ForegroundColor Green
