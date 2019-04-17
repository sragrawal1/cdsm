(function () {
    'use strict';
    cdsmApp.controller('headerController', function headerController($scope, globalService, commonService, helperService, $rootScope, $timeout, $cookieStore, $localStorage) {
        globalService.authenticateUser();

        $scope.logOut = logOut;

        function InitDatepicker()
        {
            try {
                $("#datetimepicker").kendoDatePicker({
                    value: new Date(),
                    max: new Date(),
                    change: function () {
                        var value = this.value();
                        onDatetimeChange(value);
                    }
                });
            } catch (e) {
                alert(e);
            }

        }

        function onDatetimeChange(datevalue) {
            try {
                //alert('Date Changed');
                var date = new Date(datevalue);
                setDateToscope(date);
                globalService.setSelectedDate(date);

            } catch (e) {
                alert(e);
            }
        }

        function setDefaultDate() {
            try {
                var date = new Date();
                date.setDate(date.getDate());
                globalService.setSelectedDate(date);
                setDateToscope(globalService.getSelectedDate());
                InitDatepicker();
            } catch (e) {
                alert(e);
            }
        }

        function setDateToscope(date) {
            try {
                if (date == null) {
                    date = new Date();
                    date.setDate(date.getDate());
                }
                $scope.date = date;
            } catch (e) {
                alert(e);
            }
        }

        setDefaultDate();


        $scope.$on('pageLoaded', function (event, args) {
            switch (args.pageName) {
                case "FinalizingErrordomains":

                    break;
                case "Finalizingrootcauseofthefailures":

                    break;
                default:
                    break;
            }

            $scope.pageName = args.pageName;
            //$scope.$apply();

            $(".menuitem").each(function () {
                $(this).removeClass("active");
            });

            $("#li" + args.shortName).addClass('active');

        });

        function logOut()
        {
            ConfirmLogout();
        }

        function ConfirmLogout() {

            swal({
                title: "Are you sure to Logout?",
                type: "warning", showCancelButton: true, confirmButtonColor: "#DD6B55",  confirmButtonText: "Yes, Logout!", closeOnConfirm: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    $timeout(logout, 500); //timer required to avoid overlap with sweet alert confirm page
                }
            });
        }

        function logout() {
            try {
                clearLocalStorage();
                globalService.clearUser();
                //authenticationService.Logout();
            } catch (e) {
                alert(e);
            }
        }

        function clearLocalStorage()
        {
            $localStorage.technologyKPIData = null;
            $localStorage.technologyFailureData = null;
            $localStorage.networkScoreData = null;
            $localStorage.networkKPIData = null;
            $localStorage.kpiHierarchyData = null;
            $localStorage.callTraceData = null;
            $localStorage.failureData = null;
            $localStorage.rcaData = null;
        }
    });
}());