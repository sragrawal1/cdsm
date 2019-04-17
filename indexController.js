(function () {
    'use strict';
    cdsmApp.controller('indexController', function indexController($scope, $rootScope, $timeout, $location) {

        //$scope.isAuthenticated = true;
        $scope.setHeight = setHeight;
        function setHeight() {
            //alert('Window Height:' + $(window).height() + " Window width:" + $(window).width() + " Document Height:" + $(document).height() + " Document Width:" + $(document).width() + 'Header:' + $("#cdsmHeader").height() + " Content:" + $("#cdsmContent").height() + " Footer:" + $("#cdsmFooter").height());
            $("#cdsmContent").height($(window).height() - $("#cdsmHeader").height() - $("#cdsmFooter").height()-25);
        }
        setHeight();

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