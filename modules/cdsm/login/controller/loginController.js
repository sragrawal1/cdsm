(function () {
    'use strict';
    loginModule.controller('loginController', ['$scope', '$location', '$window', 'globalService', 'commonService', '$rootScope', '$cookieStore', '$http','$localStorage',
    function ($scope, $location, $window, globalService, commonService, $rootScope, $cookieStore, $http,$localStorage) {
        setLocalStorage();
        $scope.user = globalService.getUser();

        $scope.$on('onDateChangeEvent', function () {
            //$scope.selectedDate = globalService.getSelectedDate();
            //$scope.$apply();
        });

        $scope.loginFunction = function () {
            try {
                var response = null;
                Login();
            } catch (e) {
                alert(e);
            }
        };

        function setLocalStorage()
        {
            try {

                //if (!commonService.isStaticData())
                //{
                //    return;
                //}

                $http.get("Data/technologyKPI.json").success(function (data) {
                    $localStorage.technologyKPIData = data;
                    //alert('Local Storage - technologyKPI.json Loaded');
                }).error(function (err) {
                    alert.log(err);
                })

                $http.get("Data/technologyFailure.json").success(function (data) {
                    $localStorage.technologyFailureData = data;
                    //alert('Local Storage - technologyFailure.json Loaded');
                }).error(function (err) {
                    alert.log(err);
                })

                $http.get("Data/networkScore.json").success(function (data) {
                    $localStorage.networkScoreData = data;
                    //alert('Local Storage - networkScore.json Loaded');
                }).error(function (err) {
                    alert.log(err);
                })

                $http.get("Data/networkKPI.json").success(function (data) {
                    $localStorage.networkKPIData = data;
                   // alert('Local Storage - networkKPI.json Loaded');
                }).error(function (err) {
                    alert.log(err);
                })

                $http.get("Data/kpiHierarchy.json").success(function (data) {
                    $localStorage.kpiHierarchyData = data;
                    //alert('Local Storage - kpiHierarchy.json Loaded');
                }).error(function (err) {
                    alert.log(err);
                })

                $http.get("Data/callTrace.json").success(function (data) {
                    $localStorage.callTraceData = data;
                }).error(function (err) {
                    alert.log(err);
                })

                $http.get("Data/failureData.json").success(function (data) {
                    $localStorage.failureData = data;
                }).error(function (err) {
                    alert.log(err);
                })

                $http.get("Data/rcaData.json").success(function (data) {
                    $localStorage.rcaData = data;
                }).error(function (err) {
                    alert.log(err);
                })

            } catch (e) {
                alert(e);
            }
        }

        function Login() {
            try {

                if ($scope.user.password == "cdsme2e")
                {
                    $scope.user.isAuthenticated = true;
                    globalService.setUser($scope.user);
                    $location.path("/dashboard");
                    $rootScope.$broadcast('onSuccessLogin', { user: $scope.user });

                    return;
                }

                else
                {
                    commonService.showGoAwayMessage("info", 'Incorrect Password!!', "Login");
                }
                
                //authenticationService.Login($scope.user.userName, $scope.user.password, function (res) {
                //    if (res === true) {
                //        $scope.user.isAuthenticated = true;
                //        globalService.setUser($scope.user);
                //        $location.path("/dashboard");
                //        $rootScope.$broadcast('onSuccessLogin', { user: $scope.user });
                //    }
                //    else {
                //        commonService.showGoAwayMessage("error", 'User Login failed..', "Log in");
                //    }
                //});
            
            } catch (e) {
                alert(e);
            } finally {
                //commonService.setMainBusyIndicator(false);
            }
        };
    }]);
}());