(function () {
    'use strict';
    cdsmApp.controller('failureController', function failureController($scope, globalService, commonService, helperService, $rootScope, $timeout, $location, $http, $localStorage) {
        initFailureCharts();
        $timeout(loadData, 1000);

        $scope.diagramMode = "expand";
        $scope.diagramFullScreen = diagramFullScreen;
        $timeout(setDiagramheight, 1000);
        function setDiagramheight() {
            //alert('Window Height:' + $(window).height() + " Window width:" + $(window).width() + " Document Height:" + $(document).height() + " Document Width:" + $(document).width() + 'Header:' + $("#cdsmHeader").height() + " Content:" + $("#cdsmContent").height() + " Footer:" + $("#cdsmFooter").height() + " Diagram:" + $("#networkDiagramDiv").height() + " Dashboard Top:" + $("#dashboardTop").height());
            $("#networkDiagramDiv").height($("#cdsmContent").height() - $("#failureTop").height() - 77 + 15);
        }

        $rootScope.$broadcast('pageLoaded', { pageName: "Failures", shortName: "failure" });

        $scope.$on('rcaMessageLoaded', function (event, args) {
            switch(args.category) {
                case "FinalizingErrordomains":
                    break;
                case "Finalizingrootcauseofthefailures":
                    generateRANErrorDistribution();
                    generateCNErrorCodeDistributionChart();
                    var rcaWindow = $("#RCALogWindow").data("kendoWindow");
                    rcaWindow.close();
                    break;
                default:
                    break;
            }
        });

        function initFailureCharts()
        {
            try {
                $scope.CNErrorCodeDistributionChartOptions = {
                    dataSource: { data: null },
                    legend: {
                        position: "bottom",
                        labels: {
                            font: "11px 'open sans'",
                            color: "gray",
                            //margin: { right: 8 }
                        }
                    },
                    seriesDefaults: {
                        type: "donut",
                        holeSize: 40,
                        labels: {
                            //template: "#= category # - #= kendo.format('{0:P}', percentage)#",
                            position: "center",
                            //position: "outsideEnd",
                            visible: true,
                            background: "transparent",
                            font: "9px"
                        },
                        overlay: {
                            gradient: "none"
                        }
                    },
                    series: [
                                {
                                    field: "value",
                                    categoryField: "category"
                                }
                    ],
                    seriesColors: ['#1ab394', '#f8ac59', '#23c6c8', '#ed5565', '#98df8a', '#1f77b4', '#aec7e8', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],
                    tooltip: {
                        visible: true,
                        template: "#= category # - #= kendo.format('{0:P}', percentage) #"
                    },
                    seriesClick: onCNErrorCodeDistributionClick,
                };


                $scope.RANErrorCodeDistributionChartOptions = {
                    dataSource: { data: null },
                    legend: {
                        position: "bottom",
                        labels: {
                            font: "11px 'open sans'",
                            color: "gray",
                            //margin: {right:8}
                        },

                    },
                    seriesDefaults: {
                        type: "donut",
                        holeSize: 40,
                        labels: {
                            //template: "#= category # - #= kendo.format('{0:P}', percentage)#",
                            position: "center",
                            //position: "outsideEnd",
                            visible: true,
                            background: "transparent",
                            font: "9px",
                        },
                        overlay: {
                            gradient: "none"
                        }
                    },
                    series: [
                                     {
                                         field: "value",
                                         categoryField: "category"
                                     }
                    ],
                    seriesColors: ['#1ab394', '#f8ac59', '#23c6c8', '#ed5565', '#98df8a', '#1f77b4', '#aec7e8', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],
                    tooltip: {
                        visible: true,
                        template: "#= category # - #= kendo.format('{0:P}', percentage) #"
                    },
                    seriesClick: onRANDistributionClick,
                };
            } catch (e) {
                alert(e);
            }
        }

        function diagramFullScreen(mode) {
            try {
                var failureTopHeight = $("#failureTop").height();
                if (mode == 'expand') {
                    $scope.diagramMode = 'compress';
                    $("#failureTop").hide();
                    $("#networkDiagramDiv").height($("#networkDiagramDiv").height() + failureTopHeight);
                }
                if (mode == 'compress') {
                    $scope.diagramMode = 'expand';
                    $("#failureTop").show();
                    $("#networkDiagramDiv").height($("#networkDiagramDiv").height() - failureTopHeight);
                }
            } catch (e) {
                alert(e);
            }
        }

        $scope.$on('onDateChangeEvent', function () {
            //$scope.selectedDate = globalService.getSelectedDate();
            //$scope.$apply();
            loadData();
        });

        function onDomainCategorizationClick(e)
        {
            try {
                globalService.setCurrentDomain(e.dataItem.name);
                $location.path('/rca');
                $scope.$apply();

            } catch (e) {
                alert(e);
            }
        }

        function onRANDistributionClick(e) {
            try {
                globalService.setCurrentDomain("RAN");
                $location.path('/rca');
                $scope.$apply();

            } catch (e) {
                alert(e);
            }
        }

        function onCNErrorCodeDistributionClick(e) {
            try {
                globalService.setCurrentDomain("IMS");
                $location.path('/rca');
                $scope.$apply();

            } catch (e) {
                alert(e);
            }
        }

        $scope.kRCALogWindowOptions = {
            title: "RCA Call Flow/Log",
            modal: true,
            visible: false,
            resizable: false,
            width: 650,
            scrollable: false,
            //position: {
            //    top: 250, // or "100px"
            //    left: "15%"
            //},
        };

        function showRCALogPopup() {
            try {
                var element = $("#RCALogWindow");
                if (element == null) {
                    alert("element is null");
                    return;
                }
                var kWindow = element.data("kendoWindow");
                if (kWindow == null) {
                    alert("kWindow is null");
                    return;
                }
                kWindow.center().open();
            }
            catch (e) {
                alert(e);
            }
            finally {
            }
        };

        function loadData()
        {
            try {
                var requestDate = kendo.toString(kendo.parseDate(globalService.getSelectedDate()), 'yyyy-MM-dd');
                if (commonService.isStaticData()) {
                    requestDate = "Date" + (new Date().getDate() - globalService.getSelectedDate().getDate());
                    var data = $localStorage.failureData;
                    var filteredData = $.grep(data, function (e) { return e.date == requestDate });

                    if (filteredData.length > 0)
                    {
                    filteredData = filteredData[0];
                    $scope.CNErrorCodeDistributionChartOptions.dataSource.data = filteredData["CNErrorCodeDistribution"];
                    $scope.RANErrorCodeDistributionChartOptions.dataSource.data = filteredData["RANErrorDistribution"];
                    $scope.sanKeynodeData = filteredData["sanKeynodeData"];
                    $scope.sanKeyLinkData = filteredData["sanKeyLinkData"];
                    $scope.$apply();
                    $rootScope.$broadcast('reloadSankey');
                    }
                }
                else {
                }
            } catch (e) {
                alert(e);
            }
        }

    });
}());