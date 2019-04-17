(function () {
    'use strict'

    cdsmApp.run(setup);
    cdsmApp.run(setupMockAuthenticate);

    function setup($rootScope, $http, $location, $localStorage) {
        // keep user logged in after page refresh
        if ($localStorage.currentUser) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
        }

        // redirect to login page if not logged in and trying to access a restricted page
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var publicPages = ['/'];
            var restrictedPage = publicPages.indexOf($location.path()) === -1;
            if (restrictedPage && !$localStorage.currentUser) {
                $location.path('/');
            }
        });
    }

    function setupMockAuthenticate($httpBackend) {

        try {

            var mockUser = { username: 'admin', password: 'admin', firstname: 'Admin', lastname: 'User' };

            $httpBackend.whenPOST('/api/authenticate').respond(function (method, url, data) {

                var parameters = angular.fromJson(data);

                if (parameters.username === mockUser.username && parameters.password === mockUser.password) {
                    return [200, { token: 'mock-jwt-token' }, {}];
                }
                else {
                    return [200, {}, {}];
                }

            });

            $httpBackend.whenGET(/^\w+.*/).passThrough();

        }
        catch (e) {
            alert("authentication exception " + e);
    }
  
    }


})();