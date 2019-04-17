(function () {
    'use strict';

    commonModule.factory("authenticationService", Service)

    function Service($rootScope, $http, $localStorage, $location, globalService) {

        var service = {};

        service.Login = Login;
        service.Logout = Logout;

        return service;

        function Login(username, password, callback) {
            $http.post('/api/authenticate', { username: username, password: password })
                .success(function (response) {
                    if (response.token) {
                        $localStorage.currentUser = { username: username, password: password };
                        $http.defaults.headers.common.Authorization = 'Bearer' + response.token;
                        callback(true);
                    }
                    else {
                        callback(false);
                    }
                });
        }

        function Logout() {
            delete $localStorage.currentUser;
            $http.defaults.headers.common.Authorization = '';
            var user = globalService.getUser();
            user = {
                userId: 0,
                firstName: "",
                lastName: "",
                userName: "admin",
                password: "admin",
                sessionId: "",
                isAuthenticated: false,
                isValid: false
            };
            $location.path('/');
            $rootScope.$broadcast('onSuccessLogin', { user: user });
        }

    }

})();