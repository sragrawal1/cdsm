/**
 * Created by Sanjay 
 */

(function () {
    'use strict';

    cdsmApp.factory('kpiService', function ($http, $q, commonService, helperService) {
        var serviceUrl = commonService.serviceUrl;

        function getkpiData(request) {
            //var url = serviceUrl + "KPIHandlerTBC/getKPIDataTBC";
            //var promise = $http.post(url, request);
            //return (promise.then(handleSuccess, handleError));
            return (helperService.getRandomNumberArray(10, 20, 30, 2));
        }

        function getnetworkkpiData(request)
        {
            var url = serviceUrl + "KPIHandler/getKPINetworkLevel";
            var promise = $http.post(url, request);
            return (promise.then(handleSuccess, handleError));
        }

        function getTechnologykpiData(request) {
            var url = serviceUrl + "KPIHandler/getKPITechnologyLevel";
            var promise = $http.post(url, request);
            return (promise.then(handleSuccess, handleError));
        }

        function getkpiHierarchyData(request) {
            var url = serviceUrl + "KPIHandler/getKPIHierarchy";
            var promise = $http.post(url, request);
            return (promise.then(handleSuccess, handleError));
        }

        function handleError(response) {
            var errorMessage = JSON.stringify(response);
            //alert("Error: " + errorMessage);
            if (!angular.isObject(response.data) || !response.data.message) {
                return ($q.reject("An unknown error occurred."));
            }
            return ($q.reject(response.data.message));
        }

        function handleSuccess(response) {
            return (response.data);
        }

        return ({
            getkpiData: getkpiData,
            getnetworkkpiData: getnetworkkpiData,
            getTechnologykpiData: getTechnologykpiData,
            getkpiHierarchyData: getkpiHierarchyData
        });
    });
}());
