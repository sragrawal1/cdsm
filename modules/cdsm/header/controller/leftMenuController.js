(function () {
    'use strict';
    cdsmApp.controller('leftMenuController', function rcaController($scope, globalService, commonService, helperService, $rootScope, $timeout) {
        //$scope.isAuthenticated = true;
        $scope.$on('onDateChangeEvent', function () {
            //$scope.selectedDate = globalService.getSelectedDate();
            //$scope.$apply();
        });

        $scope.$on('onSuccessLogin', function (event, args) {
            try {
                var user = args.user;
                $scope.isAuthenticated = user.isAuthenticated;
            } catch (e) {
                alert(e);
            }
        });

    });
}());