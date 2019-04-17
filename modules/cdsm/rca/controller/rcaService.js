/**
 * Created by Sanjay on 07/19/2016.
 */

(function () {
    'use strict';

    cdsmApp.factory('rcaService', function ($http, $q, commonService) {
        var serviceUrl = commonService.serviceUrl;

        function getrcaData(request) {
            var url = serviceUrl + "RCAHandler/getRCAData";
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
            getrcaData: getrcaData,
        });
    });
}());
