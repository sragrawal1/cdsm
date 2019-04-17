(function () {
    'use strict';

    cdsmApp.controller('chartEditorController', function chartEditorController($scope, $routeParams, $timeout, globalService, commonService, $rootScope, helperService) {
        var currentChartPanel = null;
        var originalChartPanel = null;

        initialization();

        function initialization() {

            try {
                originalChartPanel = $scope.$parent.$parent.$parent.selectedChartPanel;
                currentChartPanel = angular.copy(originalChartPanel);
                $scope.currentChartPanel = currentChartPanel;

                $scope.elementchange = elementchange;
                $scope.onaxischange = onaxischange;
                $scope.applyChartOptions = applyChartOptions;;

                settingAxis();

                $timeout(elementchange(currentChartPanel.kpis[0], currentChartPanel.kpis), 100);
                $timeout(onaxischange(currentChartPanel.chartAxisOptions[0], currentChartPanel.chartAxisOptions), 100);

                
            } catch (e) {
                alert(e);
            }
        }

        function settingAxis()
        {
            try {
                var objectAxisType = [];
                objectAxisType.push({ text: "YOne", value: "YOne" });
                if (currentChartPanel.kpis.length > 1) {
                    objectAxisType.push({ text: "YTwo", value: "YTwo" });
                }
                $scope.axisDataSource = objectAxisType;
            } catch (e) {
                alert(e);
            }
        }

        function elementchange(kpi, allKpis) {
            try {
                if (allKpis == null && allKpis.length == 0) {
                    return;
                }
                for (var i = 0; i < allKpis.length; i++) {
                    allKpis[i].active = "";
                }
                if (kpi != null) {
                    kpi.active = "active";
                }
                //var elementlist = document.getElementById("elementlist");
                assignSeriesOptions(kpi, allKpis);
            } catch (e) {
                alert(e);
            }
            
        }


        function onaxischange(selectedOption, allOptions) {
            try {
                if (allOptions == null || allOptions.length == 0) {
                    return;
                }
                for (var i = 0; i < allOptions.length; i++) {
                    allOptions[i].active = "";
                }
                if (selectedOption != null) {
                    selectedOption.active = "active";
                }
                //var axisSelected = $('#selAxis');
                assignAxisOptions(selectedOption, allOptions);
            } catch (e) {
                alert(e);
            }
        }

        function assignSeriesOptions(kpi, allKpis) {
            try {
                var chartSeries;
                var index;
                index = currentChartPanel.kpis.map(function (x) { return x.kpiId; }).indexOf(kpi.kpiId);
                chartSeries = currentChartPanel.kpis[index];
                $scope.chartSeries = chartSeries;
            } catch (e) {
                alert(e);
            }
            
        }

        function assignAxisOptions(selectedOption, allOptions) {
            try {
                var index = currentChartPanel.chartAxisOptions.map(function (x) { return x.name; }).indexOf(selectedOption.name);
                $scope.axisOptions = currentChartPanel.chartAxisOptions[index];
            } catch (e) {
                alert(e);
            }
        }

        function applyChartOptions() {
            try {
                originalChartPanel = currentChartPanel;
                $rootScope.$broadcast('chartOptionChanged', { chartPanel: originalChartPanel });

            } catch (e) {
                alert(e);
            }
        }

        $scope.numericOptions = {
            decimals: 0,
            step: 10
        }


    });
}());