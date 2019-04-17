(function () {
    'use strict';

    cdsmApp.factory('commonService', function () {
        var staticData = true;
        var serviceUrl = 'http://localhost:8080/CDSMService/rest/';
        var jsonUrl = 'http://localhost/VoLTE_E2E.UI/app/modules/e2e/index/data/E2EFlowChartLayoutJS.json';
        //SQLLAB01
        //var serviceUrl = 'http://sqllab01:8080/E2EService/rest/';
        //var jsonUrl = 'http://sqllab01/VoLTE_E2E.UI/app/modules/e2e/index/data/E2EFlowChartLayoutJS.json';

        var pageSize = 20;
        var setBusyIndicator = function (elementId, isBusy) {
            kendo.ui.progress($("#" + elementId), isBusy);
        };
        var setMainBusyIndicator = function (isBusy) {
            kendo.ui.progress($('#page-wrapper'), isBusy);
        };

        var gridOptions = {
            groupable: true,
            sortable: true,
            filterable: true,
            resizable: true,
            reorderable: true,
            columnMenu: true,
            scrollable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            excel: {
                allPages: true,
                fileName: "Grid Export.xlsx"
            }
        };

        var enableConsoleLogging = false;

        function getGranularity() {
            var granularity = [{
                id: 1,
                name: '5 MIN',
                range: { min: -288, max: -1, value: -24 },
                active: "",
                formatTemplate: "#= kendo.toString(kendo.parseDate(value), 'MMM dd hh:mm tt') #",
                altname: '5 Min'
            }, {
                id: 2,
                name: '15 MIN',
                range: { min: -288, max: -1, value: -24 },
                active: "",
                formatTemplate: "#= kendo.toString(kendo.parseDate(value), 'MMM dd hh:mm tt') #",
                altname: '15 Min'
            }, {
                id: 3,
                name: 'HOURLY',
                range: { min: -120, max: -1, value: -24 },
                active: "active",
                formatTemplate: "#= kendo.toString(kendo.parseDate(value), 'MMM dd hh tt') #",
                altname: 'Hourly'
            }, {
                id: 4,
                name: 'DAILY',
                range: { min: -45, max: 0, start: -7, end: 0 },
                active: "",
                formatTemplate: "#= kendo.toString(kendo.parseDate(value), 'MMM dd') #",
                altname: 'Daily'
            }];

            return granularity;
        }

        function showGoAwayMessage(messageType,messageDescription,messageTitle)
        {
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "progressBar": true,
                "preventDuplicates": false,
                "positionClass": "toast-top-right",
                "onclick": null,
                "showDuration": "400",
                "hideDuration": "1000",
                "timeOut": "7000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }


            switch (messageType) {
                case "success":
                    toastr.success(messageDescription, messageTitle);
                    break;
                case "info":
                    toastr.info(messageDescription, messageTitle);
                    break;
                case "warning":
                    toastr.warning(messageDescription, messageTitle);
                    break;
                case "error":
                    toastr.error(messageDescription, messageTitle);
                    break;
                default:
                    toastr.info(messageDescription, messageTitle);
                    break;
            }
        }

        function isStaticData() {
            return staticData;
        }

        return ({
            serviceUrl: serviceUrl,
            setBusyIndicator: setBusyIndicator,
            setMainBusyIndicator: setMainBusyIndicator,
            pageSize: pageSize,
            gridOptions: gridOptions,
            enableConsoleLogging: enableConsoleLogging,
            jsonUrl: jsonUrl,
            getGranularity: getGranularity,
            showGoAwayMessage: showGoAwayMessage,
            isStaticData: isStaticData
        });
    });

    $(window).on("resize", function () {
        kendo.resize($(".chart-wrapper"));
    });
}());