(function () {
    'use strict';
    cdsmApp.factory('helperService', function () {
        
        function getNextDayOfWeek(date, dayOfWeek) {
            var resultDate = new Date(date.getTime());
            resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
            return resultDate;
        }


        function getRandomNumber(min,max,decimalPrecision)
        {
            if (decimalPrecision == undefined) decimalPrecision = 0;
            return (Math.random() * (max - min + 1) + min).toFixed(decimalPrecision);
        }

        function getRandomNumberArray(len,min, max, decimalPrecision)
        {
            var randomArray = [];
            for (var i = 0; i < len; i++) {
                randomArray.push(getRandomNumber(min, max, decimalPrecision));
            }
            return randomArray;
        }

        function getDateDiff(date1, date2) {
            return date1.getTime() - date2.getTime();
        }

        return ({
            getNextDayOfWeek: getNextDayOfWeek,
            getRandomNumber: getRandomNumber,
            getRandomNumberArray: getRandomNumberArray,
            getDateDiff: getDateDiff
        });
    });
}());