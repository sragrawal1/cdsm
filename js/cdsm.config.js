
(function () {
    'use strict';

    cdsmApp.config(function ($routeProvider, $httpProvider) {

        //

        $routeProvider.when('/', {
            templateUrl: 'modules/cdsm/login/login.html'
        }).when('/dashboard', {
            templateUrl: 'modules/cdsm/dashboard/dashboard.html'
        }).when('/kpi', {
            templateUrl: 'modules/cdsm/kpi/kpi.html'
        }).when('/rca', {
            templateUrl: 'modules/cdsm/rca/rca.html'
        }).when('/ctr', {
            templateUrl: 'modules/cdsm/ct/ct.html'
        }).when('/eventlog', {
            templateUrl: 'modules/cdsm/eventlog/eventlog.html'
        }).when('/failure', {
            templateUrl: 'modules/cdsm/failure/failure.html'
        });
    });
}());