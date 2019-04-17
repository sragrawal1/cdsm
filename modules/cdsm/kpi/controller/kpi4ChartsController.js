(function () {
    'use strict';
    cdsmApp.controller('kpi4ChartsController', function kpi4ChartsController($scope, globalService, commonService, helperService, $rootScope, $timeout) {
        
        $scope.$on('onDateChangeEvent', function () {
            $scope.selectedDate = globalService.getSelectedDate();
            $scope.$apply();
        });
        $scope.showChartFilter = showChartFilter;


        $scope.kpiFilterWindowOptions = {
            title: "KPI Filters",
            modal: true,
            visible: false,
            //resizable: false,
            //width: 650,
            //height: 450,
            //maxHeight: 800,
            //scrollable: false,
            //position: {
            //    top: 250, // or "100px"
            //    left: "15%"
            //},
            minHeight: 300,
            minWidth: 500,
            maxHeight: 900,
            maxWidth: 1200
        };
        setChartScopes();

        function showChartFilter(chartPanel) {
            showKPIFilterPopup(chartPanel);
        }

        function showKPIFilterPopup(chartPanel) {
            try {
                $scope.selectedChartPanel = chartPanel;
                var element = $("#kpiFilterWindow");
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
                //kWindow.open();

                //$timeout(function () { createKPIFilterTree(chartPanel) }, 200);
            }
            catch (e) {
                alert(e);
            }
            finally {
            }
        };

        function setChartScopes()
        {
            var chartOptions = {

                title: {
                    //text: "Gross domestic product growth /GDP annual %/"
                },
                legend: {
                    position: "bottom"
                },
                seriesDefaults: {
                    type: "column"
                },
                series: [{
                    name: "AbortSession_Attempts",
                    data: [3.907, 7.943, 7.848, 9.284, 9.263, 9.801, 3.890, 8.238, 9.552, 6.855]
                }, {
                    name: "AbortSession_Failures",
                    data: [4.743, 7.295, 7.175, 6.376, 8.153, 8.535, 5.247, 7.832, 4.3, 4.3]
                }, {
                    name: "AuthenticationAuthorization_Failures",
                    data: [0.010, 0.375, 1.161, 0.684, 3.7, 3.269, 1.083, 5.127, 3.690, 2.995]
                }, {
                    name: "AuthenticationAuthorization_Failures",
                    data: [1.988, 2.733, 3.994, 3.464, 4.001, 3.939, 1.333, 2.245, 4.339, 2.727]
                }],
                valueAxis: {
                    labels: {
                        format: "{0}%"
                    },
                    line: {
                        visible: false
                    },
                    axisCrossingValue: 0
                },
                categoryAxis: {
                    categories: ['07/21/2016', '07/22/2016', '07/23/2016', '07/24/2016', '07/25/2016', '07/26/2016', '07/27/2016', '07/28/2016', '07/29/2016', '07/30/2016'],
                    line: {
                        visible: false
                    },
                    labels: {
                        //padding: {top: 135}
                    }
                },
                seriesColors: ['#1ab394', '#f8ac59', '#23c6c8', '#ed5565', '#98df8a', '#1f77b4', '#aec7e8', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],
                tooltip: {
                    visible: true,
                    format: "{0}%",
                    template: "#= series.name #: #= value #"
                }
            };

            var diameterChartOptions = jQuery.extend(true, {}, chartOptions);
            diameterChartOptions.series = [
                                            {
                                                name: "AbortSession_Attempts",
                                                data: [3.907, 7.943, 7.848, 9.284, 9.263, 9.801, 3.890, 8.238, 9.552, 6.855]
                                            }, {
                                                name: "AbortSession_Failures",
                                                data: [4.743, 7.295, 7.175, 6.376, 8.153, 8.535, 5.247, 7.832, 4.3, 4.3]
                                            }, {
                                                name: "AuthenticationAuthorization_Failures",
                                                data: [0.010, 0.375, 1.161, 0.684, 3.7, 3.269, 1.083, 5.127, 3.690, 2.995]
                                            }, {
                                                name: "AuthenticationAuthorization_Failures",
                                                data: [1.988, 2.733, 3.994, 3.464, 4.001, 3.939, 1.333, 2.245, 4.339, 2.727]
                                            }
                                        ];
            
            $scope.diameterChartOptions = diameterChartOptions;


            var GTPV2ChartOptions = jQuery.extend(true, {}, chartOptions);
            GTPV2ChartOptions.series = [
                                            {
                                                name: "CreateBearer_Attempts",
                                                data: [0.010, 0.375, 1.161, 0.684, 3.7, 3.269, 1.083, 5.127, 3.690, 2.995]
                                            }, {
                                                name: "CreateBearer_Failures",
                                                data: [3.907, 7.943, 7.848, 9.284, 9.263, 9.801, 3.890, 8.238, 9.552, 6.855]
                                            }, {
                                                name: "CreateIndirectDataForwardingTunnel_Failures",
                                                data: [4.743, 7.295, 7.175, 6.376, 8.153, 8.535, 5.247, 7.832, 4.3, 4.3]
                                            }, {
                                                name: "CreateIndirectDataForwardingTunnel_Failures",
                                                data: [1.988, 2.733, 3.994, 3.464, 4.001, 3.939, 4.333, 2.245, 4.339, 2.727]
                                            }
            ];

            $scope.GTPV2ChartOptions = GTPV2ChartOptions;


            var S1APChartOptions = jQuery.extend(true, {}, chartOptions);
            S1APChartOptions.series = [
                                            {
                                                name: "DedicatedEPSBearerContextActivation_Attempts",
                                                data: [0.010, 0.375, 3.269, 1.083, 5.127, 3.690, 2.995, 1.161, 0.684, 3.7]
                                            }, {
                                                name: "DedicatedEPSBearerContextActivation_Failures",
                                                data: [6.376, 8.153, 8.535, 5.247, 7.832, 4.3, 4.3, 4.743, 7.295, 7.175]
                                            }, {
                                                name: "DefaultEPSBearerContextActivation_Failures",
                                                data: [4.743, 7.295, 7.175, 6.376, 8.153, 8.535, 5.247, 7.832, 4.3, 4.3]
                                            }, {
                                                name: "DefaultEPSBearerContextActivation_Failures",
                                                data: [1.988, 2.733, 3.994, 3.464, 2.245, 4.339, 2.727, 4.001, 3.939, 1.333]
                                            }
            ];

            $scope.S1APChartOptions = S1APChartOptions;



            var RANChartOptions = jQuery.extend(true, {}, chartOptions);
            RANChartOptions.series = [
                                            {
                                                name: "Call Setup Success rate",
                                                data: [3.907, 7.943, 7.848, 9.284, 9.263, 9.801, 3.890, 8.238, 9.552, 6.855]
                                            }, {
                                                name: "RRC setup success rate",
                                                data: [4.743, 7.295, 7.175, 6.376, 8.153, 8.535, 5.247, 7.832, 4.3, 4.3]
                                            }, {
                                                name: "Call Drop Rate",
                                                data: [0.010, 0.375, 1.161, 0.684, 3.7, 3.269, 1.083, 5.127, 3.690, 2.995]
                                            }, {
                                                name: "ERAB Abnormal release",
                                                data: [1.988, 2.733, 3.994, 3.464, 4.001, 3.939, 1.333, 2.245, 4.339, 2.727]
                                            }
            ];

            $scope.RANChartOptions = RANChartOptions;










        }

    });
}());