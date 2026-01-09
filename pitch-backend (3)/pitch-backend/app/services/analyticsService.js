angular.module('pitchBookingApp')
.service('AnalyticsService', ['$http', 'API_URL', function($http, API_URL) {
    this.getAvgPriceByGround = function() {
        return $http.get(API_URL + '/pitches/analytics/avg-price-by-ground');
    };
    
    this.getTopRated = function() {
        return $http.get(API_URL + '/pitches/analytics/top-rated');
    };
}]);
