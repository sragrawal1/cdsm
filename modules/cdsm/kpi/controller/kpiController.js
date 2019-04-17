(function () {
    'use strict';
    cdsmApp.controller('kpiController', function kpiController($scope, globalService, commonService, helperService, kpiService, $rootScope, $timeout,$http) {
        var noMaxCharts = 8;
        var chartHeight = 0;
        $scope.diagramMode = "expand";
        $rootScope.$broadcast('pageLoaded', { pageName: "KPI", shortName: "kpi" });
        $scope.$on('onDateChangeEvent', function () {
            //$scope.selectedDate = globalService.getSelectedDate();
            //$scope.$apply();
            reLoadAllChartData();
        });

        $scope.chartMode = "expand";
        $scope.chartId = 1;

        var dateRange = { startDate: null, endDate: null };
        var slider = null;
        var seriesColors = ["#1B9DDE", "#84C63E", "#E494BB", "#618F6D", "#CF1C1F", "#DD7F33", "#BFAD61", "#8C8C8C", "#F0484B", "#AA5A11", "#3DB35C", "#ECB552", "#7D3B25", "#29C7AD", "#8FCAEE", "#CCE050", "#9D8B00", "#B54824", "#E0D26D", "#FF867F"];
        var numberofColors = seriesColors.length;

        initialize();

        function expandChart(mode, chartId) {
            try {

                if (mode == 'expand') {
                    $scope.chartMode = 'compress';
                    $('#chartPanel' + chartId).parent().toggleClass('col-lg-6 col-lg-12');
                    $('#chartPanel' + chartId).toggleClass('Deselect Select');
                    var chartHeight = getChartHeight(true);
                    $('#Chart' + chartId).css("min-height", chartHeight);
                    $('#Chart' + chartId).css("max-height", chartHeight).data("kendoChart").resize();

                }
                if (mode == 'compress') {
                    $scope.chartMode = 'expand';
                    $('#chartPanel' + chartId).parent().toggleClass('col-lg-12 col-lg-6');
                    $('#chartPanel' + chartId).toggleClass('Select Deselect');
                    var chartHeight = getChartHeight(false) + "px";
                    $('#Chart' + chartId).css("min-height", chartHeight);
                    $('#Chart' + chartId).css("max-height", chartHeight).data("kendoChart").resize();;
                }

                chartHideandShow(chartId, mode === 'compress');

            } catch (e) {
                alert(e);
            }
        }

        function chartHideandShow(excludeId, show) {

            var panels = $('.Deselect');
            show ? panels.show() : panels.hide();
        }

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


        $scope.kChartEditorwindowOptions = {
            title: "Customize CHART",
            modal: true,
            visible: false,
            resizable: false,
            width: 800,
            height: 610,
            scrollable: false
            //minHeight: 800,
            //minWidth: 850
        };

        $scope.kChartPrintWindowOptions = {
            title: "Print CHART",
            modal: true,
            visible: false,
            resizable: true,
            width: 800,
            minHeight: 600,
            maxHeight: 800,
            scrollable: true
        };

        function initialize() {
            $scope.granularity = commonService.getGranularity();
            $scope.granularityClicked = granularityClicked;

            granularityClicked(($scope.granularity[2])); //Daily


            $scope.showChartFilter = showChartFilter;
            $scope.chartPanels = [];
            $scope.reLoadAllChartData = reLoadAllChartData;
            $scope.addNewChart = addNewChart;
            $scope.removeChart = removeChart;
            $scope.expandChart = expandChart;
            $scope.duplicateChart = duplicateChart;
            $scope.onChartExport = onChartExport;
            loadChartswithDefaultKpis();
           

            $scope.setChartHeight = setChartHeight;
        }

        function getChartHeight(MaxHeight) {
            var chartHeight = $(window).height() - ($('#cdsmHeader').height() + $('#title').height() + $('#idChartOptions').height() + $('#cdsmFooter').height());
            if (!MaxHeight) {
                chartHeight = (chartHeight / 2) - 70;
            }
            else {
                chartHeight = chartHeight - (100);
            }
            return chartHeight;
        }

        function setChartHeight(isLast) {

            var chartdiv = $scope.chartMode !== "expand" ? $('div.Select > div.panel-body > div') : $('div.Deselect > div.panel-body > div')
            //if ($scope.chartMode === "expand" && !isLast) return;

            if ($scope.chartMode === "expand") {
                var chartHeight = getChartHeight(false) + "px";
                $(chartdiv).css("min-height", chartHeight).css("max-height", chartHeight);
            }
            else {
                var chartHeight = getChartHeight(true) + "px";
                $(chartdiv).css("min-height", chartHeight).css("max-height", chartHeight);
            }
        }

        function onChartExport(chartPanel, mode) {
            try {
                var chart = $('#Chart' + chartPanel.id).getKendoChart();
                switch (mode) {
                    case "print":
                        break;
                    case "pdf":
                        //chart.exportPDF({ paperSize: "A5", landscape: true }).done(function (data) {
                        //    kendo.saveAs({
                        //        dataURI: data,
                        //        fileName: "chart.pdf"
                        //    });
                        //});
                        chart.saveAsPDF();
                        commonService.showGoAwayMessage("info", 'Save the Chart PDF!!', "Chart PDF");
                        break;
                    case "image":
                        chart.exportImage().done(function (data) {
                            kendo.saveAs({
                                dataURI: data,
                                fileName: "chart.png"
                            });
                        });
                        commonService.showGoAwayMessage("info", 'Save the Chart Image!!', "Chart Image");
                        break;
                    default:
                        break;
                }
            } catch (e) {
                alert(e);
            }
        }

        function duplicateChart(chartPanel) {
            try {
                if (!chartValidation()) return;
                var clonedChart = angular.copy(chartPanel);
                var maxChartID = ($scope.chartPanels.length == 0 ? 0 : Math.max.apply(Math, $scope.chartPanels.map(function (a) { return a.id })));
                var chartId = maxChartID + 1;
                clonedChart.id = chartId;
                clonedChart.title = "Chart No: " + chartId;
                $scope.chartPanels.push(clonedChart);
                commonService.showGoAwayMessage("info", 'Chart Copied!!', "Chart");
            } catch (e) {
                alert(e);
            }
        }

        //function expandChart(mode, chartPanel) {
        //    try {
        //        if (mode == 'expand') {
        //            $scope.diagramMode = 'compress';

        //            for (var i = 0; i < $scope.chartPanels.length; i++) {
        //                var currentChartPanelId = $scope.chartPanels[i].id;
        //                if (chartPanel.id != currentChartPanelId) {
        //                    $("#chartPanel" + currentChartPanelId).hide();
        //                }
        //                else {
        //                    $("#chartPanel" + currentChartPanelId).height($("#chartPanel" + currentChartPanelId).height() * 2);
        //                    $("#chartPanel" + currentChartPanelId).parent().attr('class', 'col-xs-24 col-lg-12');
        //                    $("#Chart" + currentChartPanelId).removeAttr("style");
        //                    $("#Chart" + currentChartPanelId).css({ "height": "750px" }).data("kendoChart").resize();
        //                }
        //            }
        //        }
        //        if (mode == 'compress') {
        //            $scope.diagramMode = 'expand';

        //            for (var i = 0; i < $scope.chartPanels.length; i++) {
        //                var currentChartPanelId = $scope.chartPanels[i].id;
        //                if (chartPanel.id != currentChartPanelId) {
        //                    $("#chartPanel" + currentChartPanelId).show();
        //                }
        //                else {
        //                    $("#chartPanel" + currentChartPanelId).height($("#chartPanel" + currentChartPanelId).height() / 2);
        //                    $("#chartPanel" + currentChartPanelId).parent().attr('class', 'col-xs-12 col-lg-6');
        //                    $("#Chart" + currentChartPanelId).removeAttr("style");
        //                    $("#Chart" + currentChartPanelId).css({ "min-height": "360px", "max-height": "360px" }).data("kendoChart").resize();
        //                }
        //            }
        //        }
        //    } catch (e) {
        //        alert(e);
        //    }
        //}
        $scope.showChartEditorViewpopup = function (chartPanel) {
            $scope.selectedChartPanel = chartPanel;
            try {
                var element = $("#chartEditorWindow");
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

        function gridChartDataOptions(chartDataSource, chartPanel)
        {
            try {
                //gridChartDataOptions(chartDataSource, chartPanel);
                var dataSource = [];

                for (var i = 0; i < chartDataSource.length; i++) {

                    for (var j = 0; j < chartPanel.kpis.length; j++) {
                        dataSource.push({ "date": chartDataSource[i].date, "kpiName": chartPanel.kpis[j].kpiName, "kpiValue": chartDataSource[i][chartPanel.kpis[j].kpiName] });
                    }
                }

                var options = jQuery.extend(true, {}, commonService.gridOptions);
                var columns = [
                    { field: "date", width: "200px", title: "Date", editable: false, headerAttributes: { style: "font-size: 14px;" }, template: "#= kendo.toString(kendo.parseDate(date), 'MMM dd hh:mm tt') #" },
                    { field: "kpiName", width: "200px", title: "KPI Name", editable: false, headerAttributes: { style: "font-size: 14px;" } },
                    { field: "kpiValue", width: "100px", title: "KPI Value", editable: false, headerAttributes: { style: "font-size: 14px;" } },
                ]

                options.columns = columns;
                options.sortable = true;
                options.filterable = true;
                options.resizable = true;
                options.groupable = true;
                options.reorderable = false;
                options.pageable = false;
                options.scrollable = false;
                options.groupable = {
                    messages: {
                        empty: "Drop Group columns here"
                    }
                };
                options.dataSource = { data: dataSource };
                $scope.gridChartDataOptions = options;
            } catch (e) {
                alert(e);
            }
            
        }


        $scope.showChartPrintpopup = function (chartPanel) {

            try {
                $scope.printChartOptions = angular.copy(chartPanel.chartOptions);
                var chartDataSource = $scope.printChartOptions.dataSource.data;
                gridChartDataOptions(chartDataSource, chartPanel);

                var element = $("#chartPrintWindow");
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


        $scope.printChart = printChart;

        function printChart()
        {
            try {
                var mode = 'iframe'; //popup
                var close = mode == "popup";
                var options = { mode: mode, popClose: close };
                $("div#chartPrintArea").printArea(options);
                commonService.showGoAwayMessage("info", "Print Requested!!", 'Chart Print');
            } catch (e) {
                alert(e);
            }
        }

        function getDefaultChartAxisOptions() {
            var chartYOneAxis = { name: "YOne", isAutoScale: true, color: "#1B9DDE", min: 0, max: 100 };
            var chartYTwoAxis = { name: "YTwo", isAutoScale: true, color: "#84C63E", min: 0, max: 100 };

            var chartAxisOptions = [];
            chartAxisOptions.push(chartYOneAxis);
            chartAxisOptions.push(chartYTwoAxis);
            return chartAxisOptions;
        }

        function reLoadAllChartData() {
            try {
                setDateRange();
                for (var i = 0; i < $scope.chartPanels.length; i++) {
                    var chartPanel = $scope.chartPanels[i];
                    getChartData(chartPanel);
                }
            } catch (e) {
                alert(e);
            }
        }


        function granularityClicked(gran) {
            if (gran == null) {
                return;
            }
            var sOptions = {
                min: gran.range.min,
                max: gran.range.max,
                smallStep: 1,
                value: gran.range.value,
                tickPlacement: "bottomRight",
            };

            switch (gran.id) {
                case 1:
                    sOptions.largeStep = 45;
                    sOptions.smallStep = 6;
                    break;
                case 2:
                    sOptions.largeStep = 45;
                    sOptions.smallStep = 6;
                    break;
                case 3:
                    sOptions.largeStep = 24;
                    sOptions.smallStep = 6;
                    break;
                case 4:
                    sOptions.largeStep = 10;
                    sOptions.smallStep = 1;
                    break;
            }

            $("#sliderSpan").empty();

            if (gran.name == "DAILY") {
                $("#sliderSpan").append("<div id='slider' style='width: 270px;'><input /><input /></div>");
                slider = $("#slider").kendoRangeSlider(sOptions).data("kendoRangeSlider");
                slider.value([gran.range.start, gran.range.end]);
            }
            else {
                $("#sliderSpan").append("<input id='slider' style='width: 270px;'/>");

                slider = $("#slider").kendoSlider(sOptions).data("kendoSlider");
                slider.value(sOptions.value);
            }

            $scope.selectedgranularity = gran;
            //SetDateRange();
            //getTrendData();
        }

        function setDateRange() {
            var range = slider.value();
            var selectedgranularity = $scope.selectedgranularity;
            var minvalue, maxvalue;

            var startDate = new Date(globalService.getSelectedDate());
            startDate.setHours(23, 59, 59);

            var endDate = new Date(startDate);

            switch (selectedgranularity.name) {
                case "5 MIN": startDate.setTime(startDate.getTime() + (range * 5 * 60 * 1000)); break;
                case "15 MIN": startDate.setTime(startDate.getTime() + (range * 15 * 60 * 1000)); break;
                case "HOURLY": startDate.setHours(startDate.getHours() + range); break;
                case "DAILY":
                    minvalue = slider.value()[0];
                    maxvalue = slider.value()[1];

                    endDate.setDate(startDate.getDate() + maxvalue);
                    startDate.setDate(startDate.getDate() + minvalue);

                    break;
                case "WEEKLY":
                    endDate = helperService.getNextDayOfWeek(endDate, 6);
                    startDate = new Date(endDate);
                    startDate.setDate(startDate.getDate() + (range * 7) + 1);
                    break;
            }

            dateRange = {
                startDate: startDate,
                endDate: endDate
            };

            //alert('StartDate:' + dateRange.startDate + "\n" + 'EndDate:' + dateRange.endDate);
        }

        function getChartData(chartPanel) {
            if (chartPanel == null || chartPanel.kpis == null || chartPanel.kpis.length == 0) {
                return;
            }
            try {

                commonService.setBusyIndicator('chartDiv' + chartPanel.id, true);
                // return;
                //commonService.setBusyIndicator('Chart1', true);


                //commonService.setBusyIndicator(chartDivElement, true);
                //var para = null;
                //kpiService.getkpiData(para).then(function (data) {
                //    onChartDataLoaded(data, chartPanel);
                //    //commonService.setBusyIndicator(chartDivElement, false);
                //});

                $timeout(function () {
                    var data = []; //helperService.getRandomNumberArray(10, 20, 30, 2);
                    var startTime, endTime;
                    startTime = new Date(dateRange.startDate);
                    endTime = new Date(dateRange.endDate);
                    var selectedgranularity = $scope.selectedgranularity;
                    while (startTime < endTime) {

                        var dataItem = {};
                        dataItem.date = new Date(startTime);
                        for (var i = 0; i < chartPanel.kpis.length; i++) {
                            var currentKpi = chartPanel.kpis[i];
                            dataItem[currentKpi.kpiName] = helperService.getRandomNumber(3, 100, 2);
                        }
                        data.push(dataItem);

                        switch (selectedgranularity.name) {
                            case "5 MIN": startTime.addMinutes(5); break;
                            case "15 MIN": startTime.addMinutes(15); break;
                            case "HOURLY": startTime.addHours(1); break;
                            case "DAILY": startTime.addDays(1); break;
                        }
                    }

                    var sortedData = _.sortBy(data, function (item) {
                        return item.date;
                    });
                    data = sortedData;
                    onChartDataLoaded(data, chartPanel);
                }
                , 500);

            } catch (e) {
                alert(e);
                //commonService.setBusyIndicator(chartDivElement, false);
            }
        }

        function onChartDataLoaded(data, chartPanel) {
            try {
                //alert('Chart Data Loaded' + chartPanel.id);
                setChartOptions(data, chartPanel);
            } catch (e) {
                alert(e);
            }
        }

        function addNewChart() {
            try {

                if (!chartValidation()) return;

                var maxChartID = ($scope.chartPanels.length == 0 ? 0 : Math.max.apply(Math, $scope.chartPanels.map(function (a) { return a.id })));
                var chartId = maxChartID + 1;
                var chartPanel = { id: chartId, title: 'Chart No: ' + chartId };
                chartPanel.kpis = [];
                chartPanel.chartAxisOptions = getDefaultChartAxisOptions();
                chartPanel.chartAxisDateFormat = "Auto";
                $scope.chartPanels.push(chartPanel);

                commonService.showGoAwayMessage("info", 'New Chart Added!!', "Chart");
            } catch (e) {
                alert(e);
            }
        }

        function chartValidation() {
            if ($scope.chartPanels.length == noMaxCharts) {
                commonService.showGoAwayMessage("warning", 'You can not put more than : ' + noMaxCharts + ' Charts', "Chart");
                return false;
            }
            else {
                return true;
            }
        }


        function removeChart(chartPanel) {
            try {
                if (chartPanel != null) {
                    for (var i = 0; i < $scope.chartPanels.length; i++) {
                        var selectedChartPanel = $scope.chartPanels[i];
                        if (selectedChartPanel != null && selectedChartPanel.id == chartPanel.id) {
                            $scope.chartPanels.splice(i, 1);
                            commonService.showGoAwayMessage("info", 'Chart Removed!!', "Chart");
                            break;
                        }
                    }
                }
            } catch (e) {
                alert(e);
            }
        }



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
            }
            catch (e) {
                alert(e);
            }
            finally {
            }
        };

        $scope.$on('chartKPIsChanged', function (event, args) {
            try {
                $("#kpiFilterWindow").kendoWindow("close");
                assignSeriesColor(args.chartPanel);
                getChartData(args.chartPanel);
            } catch (e) {
                alert(e);
            }
        });

        $scope.$on('chartOptionChanged', function (event, args) {
            try {
                $("#chartEditorWindow").kendoWindow("close");
                var chartPanel = args.chartPanel;
                var elementPos = $scope.chartPanels.map(function (x) { return x.id; }).indexOf(chartPanel.id);

                $scope.chartPanels[elementPos] = chartPanel;
                setChartOptions(null, chartPanel);

            } catch (e) {
                alert(e);
            }
        });

        function assignSeriesColor(chartPanel) {
            try {
                for (var i = 0; i < chartPanel.kpis.length; i++) {

                    if (chartPanel.kpis[i].color == undefined || chartPanel.kpis[i].color == null) {
                        var newColor = getunAssignedColor(chartPanel.kpis);
                        chartPanel.kpis[i].color = newColor;
                        chartPanel.kpis[i].chartType = 'column';
                        chartPanel.kpis[i].showLabel = false;
                        chartPanel.kpis[i].chartAxis = (i % 2 == 0) ? "YOne" : "YTwo";
                    }
                }
            } catch (e) {
                alert(e);
            }
        }

        function setChartOptions(dataSource, chartPanel) {
            try {
                var chartCommonOptions = {

                    title: {
                        //text: "Gross domestic product growth /GDP annual %/"
                    },
                    legend: {
                        position: "bottom",
                        labels: {}
                    },
                    seriesDefaults: {
                        type: "column"
                    },
                    series: [{
                        name: "AbortSession_Attempts",
                        data: [3.907, 7.943, 7.848, 9.284, 9.263, 9.801, 3.890, 8.238, 9.552, 6.855]
                    }],
                    valueAxis: [],
                    //valueAxis: {
                    //    labels: {
                    //        format: "{0}%"
                    //    },
                    //    line: {
                    //        visible: false
                    //    },
                    //    axisCrossingValue: 0
                    //},
                    //categoryAxis: {
                    //    categories: ['07/21/2016', '07/22/2016', '07/23/2016', '07/24/2016', '07/25/2016', '07/26/2016', '07/27/2016', '07/28/2016', '07/29/2016', '07/30/2016'],
                    //    line: {
                    //        visible: false
                    //    },
                    //    labels: {
                    //        //padding: {top: 135}
                    //    }
                    //},
                    // seriesColors: ['#1ab394', '#f8ac59', '#23c6c8', '#ed5565', '#98df8a', '#1f77b4', '#aec7e8', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],
                    //tooltip: {
                    //    visible: true,
                    //    format: "{0}%",
                    //    template: "#= series.name #: #= value #"
                    //}
                    pannable: true,
                    zoomable: true
                };

                var chartOptions = jQuery.extend(true, {}, chartCommonOptions);
                chartOptions.legend = getCustomLegend();

                //chartOptions.dataSource = { data: dataSource };

                var categoryTemplate = $scope.selectedgranularity.formatTemplate;
                if (chartPanel.chartAxisDateFormat != "Auto") {
                    categoryTemplate = "#= kendo.toString(kendo.parseDate(value), '" + chartPanel.chartAxisDateFormat + "') #";
                }

                chartOptions.categoryAxis = {
                    field: "date",
                    labels: {
                        template: categoryTemplate,
                        step: 0
                    },
                    majorGridLines: {
                        visible: false
                    },
                };


                switch ($scope.selectedgranularity.name) {
                    case "5 MIN":
                        chartOptions.categoryAxis.baseUnit = "minutes";
                        chartOptions.categoryAxis.baseUnitStep = "5";
                        break;
                    case "15 MIN":
                        chartOptions.categoryAxis.baseUnit = "minutes";
                        chartOptions.categoryAxis.baseUnitStep = "15";
                        break;
                    case "HOURLY":
                        break;
                    case "DAILY":
                        break;
                }

                var series = [];

                if (dataSource == null) {
                    chartOptions.dataSource = chartPanel.chartOptions.dataSource;
                    series = chartPanel.chartOptions.series;

                    for (var i = 0; i < chartPanel.kpis.length; i++) {

                        series[i].type = chartPanel.kpis[i].chartType;
                        series[i].color = chartPanel.kpis[i].color;
                        series[i].labels = { visible: chartPanel.kpis[i].showLabel };
                        series[i].axis = chartPanel.kpis[i].chartAxis;
                    }

                    chartOptions.categoryAxis.axisCrossingValues = [0, chartOptions.dataSource.data.length + 1];
                    chartOptions.categoryAxis.labels.step = Math.ceil(chartOptions.dataSource.data.length == 0 ? 5 : chartOptions.dataSource.data.length / 5);
                }
                else {

                    for (var i = 0; i < chartPanel.kpis.length; i++) {
                        var currentKpi = chartPanel.kpis[i];
                        series.push({
                            field: currentKpi.kpiName,
                            id: currentKpi.kpiId,
                            name: currentKpi.kpiDisplayName,
                            type: currentKpi.chartType,
                            color: currentKpi.color,
                            labels: { visible: currentKpi.showLabel },
                            axis: currentKpi.chartAxis,
                        });

                    }
                    chartOptions.dataSource = { data: dataSource };
                    chartOptions.categoryAxis.axisCrossingValues = [0, dataSource.length + 1];
                    chartOptions.categoryAxis.labels.step = Math.ceil(dataSource.length == 0 ? 5 : dataSource.length / 5);
                }

                var chartTooltip = $scope.selectedgranularity.altname + ":#= category #<br>Series:#=series.name#<br>Value:#=value#";

                chartOptions.tooltip = {
                    visible: true,
                    template: chartTooltip
                };


                for (var i = 0; i < series.length; i++) {
                    switch (series[i].type) {
                        case "smoothline":
                            series[i].type = "line";
                            series[i].style = "smooth";
                            break;
                        case "stepline":
                            series[i].type = "line";
                            series[i].style = "step";
                            break;
                        case "smootharea":
                            series[i].type = "area";
                            series[i].line = { style: "smooth" };
                            break;
                        case "steparea":
                            series[i].type = "area";
                            series[i].line = { style: "step" };
                            break;
                        case "area":
                            series[i].line = null;
                            break;
                        case "line":
                            series[i].style = null;
                            break;
                        default:
                            break;

                    }
                }

                chartOptions.series = series;
                chartOptions.valueAxis = getAxis(chartPanel);
                chartPanel.chartOptions = chartOptions;

                commonService.setBusyIndicator('chartDiv' + chartPanel.id, false);

            } catch (e) {
                alert(e);
            }
        }

        function resizeChartHeight(id) {
            try {
                $("#Chart" + id).removeAttr("style");
                $("#Chart" + id).css({ "height": "750px" }).data("kendoChart").resize();
            } catch (e) {
                alert(e);
            }
        }

        function getCustomLegend() {
            try {
                var legend = {
                    position: "bottom",
                    inactiveItems: {
                        labels: {
                            color: "#aa00bb"
                        }
                    },
                    item: {
                        visual: function (e) {
                            var shapeColor, shapeType, labelColor, labelText, axisName;

                            shapeColor = e.series.color;
                            shapeType = e.series.type;
                            axisName = e.series.axis;
                            labelText = e.series.name;
                            //alert(labelText);

                            if (axisName == "YOne") {
                                e.options.labels.color = "#1B9DDE";
                                labelColor = "#1B9DDE";
                            }
                            else {
                                e.options.labels.color = "#84C63E";
                                labelColor = "#84C63E";
                            }

                            if (!e.active) {
                                shapeColor = "gray";
                                labelColor = "gray";
                            }


                            var rect = new kendo.geometry.Rect([0, 0], [500, 50]);
                            var layout = new kendo.drawing.Layout(rect, {
                                spacing: 5,
                                alignItems: "center"
                            });


                            var marker;
                            switch (e.series.type) {
                                case "column":
                                    marker = new kendo.drawing.Path({
                                        fill: {
                                            color: shapeColor
                                        },
                                        stroke: {
                                            color: shapeColor,
                                            width: 0
                                        }
                                    }).moveTo(0, 0).lineTo(10, 0).lineTo(10, 11).lineTo(0, 11).close();
                                    break;
                                case "line":
                                case "smoothline":
                                case "stepline":
                                    marker = new kendo.drawing.Path({
                                        stroke: {
                                            color: shapeColor,
                                            width: 2
                                        }
                                    }).moveTo(0, 0).lineTo(5, 5).lineTo(10, 0).lineTo(15, 5).lineTo(20, 0).lineTo(25, 5);

                                    break;
                                case "area":
                                case "smootharea":
                                case "steparea":
                                    marker = new kendo.drawing.Path({
                                        fill: {
                                            color: shapeColor
                                        },
                                        stroke: {
                                            color: shapeColor,
                                            width: 0
                                        }
                                    }).moveTo(0, 0).lineTo(0, 10).lineTo(12, 10).lineTo(12, 0).lineTo(5, 3).close();
                                    break;
                                default:
                                    break;
                            }

                            var label = new kendo.drawing.Text(labelText, [0, 0], {
                                fill: {
                                    color: labelColor
                                }
                            });

                            layout.append(marker, label);
                            layout.reflow()

                            return layout;

                        }
                    }
                };

                return legend;
            } catch (e) {
                alert(e);
            }
        }

        function getunAssignedColor(elements) {
            try {
                var color;
                var assignedColors = elements.map(function (x) { return x.color; });
                var unassignedColor = _.difference(seriesColors, assignedColors);

                if (unassignedColor.length == 0) {
                    color = seriesColors[elements.length % numberofColors];
                }
                else {
                    color = unassignedColor[0];
                }
                return color;
            } catch (e) {
                alert(e);
            }
        }

        function getAxis(chartPanel) {
            try {
                var valueAxis = [];

                var uniqueKpisAxis = _.uniq(chartPanel.kpis, function (kpi) { return kpi.chartAxis; });
                if (uniqueKpisAxis == null || uniqueKpisAxis.length < 1) {
                    return;
                }

                for (var i = 0; i < chartPanel.chartAxisOptions.length; i++) {

                    var axisLookup = $.grep(uniqueKpisAxis, function (e) { return e.chartAxis == chartPanel.chartAxisOptions[i].name })[0];
                    if (axisLookup != null) {
                        var newAxis = angular.copy(chartPanel.chartAxisOptions[i]);

                        if (newAxis.isAutoScale) {
                            newAxis.min = undefined;
                            newAxis.max = undefined;
                        }
                        newAxis.majorGridLines = {
                            width: 0,
                            color: "lightgray"
                        };
                        valueAxis.push(newAxis);

                    }
                }
                return valueAxis;
            } catch (e) {
                alert(e);
            }
        }

        function loadChartswithDefaultKpis() {
            try {
                var defaultChartPanels = [{ "id": 1, "title": "Chart No: 1", "kpis": [{ "kpiId": 10, "kpiName": "AbortSession_Attempts", "kpiDisplayName": "AbortSession Attempts", "protocolName": "Diameter", "color": "#1B9DDE", "chartType": "column", "showLabel": false, "chartAxis": "YOne" }, { "kpiId": 11, "kpiName": "AbortSession_Failures", "kpiDisplayName": "AbortSession Failures", "protocolName": "Diameter", "color": "#84C63E", "chartType": "column", "showLabel": false, "chartAxis": "YTwo" }], "chartAxisOptions": [{ "name": "YOne", "isAutoScale": true, "color": "#1B9DDE", "min": 0, "max": 100 }, { "name": "YTwo", "isAutoScale": true, "color": "#84C63E", "min": 0, "max": 100 }], "chartAxisDateFormat": "Auto", "$$hashKey": "object:8" },
                    { "id": 2, "title": "Chart No: 2", "kpis": [{ "kpiId": 30, "kpiName": "CreateBearer_Attempts", "kpiDisplayName": "CreateBearer Attempts", "protocolName": "GTPV2-C", "color": "#1B9DDE", "chartType": "column", "showLabel": false, "chartAxis": "YOne" }, { "kpiId": 31, "kpiName": "CreateBearer_Failures", "kpiDisplayName": "CreateBearer Failures", "protocolName": "GTPV2-C", "color": "#84C63E", "chartType": "column", "showLabel": false, "chartAxis": "YTwo" }], "chartAxisOptions": [{ "name": "YOne", "isAutoScale": true, "color": "#1B9DDE", "min": 0, "max": 100 }, { "name": "YTwo", "isAutoScale": true, "color": "#84C63E", "min": 0, "max": 100 }], "chartAxisDateFormat": "Auto", "$$hashKey": "object:9" },
                    { "id": 3, "title": "Chart No: 3", "kpis": [{ "kpiId": 50, "kpiName": "DedicatedEPSBearerContextActivation_Attempts", "kpiDisplayName": "DedicatedEPSBearerContextActivation Attempts", "protocolName": "S1AP", "color": "#1B9DDE", "chartType": "line", "showLabel": false, "chartAxis": "YOne" }, { "kpiId": 51, "kpiName": "DedicatedEPSBearerContextActivation_Failures", "kpiDisplayName": "DedicatedEPSBearerContextActivation Failures", "protocolName": "S1AP", "color": "#84C63E", "chartType": "column", "showLabel": false, "chartAxis": "YTwo" }], "chartAxisOptions": [{ "name": "YOne", "isAutoScale": true, "color": "#1B9DDE", "min": 0, "max": 100 }, { "name": "YTwo", "isAutoScale": true, "color": "#84C63E", "min": 0, "max": 100 }], "chartAxisDateFormat": "Auto", "$$hashKey": "object:10" },
                    { "id": 4, "title": "Chart No: 4", "kpis": [{ "kpiId": 70, "kpiName": "Average_Registration_Request_Delay", "kpiDisplayName": "Average Registration Request Delay", "protocolName": "SIP", "color": "#1B9DDE", "chartType": "column", "showLabel": false, "chartAxis": "YOne" }, { "kpiId": 72, "kpiName": "Call_Drop_Rate", "kpiDisplayName": "Call Drop Rate", "protocolName": "SIP", "color": "#84C63E", "chartType": "column", "showLabel": false, "chartAxis": "YTwo" }], "chartAxisOptions": [{ "name": "YOne", "isAutoScale": true, "color": "#1B9DDE", "min": 0, "max": 100 }, { "name": "YTwo", "isAutoScale": true, "color": "#84C63E", "min": 0, "max": 100 }], "chartAxisDateFormat": "Auto", "$$hashKey": "object:11" }];
                //$scope.chartPanels = [defaultChartPanels[0]];
                $scope.chartPanels = defaultChartPanels;
                $timeout(reLoadAllChartData,200);

            } catch (e) {
                alert(e);
            }
        }

        $scope.test = function () {
            commonService.setBusyIndicator('Chart1', true);
        }

        //Load Static data
        function loadStaticKPIs($http) {
            if (commonService.isStaticData()) {
                $http.get("Data/trendingKPIs.json").success(function (data) {
                    $scope.chartPanels = data["defaultChartPanels"];
                }).error(function (err) {
                    alert.log(err);
                })
            }
        }

    });
}());