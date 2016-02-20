(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend', [
        'ui.router',
        'ngResource',
        'pascalprecht.translate',
        'toastr',
        'ui.select',
        'xeditable']);

    app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
        $stateProvider
        .state('/', {
            url: '/',
            controller: 'HomeController',
            templateUrl: 'app/home.tpl.html'
        })
        .state('/b/:slug', {
            url: '/b/:slug',
            controller: 'BoardController',
            templateUrl: 'app/board.tpl.html'
        });

        $urlRouterProvider.otherwise('/');

        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    });

    app.run(function(editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    });

})();

(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('AuthController', function($scope, $location, AuthService) {
        $scope.authenticated = false;
        
        AuthService.getUser().then(function(response) {
            $scope.authenticated = true;;
        }, function(response) {
            $scope.authenticated = false;
            $location.path('/');
        });
    });
})();
(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('BoardController', function($scope, $http, $location, $stateParams, $resource) {

    	$scope.slug = $stateParams.slug;

        $http.get('/api/boards/' + $scope.slug).then(function(response) {
            $scope.board = response.data;
        });

        // var Board = $resource('/api/boards/:slug', {
        //     slug:'@slug'
        // });

        // var boards = Board.query(function() {
        //     console.log(boards[0]);
        // });
    });
})();
(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.controller('HomeController', function($scope, $http, $location) {
        function init() {
            $http.get('/api/boards').then(function(response) {
                $scope.list = response.data;
            });
        }

        init();

        $scope.data = {};

        $scope.save = function() {
            $http.post('/api/boards', $scope.data.name).then(function(response) {
                console.log(response);
                $scope.data.name = '';
                init();
            });
        }
    });
})();
(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.directive('landingPage', ['$location', '$rootScope', function($location, $rootScope) {
        return {
            restrict: 'EA',
            templateUrl: 'app/landing-page.tpl.html',
        }
    }]);
})();
(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.directive('navbar', ['$location', '$rootScope', '$http', 'AuthService', function($location, $rootScope, $http, AuthService) {
        return {
            restrict: 'EA',
            templateUrl: 'app/navbar.tpl.html',
            link: function($scope) {
                $scope.location = $location.path();
                $rootScope.$on('$locationChangeStart', function(event, next) {
                    $scope.location = next.split('#')[1];

                });

                $scope.user = {};

                AuthService.getUser().then(function(response) {
                    $scope.user.name = response.data.firstName + ' ' + response.data.lastName;
                    $scope.user.profilePicture = response.data.imageUrl;
                });

                $scope.logout = function() {
                  AuthService.logout().then(function(response) {
                    $scope.authenticated = false;
                    $location.path('/');
                    location.reload(true);
                }, function(response) {
                    console.log(response);
                    $scope.authenticated = false;
                    $location.path('/');
                    location.reload(true);
                })
              };
          }
      }
  }]);

})();
(function() {
    'use strict';

    var app = angular.module('scrum-board-frontend');

    app.service('AuthService', AuthService);

    function AuthService($http, $location) {
        var service = {};

        service.getUser = getUser;
        service.logout = logout;

        return service;

        function getUser() {
            return $http.get('/api/user');
        }

        function logout() {
            return $http.post('/auth/logout');
        };

    };
})();