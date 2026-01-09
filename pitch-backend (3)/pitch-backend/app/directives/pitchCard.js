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
                '<p class="price-tag">â‚¹{{pitch.PitchPrice}}</p>' +
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
