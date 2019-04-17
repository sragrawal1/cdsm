/**
 * Created by Sanjay 
 */

(function () {
    'use strict';

    cdsmApp.factory('otherService', function ($http, $q, commonService, helperService) {
        var serviceUrl = commonService.serviceUrl;

        

        function getNetworkScoreData(request)
        {
            var url = serviceUrl + "CDSMHandler/getNetworkScore";
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
            getNetworkScoreData: getNetworkScoreData
        });
    });
}());
