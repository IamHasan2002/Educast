// Pitch Booking App - AngularJS
angular.module('pitchApp', ['ngRoute', 'ngSanitize'])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    // Add CORS headers
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeController'
      })
      .when('/login', {
        templateUrl: 'views/auth.html',
        controller: 'AuthController'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterController'
      })
      .when('/pitches', {
        templateUrl: 'views/pitches-list.html',
        controller: 'PitchesListController'
      })
      .when('/pitches/:id', {
        templateUrl: 'views/pitch-detail.html',
        controller: 'PitchDetailController'
      })
      .when('/pitches/:id/edit', {
        templateUrl: 'views/edit-pitch.html',
        controller: 'EditPitchController'
      })
      .when('/create-pitch', {
        templateUrl: 'views/create-pitch.html',
        controller: 'CreatePitchController'
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileController'
      })
      .when('/analytics', {
        templateUrl: 'views/analytics.html',
        controller: 'AnalyticsController'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])

  // ========== API SERVICE ==========
  .factory('ApiService', ['$http', function($http) {
    const API_URL = 'http://localhost:5001/api';

    return {
      // Auth
      register: function(email, password, name) {
        return $http.post(API_URL + '/auth/register', {
          email: email,
          password: password,
          name: name
        });
      },
      login: function(email, password) {
        return $http.post(API_URL + '/auth/login', {
          email: email,
          password: password
        });
      },
      
      // Pitches
      getPitches: function(params) {
        return $http.get(API_URL + '/pitches', { params: params });
      },
      getPitch: function(id) {
        return $http.get(API_URL + '/pitches/' + id);
      },
      createPitch: function(pitchData, token) {
        return $http.post(API_URL + '/pitches', pitchData, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
      },
      updatePitch: function(id, pitchData, token) {
        return $http.patch(API_URL + '/pitches/' + id, pitchData, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
      },
      deletePitch: function(id, token) {
        return $http.delete(API_URL + '/pitches/' + id, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
      },
      
      // Reviews
      addReview: function(pitchId, reviewData) {
        return $http.post(API_URL + '/pitches/' + pitchId + '/reviews', reviewData);
      },
      
      // Analytics
      getAveragePriceByGround: function() {
        return $http.get(API_URL + '/pitches/analytics/avg-price-by-ground');
      },
      getTopRated: function() {
        return $http.get(API_URL + '/pitches/analytics/top-rated');
      },
      
      // Health
      health: function() {
        return $http.get(API_URL + '/health');
      }
    };
  }])

  // ========== AUTH SERVICE ==========
  .factory('AuthService', ['$window', function($window) {
    return {
      setToken: function(token) {
        $window.localStorage.setItem('jwt_token', token);
      },
      getToken: function() {
        return $window.localStorage.getItem('jwt_token');
      },
      removeToken: function() {
        $window.localStorage.removeItem('jwt_token');
      },
      isLoggedIn: function() {
        return !!$window.localStorage.getItem('jwt_token');
      },
      setUser: function(user) {
        $window.localStorage.setItem('user', JSON.stringify(user));
      },
      getUser: function() {
        const user = $window.localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
      },
      logout: function() {
        $window.localStorage.removeItem('jwt_token');
        $window.localStorage.removeItem('user');
      }
    };
  }])

  // ========== HOME CONTROLLER ==========
  .controller('HomeController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
    $scope.isLoggedIn = AuthService.isLoggedIn();
    
    $scope.goToPitches = function() {
      $location.path('/pitches');
    };
    
    $scope.goToCreate = function() {
      if (!$scope.isLoggedIn) {
        $location.path('/login');
      } else {
        $location.path('/create-pitch');
      }
    };
  }])

  // ========== AUTH CONTROLLER ==========
  .controller('AuthController', ['$scope', '$location', 'ApiService', 'AuthService', function($scope, $location, ApiService, AuthService) {
    $scope.email = '';
    $scope.password = '';
    $scope.error = '';
    $scope.loading = false;

    $scope.login = function() {
      if (!$scope.email || !$scope.password) {
        $scope.error = 'Email and password are required';
        return;
      }

      $scope.loading = true;
      $scope.error = '';

      ApiService.login($scope.email, $scope.password).then(function(response) {
        AuthService.setToken(response.data.token);
        AuthService.setUser({ email: $scope.email });
        $location.path('/pitches');
      }, function(error) {
        $scope.error = error.data?.error || 'Login failed';
        $scope.loading = false;
      });
    };
  }])

  // ========== REGISTER CONTROLLER ==========
  .controller('RegisterController', ['$scope', '$location', 'ApiService', 'AuthService', function($scope, $location, ApiService, AuthService) {
    $scope.email = '';
    $scope.password = '';
    $scope.name = '';
    $scope.error = '';
    $scope.loading = false;

    $scope.register = function() {
      if (!$scope.email || !$scope.password || !$scope.name) {
        $scope.error = 'All fields are required';
        return;
      }

      $scope.loading = true;
      $scope.error = '';

      ApiService.register($scope.email, $scope.password, $scope.name).then(function(response) {
        AuthService.setToken(response.data.token);
        AuthService.setUser({ email: $scope.email, name: $scope.name });
        $location.path('/pitches');
      }, function(error) {
        $scope.error = error.data?.error || 'Registration failed';
        $scope.loading = false;
      });
    };
  }])

  // ========== PITCHES LIST CONTROLLER ==========
  .controller('PitchesListController', ['$scope', 'ApiService', function($scope, ApiService) {
    $scope.pitches = [];
    $scope.loading = true;
    $scope.error = '';
    $scope.total = 0;
    $scope.currentPage = 1;
    $scope.limit = 12;

    // Filters
    $scope.filters = {
      ground: '',
      status: '',
      env: '',
      type: '',
      min_price: '',
      max_price: '',
      has_bowling_machine: ''
    };

    $scope.loadPitches = function() {
      $scope.loading = true;
      $scope.error = '';

      const params = {
        page: $scope.currentPage,
        limit: $scope.limit
      };

      // Add filters if set
      if ($scope.filters.ground) params.ground = $scope.filters.ground;
      if ($scope.filters.status) params.status = $scope.filters.status;
      if ($scope.filters.env) params.env = $scope.filters.env;
      if ($scope.filters.type) params.type = $scope.filters.type;
      if ($scope.filters.min_price) params.min_price = $scope.filters.min_price;
      if ($scope.filters.max_price) params.max_price = $scope.filters.max_price;
      if ($scope.filters.has_bowling_machine) params.has_bowling_machine = $scope.filters.has_bowling_machine;

      ApiService.getPitches(params).then(function(response) {
        $scope.pitches = response.data.items;
        $scope.total = response.data.total;
        $scope.loading = false;
      }, function(error) {
        $scope.error = 'Failed to load pitches';
        $scope.loading = false;
      });
    };

    $scope.applyFilters = function() {
      $scope.currentPage = 1;
      $scope.loadPitches();
    };

    $scope.resetFilters = function() {
      $scope.filters = {
        ground: '',
        status: '',
        env: '',
        type: '',
        min_price: '',
        max_price: '',
        has_bowling_machine: ''
      };
      $scope.loadPitches();
    };

    $scope.nextPage = function() {
      if ($scope.currentPage * $scope.limit < $scope.total) {
        $scope.currentPage++;
        $scope.loadPitches();
      }
    };

    $scope.prevPage = function() {
      if ($scope.currentPage > 1) {
        $scope.currentPage--;
        $scope.loadPitches();
      }
    };

    $scope.getStatusBadgeClass = function(status) {
      if (status === 'Open') return 'badge-open';
      if (status === 'Closed') return 'badge-closed';
      return 'badge-maintenance';
    };

    $scope.loadPitches();
  }])

  // ========== PITCH DETAIL CONTROLLER ==========
  .controller('PitchDetailController', ['$scope', '$routeParams', '$location', 'ApiService', 'AuthService', 
    function($scope, $routeParams, $location, ApiService, AuthService) {
    $scope.pitch = null;
    $scope.loading = true;
    $scope.error = '';
    $scope.deleting = false;
    $scope.isLoggedIn = AuthService.isLoggedIn();
    $scope.review = {
      reviewer: '',
      rating: 5,
      comment: ''
    };

    ApiService.getPitch($routeParams.id).then(function(response) {
      $scope.pitch = response.data;
      $scope.loading = false;
    }, function(error) {
      $scope.error = 'Pitch not found';
      $scope.loading = false;
    });

    $scope.addReview = function() {
      if (!$scope.review.reviewer || !$scope.review.comment) {
        $scope.error = 'Please fill in all fields';
        return;
      }

      ApiService.addReview($routeParams.id, $scope.review).then(function(response) {
        $scope.pitch = response.data;
        $scope.review = {
          reviewer: '',
          rating: 5,
          comment: ''
        };
        $scope.successMessage = 'Review added successfully!';
      }, function(error) {
        $scope.error = 'Failed to add review';
      });
    };

    $scope.deletePitch = function() {
      if (!confirm('Are you sure you want to delete this pitch?')) {
        return;
      }

      $scope.deleting = true;
      const token = AuthService.getToken();
      ApiService.deletePitch($routeParams.id, token).then(function() {
        alert('Pitch deleted successfully');
        $location.path('/pitches');
      }, function(error) {
        $scope.error = 'Failed to delete pitch';
        $scope.deleting = false;
      });
    };

    $scope.isOwner = function() {
      if (!$scope.pitch || !AuthService.isLoggedIn()) return false;
      const user = AuthService.getUser();
      // For now, we'll show delete button for all logged in users
      // In production, add createdBy field to pitches
      return AuthService.isLoggedIn();
    };

    $scope.goToEdit = function() {
      $location.path('/pitches/' + $routeParams.id + '/edit');
    };

    $scope.getStars = function(rating) {
      return Array(rating).fill('★').join('');
    };
  }])

  // ========== EDIT PITCH CONTROLLER ==========
  .controller('EditPitchController', ['$scope', '$location', '$routeParams', 'ApiService', 'AuthService', 
    function($scope, $location, $routeParams, ApiService, AuthService) {
    $scope.pitch = null;
    $scope.loading = true;
    $scope.error = '';
    $scope.successMessage = '';

    if (!AuthService.isLoggedIn()) {
      $location.path('/login');
      return;
    }

    // Load pitch details
    ApiService.getPitch($routeParams.id).then(function(response) {
      $scope.pitch = response.data;
      $scope.loading = false;
    }, function(error) {
      $scope.error = 'Pitch not found';
      $scope.loading = false;
    });

    $scope.updatePitch = function() {
      if (!$scope.pitch.Pitch || !$scope.pitch.Ground || !$scope.pitch.PitchPrice) {
        $scope.error = 'Please fill in all required fields';
        return;
      }

      $scope.loading = true;
      $scope.error = '';

      const token = AuthService.getToken();
      ApiService.updatePitch($routeParams.id, $scope.pitch, token).then(function(response) {
        $scope.successMessage = 'Pitch updated successfully!';
        $scope.loading = false;
        setTimeout(() => {
          $location.path('/pitches/' + $routeParams.id);
        }, 1500);
      }, function(error) {
        $scope.error = error.data?.error || 'Failed to update pitch';
        $scope.loading = false;
      });
    };
  }])

  // ========== CREATE PITCH CONTROLLER ==========
  .controller('CreatePitchController', ['$scope', '$location', 'ApiService', 'AuthService', 
    function($scope, $location, ApiService, AuthService) {
    $scope.pitch = {
      Pitch: '',
      Ground: '',
      location: { latitude: 51.5, longitude: -0.12 },
      PitchPrice: '',
      Status: 'Open',
      GroundType: 'Grass',
      Environment: 'Indoor',
      'Bowling Machine': 'available'
    };
    $scope.loading = false;
    $scope.error = '';
    $scope.successMessage = '';

    if (!AuthService.isLoggedIn()) {
      $location.path('/login');
      return;
    }

    $scope.createPitch = function() {
      if (!$scope.pitch.Pitch || !$scope.pitch.Ground || !$scope.pitch.PitchPrice) {
        $scope.error = 'Please fill in all required fields';
        return;
      }

      $scope.loading = true;
      $scope.error = '';

      const token = AuthService.getToken();
      ApiService.createPitch($scope.pitch, token).then(function(response) {
        $scope.successMessage = 'Pitch created successfully!';
        $scope.loading = false;
        setTimeout(() => {
          $location.path('/pitches/' + response.data._id);
        }, 1500);
      }, function(error) {
        $scope.error = error.data?.errors || error.data?.error || 'Failed to create pitch';
        $scope.loading = false;
      });
    };
  }])

  // ========== PROFILE CONTROLLER ==========
  .controller('ProfileController', ['$scope', '$location', 'AuthService', 
    function($scope, $location, AuthService) {
    $scope.user = AuthService.getUser();

    if (!$scope.user) {
      $location.path('/login');
      return;
    }

    $scope.logout = function() {
      AuthService.logout();
      $location.path('/');
    };
  }])

  // ========== ANALYTICS CONTROLLER ==========
  .controller('AnalyticsController', ['$scope', 'ApiService', function($scope, ApiService) {
    $scope.loading = true;
    $scope.error = '';
    $scope.avgPriceByGround = [];
    $scope.topRated = [];
    $scope.totalPitches = 0;

    ApiService.getAveragePriceByGround().then(function(response) {
      $scope.avgPriceByGround = response.data.items;
      // compute total pitches
      $scope.totalPitches = ($scope.avgPriceByGround || []).reduce(function(sum, item){ return sum + (item.count || 0); }, 0);
    }, function(error) {
      $scope.error = 'Failed to load analytics';
    });

    ApiService.getTopRated().then(function(response) {
      $scope.topRated = response.data.items;
      $scope.loading = false;
    }, function(error) {
      $scope.error = 'Failed to load analytics';
      $scope.loading = false;
    });

    $scope.getStars = function(rating) {
      const fullStars = Math.floor(rating);
      const hasHalf = rating % 1 > 0;
      let stars = '';
      
      for (let i = 0; i < fullStars; i++) {
        stars += '★';
      }
      
      if (hasHalf) {
        stars += '½';
      }
      
      return stars;
    };
  }])

  // ========== APP CONTROLLER ==========
  .controller('AppController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
    $scope.isLoggedIn = function() {
      return AuthService.isLoggedIn();
    };

    $scope.getUser = function() {
      return AuthService.getUser();
    };

    $scope.logout = function() {
      AuthService.logout();
      $location.path('/');
    };

    $scope.isActive = function(path) {
      return $location.path().indexOf(path) === 0;
    };
  }]);
