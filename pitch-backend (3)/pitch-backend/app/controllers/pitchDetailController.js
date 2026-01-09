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
