(function () {
    'use strict';
    cdsmApp.controller('dashboardController', function dashboardController($scope, globalService, commonService, helperService, $rootScope, $timeout, $location, $http,kpiService,otherService,$localStorage) {
        $scope.diagramMode = "expand";
        $scope.diagramFullScreen = diagramFullScreen;
        $rootScope.$broadcast('pageLoaded', { pageName: "Dashboard", shortName: "dashboard" });

        $scope.$on('onDateChangeEvent', function () {
            $scope.selectedDate = globalService.getSelectedDate();
            loadData();
        });

        $timeout(loadData, 500);
        $timeout(setDiagramheight, 1000);

        $(document).ready(function () {
            //alert("Doc Ready-" + new Date());
            //loadData();
        });

        function setDiagramheight()
        {
            $("#networkDiagramDiv").height($("#cdsmContent").height() - $("#dashboardTop").height()-77+15);
        }
        
        function diagramFullScreen(mode)
        {
            try {
                var dashboardTopHeight = $("#dashboardTop").height();
                if (mode == 'expand') {
                    $scope.diagramMode = 'compress';
                    $("#dashboardTop").hide();
                    $("#networkDiagramDiv").height($("#networkDiagramDiv").height() + dashboardTopHeight);
                }
                if (mode == 'compress') {
                    $scope.diagramMode = 'expand';
                    $("#dashboardTop").show();
                    $("#networkDiagramDiv").height($("#networkDiagramDiv").height() - dashboardTopHeight);
                }
            } catch (e) {
                alert(e);
            }
        }

        function getNetworkScrore() {

            try {
                var requestDate = kendo.toString(kendo.parseDate(globalService.getSelectedDate()), 'yyyy-MM-dd');
                commonService.setBusyIndicator('scoreChart', true);

                if (commonService.isStaticData()) {
                    requestDate = "Date" + (new Date().getDate() - globalService.getSelectedDate().getDate());
                    var data = $localStorage.networkScoreData;
                    var filteredData = $.grep(data, function (e) { return e.date == requestDate });
                    onNetworkScoreDataLoaded(filteredData.length > 0 ? filteredData[0].data : null);
                    
                }
                else {
                    var para;
                    para = {
                        "RequestedUser": {
                            "userId": 0,
                            "userName": "string",
                            "userGroup": "string",
                            "preferences": {},
                            "authToken": "string"
                        },
                        "RequestedStartDate": requestDate,
                        "RequestedEndDate": requestDate
                    }
                    otherService.getNetworkScoreData(para).then(function (data) {
                        onNetworkScoreDataLoaded(data);
                    });
                }
            } catch (e) {
                alert(e);
            }
        }

        function onNetworkScoreDataLoaded(data)
        {
            try {
                if (data != null) {
                    $scope.scoreDetails = data.scoreDetails;
                    generateScoreChart();
                    $scope.$apply();
                }
            } catch (e) {
                alert(e);
            }
            finally {
                commonService.setBusyIndicator('scoreChart', false);
            }
        }

        function generateScoreChart()
        {
            var networkScoreChartOptions = {
                dataSource: { data: $scope.scoreDetails },
                title: {
                    //text: "Title"
                },
                legend: {
                    visible: true,
                    position: "bottom",
                    labels: {
                        font: "11px 'open sans'",
                        color: "gray"
                    },
                    //background: "lightgray",
                },
                seriesDefaults: {
                    type: "bar",
                    labels: {
                        visible: false,
                        position: "center"
                        //format: "{0}%"
                    },
                    gap: 5,
                    overlay: {
                        gradient: "none"
                    },
                    border: { width: 0 }
                },
                series: [{
                            name: "Accessibility",
                            field: "accessibility"
                            },
                {
                    name: "Retainability",
                    field: "retainability"
                },
                {
                    name: "Mobility",
                    field: "mobility"
                },
                {
                    name: "Utilization",
                    field: "utilization"
                }

                ],
                valueAxis: {
                    // max: 140000,
                    line: {
                        visible: false
                    },
                    minorGridLines: {
                        visible: false
                    },
                    majorGridLines: {
                        visible: false
                    },
                    labels: {
                        visible: false,
                        //rotation: "auto"
                    }
                },
                categoryAxis: {
                    field: "technology",
                    color: ["#ff0000", "green"],
                    labels: {
                        font: "10px",

                    },
                    majorGridLines: {
                        visible: false
                    }
                },
                tooltip: {
                    visible: true,
                    template: "#= series.name #: #= value #"
                },
                seriesColors: ['#1ab394', '#bababa', '#ffbb78', '#98df8a', '#98df8a', '#1f77b4', '#aec7e8', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
            };
            $scope.networkScoreChartOptions = networkScoreChartOptions;
        }

        function getdashboardKPI()
        {
            try {
                var requestDate = kendo.toString(kendo.parseDate(globalService.getSelectedDate()), 'yyyy-MM-dd');
                commonService.setBusyIndicator('divTechnologyKPI', true);

                if (commonService.isStaticData()) {
                    requestDate = "Date" + (new Date().getDate() - globalService.getSelectedDate().getDate());
                    var data = $localStorage.technologyKPIData;
                    var filteredData = $.grep(data, function (e) { return e.date == requestDate });
                    onTechnologyKPIDataLoaded(filteredData.length > 0 ? filteredData[0].data : null);

                    
                }
                else {
                    var para;
                    para = {
                        "RequestedUser": {
                            "userId": 0,
                            "userName": "string",
                            "userGroup": "string",
                            "preferences": {},
                            "authToken": "string"
                        },
                        "RequestedStartDate": requestDate,
                        "RequestedEndDate": requestDate
                    }
                    kpiService.getTechnologykpiData(para).then(function (data) {
                        onTechnologyKPIDataLoaded(data);
                    });
                }
            } catch (e) {
                alert(e);
            }
        }

        function onTechnologyKPIDataLoaded(data)
        {
            try {
                if(data != null)
                {
                    $scope.technologyKPIs = data.kpiDetails;
                    $scope.$apply();
                }
            } catch (e) {
                alert(e);
            }
            finally {
                commonService.setBusyIndicator('divTechnologyKPI', false);
            }
        }

        function getFailures() {

            try {
                var requestDate = kendo.toString(kendo.parseDate(globalService.getSelectedDate()), 'yyyy-MM-dd');
                commonService.setBusyIndicator('divNetworkFailure', true);
                requestDate = "Date" + (new Date().getDate() - globalService.getSelectedDate().getDate());

                var data = $localStorage.technologyFailureData;
                var filteredData = $.grep(data, function (e) { return e.date == requestDate });
                if (filteredData.length > 0) {
                    $scope.LTEfailureChart = filteredData[0].data["LTEfailure"];
                    $scope.VoLTEfailureChart = filteredData[0].data["VoLTEfailure"];
                    $scope.VoWififailureChart = filteredData[0].data["VoWififailure"];
                }
                generatefailureCharts();
                commonService.setBusyIndicator('divNetworkFailure', false);


                
            } catch (e) {
                alert(e);
            }
        }

        function generatefailureCharts() {
            generatesparkChartforLTE();
            generatesparkChartforVoLTE();
            generatesparkChartforVoWifi();
        }

        function generatesparkChartforLTE() {
            var data;
            data = intArraygenerator(10, 20, 40);

            $("#divLTESpark").kendoSparkline({
                type: "column",
                seriesDefaults: {
                    type: "column",
                   // spacing: 0,
                    gap: 0.7,
                    overlay: {
                        gradient: "none"
                    }
                },
                series: $scope.LTEfailureChart,
                tooltip: {
                    format: "{0}",
                    visible : false
                    //template: "#= series.name #: #= value #"
                },
                seriesColors: ['#24245a', '#98df8a', 'darkgray', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
            });

        }

        function generatesparkChartforVoLTE() {
            var data;
            data = intArraygenerator(10, 20, 40);

            $("#divVoLTESpark").kendoSparkline({
                type: "column",
                seriesDefaults: {
                    type: "column",
                    // spacing: 0,
                    gap: 0.7,
                    overlay: {
                        gradient: "none"
                    }
                },
                series: $scope.VoLTEfailureChart,
                tooltip: {
                    format: "{0}",
                    visible: false
                    //template: "#= series.name #: #= value #"
                },
                plotAreaClick: onVoLTEplotAreaClick,
                seriesColors: ['#24245a', '#98df8a', 'darkgray', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
            });

        }

        function generatesparkChartforVoWifi() {
            var data;
            data = intArraygenerator(10, 20, 40);

            $("#divVoWifiSpark").kendoSparkline({
                type: "column",
                seriesDefaults: {
                    type: "column",
                    // spacing: 0,
                    gap: 0.7,
                    overlay: {
                        gradient: "none"
                    }
                },
                series: $scope.VoWififailureChart,
                tooltip: {
                    format: "{0}",
                    visible: false
                    //template: "#= series.name #: #= value #"
                },
                seriesClick: onFailureSeriesClick,
                seriesColors: ['#24245a', '#98df8a', 'darkgray', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
            });

        }

        function onFailureSeriesClick(e) {
            
        }

        function onVoLTEplotAreaClick(e)
        {
            $location.path('/failure');
            $scope.$apply();
        }

        function intArraygenerator(min,max,length)
        {
            var intArray = [];
            for (var i = 0; i < length; i++) {
                intArray.push(helperService.getRandomNumber(min ,max,0));
            }
            return intArray;
        }

        function loadData()
        {
            getdashboardKPI();
            getNetworkScrore();
            getFailures();
        }
    });
}());