(function () {
    'use strict';
    cdsmApp.controller('eventlogController', function eventlogController($scope, globalService, commonService, helperService, $rootScope, $timeout,$route) {
        $rootScope.$broadcast('pageLoaded', { pageName: "Workflow", shortName: "eventlog" });
        $scope.$on('onDateChangeEvent', function () {
            //$scope.selectedDate = globalService.getSelectedDate();
            //$scope.$apply();
        });

        var ranData = [{ category: "High Inteference", value: 9 },
                                        { category: "MAC Random Access Problem", value: 7 },
                                        { category: "Missing Neighbor", value: 7 },
                                        { category: "Poor Coverage", value: 12 },
                                        { category: "T300 Expired", value: 5 },
                                        { category: "T301 Expired", value: 3 },
                                        { category: "T310 Expired", value: 2 },
                                        { category: "T311 Expired", value: 9 },
                                        { category: "500", value: 10 },
                                        { category: "487", value: 1 }

                    ];

        var cnData = [{ category: "403_service Forbidden", value: 4 },
                                        { category: "480_Tempararily Unavailable", value: 4 },
                                        { category: "487_Request Terminated", value: 1 },
                                        { category: "500_Service Terminal Error", value: 11 },
                                        { category: "503_Service Unavailable", value: 14 },
                                        { category: "504_service Time-Out", value: 2 },
                    ];

        var problemData = [
                            {
                                category: "RAN", value: 65 //helperService.getRandomNumber(50, 70, 0)
                            },
                            {
                                category: "EPC", value: 5 //helperService.getRandomNumber(10, 15, 0)
                            },
                            {
                                category: "IMS", value: 15//helperService.getRandomNumber(15, 30, 0)
                            },
                            {
                                category: "Others-MSC/PSTN", value:14 // helperService.getRandomNumber(15, 40, 0)
                            }
                           ];


        //loadFailureCharts();
        $scope.rcaurl = "";
        $scope.sankeyurl = "";
        //$scope.rcaurl = "modules/cdsm/eventlog/rcalog.html";

        loadFailureCharts();
        function loadFailureCharts() {
            generateRANErrorDistribution([{ category: "", value: 1 }]);
            generateCNErrorCodeDistributionChart([{ category: "", value: 1 }]);
            generateProblemCategorizationChart([{ category: "", value: 1 }]);
        }


        $scope.$on('rcaMessageLoaded', function (event, args) {
            //alert('log finish event handled');
            switch (args.category) {
                case "RANKPIs":
                    generateRANErrorDistribution(ranData);
                    $scope.rcaurl = "modules/cdsm/eventlog/rcalog.html";
                case "AnalyzeProtocol":
                    generateCNErrorCodeDistributionChart(cnData);
                    break;
                case "PerformingCrossdomainanalytics":
                    $scope.sankeyurl = "modules/cdsm/sanKey/sanKey.html"
                    //generateProblemCategorizationChart(problemData);
                    //$timeout($route.reload, 1500);
                    break;
                default:
                    break;
            }
        });



        


        function generateRANErrorDistribution(data) {
            $("#RANErrorCodeDistribution").kendoChart({
                //title: {
                //    text: "",
                //    visible : false
                //},
                //chartArea: {
                //    width: 200,
                //    height: 200
                //},
                legend: {
                    position: "bottom",
                    labels: {
                        font: "11px 'open sans'",
                        color: "gray"
                    },

                },
                seriesDefaults: {
                    holeSize: 40,
                    labels: {
                        //template: "#= category # - #= kendo.format('{0:P}', percentage)#",
                        position: "center",
                        //position: "outsideEnd",
                        visible:  data.length>1 ? true: false,
                        background: "transparent",
                        font: "9px",
                    },
                    overlay: {
                        gradient: "none"
                    }
                },
                series: [
                            {
                                type: "donut",
                                data: data
                            }
                ],
                seriesColors: data.length > 1 ? ['#1ab394', '#f8ac59', '#23c6c8', '#ed5565', '#98df8a', '#1f77b4', '#aec7e8', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'] : ['#BABABA'],
                tooltip: {
                    visible: true,
                    template: "#= category # - #= kendo.format('{0:P}', percentage) #"
                }
            });

        }



        function generateCNErrorCodeDistributionChart(data) {
            $("#CNErrorCodeDistribution").kendoChart({
                //title: {
                //    text: "",
                //    visible : false
                //},
                legend: {
                    position: "bottom",
                    labels: {
                        font: "11px 'open sans'",
                        color: "gray"
                    }
                },
                seriesDefaults: {
                    holeSize: 40,
                    labels: {
                        //template: "#= category # - #= kendo.format('{0:P}', percentage)#",
                        position: "center",
                        //position: "outsideEnd",
                        visible: data.length > 1 ? true : false,
                        background: "transparent",
                        font: "9px"
                    },
                    overlay: {
                        gradient: "none"
                    }
                },
                series: [
                            {
                                type: "donut",
                                data: data
                            }
                ],
                seriesColors: data.length > 1 ? ['#1ab394', '#f8ac59', '#23c6c8', '#ed5565', '#98df8a', '#1f77b4', '#aec7e8', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'] : ['#BABABA'],
                tooltip: {
                    visible: true,
                    template: "#= category # - #= kendo.format('{0:P}', percentage) #"
                }
            });

        }

        function generateProblemCategorizationChart(data) {
            $("#ProblemCategorization").kendoChart({
                //title: {
                //    text: "",
                //    visible : false
                //},
                legend: {
                    position: "bottom",
                    labels: {
                        font: "11px 'open sans'",
                        color: "gray"
                    }
                },
                seriesDefaults: {
                    holeSize: 40,
                    labels: {
                        //template: "#= category # - #= kendo.format('{0:P}', percentage)#",
                        position: "center",
                        //position: "outsideEnd",
                        visible: data.length > 1 ? true : false,
                        background: "transparent",
                        font: "9px"
                    },
                    overlay: {
                        gradient: "none"
                    }
                },
                series: [
                            {
                                type: "donut",
                                data: data
                            }
                ],
                seriesColors: data.length > 1 ? ['#1ab394', '#f8ac59', '#23c6c8', '#ed5565', '#98df8a', '#1f77b4', '#aec7e8', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'] : ['#BABABA'],
                tooltip: {
                    visible: true,
                    template: "#= category # - #= kendo.format('{0:P}', percentage) #"
                }
            });
        }


        $scope.reAnalyze = function()
        {
            //$location.path('/eventlog');
            //$scope.$apply();

            $route.reload();
        }

    });
}());