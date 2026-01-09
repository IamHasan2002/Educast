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
