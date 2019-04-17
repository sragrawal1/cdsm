(function () {
    'use strict';
    commonModule.factory('globalService', function ($rootScope, $location, $http, commonService, $cookieStore) {
        var serviceUrl = commonService.serviceUrl;
        
        var selectedDate = new Date();
        var currentIMSI = { imsi: "", id: "" };
        var currentDomain = "RAN";
        selectedDate.setDate(selectedDate.getDate() - 1);

        var user = {
            userId: 0,
            firstName: "",
            lastName: "",
            userName: "admin",
            password: "",
            sessionId: "",
            isAuthenticated: false,
            isValid: false
        };

        function getUser() {
            return user;
        };

        function setUser(u) {
            user = u;
            $cookieStore.put('CDSM_User', user);
            //onUserLogin();
        }

        function clearUser()
        {
            user = {
                userId: 0,
                firstName: "",
                lastName: "",
                userName: "admin",
                password: "",
                sessionId: "",
                isAuthenticated: false,
                isValid: false
            };
            $cookieStore.put('CDSM_User', user);
            $location.path('/');
            $rootScope.$broadcast('onSuccessLogin', { user: user });
        }

        function authenticateUser()
        {
            var user = $cookieStore.get('CDSM_User');
            if (user == undefined || user == null || user.isAuthenticated == false)
            {
                $location.path('/');
            }
            else
            {
                setUser(user);
                $rootScope.$broadcast('onSuccessLogin', { user: user });
            }
        }
        
        function onUserLogin() {
            $rootScope.$broadcast('onUserLoginEvent');
        }


        function getSelectedDate() {
            return selectedDate;
        }

        function setSelectedDate(date) {
            selectedDate = date;
            onDateChange();
        }


        function getCurrentIMSI()
        {
            return currentIMSI;
        }

        function setCurrentIMSI(imsi)
        {
            currentIMSI = imsi;
        }


        function getCurrentDomain() {
            return currentDomain;
        }

        function setCurrentDomain(domain) {
            currentDomain = domain;
        }

        function onDateChange() {
            $rootScope.$broadcast('onDateChangeEvent');
        }

       

 
        return ({
            getSelectedDate: getSelectedDate,
            setSelectedDate: setSelectedDate,
            getCurrentIMSI: getCurrentIMSI,
            setCurrentIMSI: setCurrentIMSI,
            getCurrentDomain: getCurrentDomain,
            setCurrentDomain: setCurrentDomain,

            getUser: getUser,
            setUser: setUser,
            clearUser : clearUser,
            authenticateUser: authenticateUser
        });
    });
}());