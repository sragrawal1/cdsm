(function () {
    'use strict';
    cdsmApp.controller('rcaController', function rcaController($scope, globalService, commonService, helperService, $rootScope, rcaService, $timeout, $location, $http, $localStorage) {
        var rcaData;
        loadData();

        $timeout(setHeight, 1000);

        function setHeight() {
            $("#splitter").height($("#cdsmContent").height() - $("#rcaTop").height() - 7);
            $("#rcaGrid").height($("#splitter").height());
            $("#imsiGrid").height($("#splitter").height());
        }

        $rootScope.$broadcast('pageLoaded', { pageName: "Root Cause Analysis", shortName: "rca" });

        init();

        $scope.$on('onDateChangeEvent', function () {
            loadData();
        });

        $scope.categoryChange = categoryChange;

       function categoryChange(category) {
            $(".widget").each(function () {
                $(this).removeClass("buttonHighlight");
            });

            $("#div" + category).addClass('buttonHighlight');

            $(":button").removeClass('btn-primary');
            $(":button").addClass('btn-default');
            $("#btn" + category).addClass('btn-primary');

            loadRCAData(category);
        }

        setTimeout(function () {
            categoryChange(globalService.getCurrentDomain());
        }, 500)

        function getRCAData(category) {
            try {
                var data = [];
                switch (category) {
                    case "RAN":
                        data = rcaData.RAN;
                        break;
                    case "EPC":
                        data = rcaData.EPC;
                        break;
                    case "IMS":
                        data = rcaData.IMS;
                        break;
                    case "OTHERS":
                        data = rcaData.OTHERS;
                    default:
                        break;
                }
                return data;

            } catch (e) {
                alert(e);
            }
        }

        function loadRCAData(category) {
            try {
                var data = getRCAData(category);

                var reportDataSource = new kendo.data.DataSource({
                    data: data,

                });

                var grid = $("#rcaGrid").data("kendoGrid");
                grid.setDataSource(reportDataSource);
                grid.select("tr:eq(1)");
            } catch (e) {
                alert(e);
            }
        }

        function setGridOptions(data) {
            try {
                var options = jQuery.extend(true, {}, commonService.gridOptions);
                var columns = [
                    { field: "protocolname",width:100, title: "Domain", editable: false, headerAttributes: { style: "text-align: center; font-size: 14px;" } },
                    { field: "problemsignature", title: "Problem Signatures", editable: false, headerAttributes: { style: "text-align: center; font-size: 14px;" } },
                    { field: "count", title: "#",editable: false, headerAttributes: { style: "text-align: center; font-size: 14px;" } },
                    { field: "contribution", title: "%", editable: false, headerAttributes: { style: "text-align: center; font-size: 14px;" } },
                ]

                options.columns = columns;
                options.sortable = false;
                options.filterable = false;
                options.resizable = true;
                options.groupable = true;
                options.reorderable = false;
                options.pageable = false;
                options.scrollable = false;
                options.selectable = "row";
                options.change = onChange;
                options.groupable = {
                    messages: {
                        empty: "Drop Group columns here"
                    }
                };
                $scope.gridOptions = options;
            } catch (e) {
                alert(e);
            }
        };

        function onChange(arg) {
            try {

                var selectedRows = this.select();
                var selectedDataItems = [];
                for (var i = 0; i < selectedRows.length; i++) {
                    var dataItem = this.dataItem(selectedRows[i]);
                    selectedDataItems.push(dataItem);
                }

                var selectedObject = selectedDataItems[0];
                loadIMSIData(selectedObject);
            } catch (e) {
                alert(e);
            }
        }

        function onIMSISelectedChange(arg) {
            try {

                var selectedRows = this.select();
                var selectedDataItems = [];
                for (var i = 0; i < selectedRows.length; i++) {
                    var dataItem = this.dataItem(selectedRows[i]);
                    selectedDataItems.push(dataItem);
                }

                var selectedObject = selectedDataItems[0];
            } catch (e) {
                alert(e);
            }
        }

        function setIMSIGridOptions() {
            try {
                var options = jQuery.extend(true, {}, commonService.gridOptions);
                var columns = [
                    { field: "rcaDate", title: "Date", editable: false,width:100 },
                    { field: "startTime", title: "Start Time", editable: false },
                    { field: "endTime", title: "End Time", editable: false },
                    {
                        field: "imsi", title: "IMSI", editable: false// , template: '<a href="">#=IMSI#</a>'
                        //, template: "#if (ShowCTS == 'YES') {#<a href=''>#=IMSI#</a>#}"
                        //, template: "#if(ShowCTS == 'YES') {'hello'}"
                        , template: function (dataItem) {

                            if (dataItem.showCTS == true) {
                                return '<a href="" ng-click=openCTS(' + dataItem.imsi + ')>' + dataItem.imsi + '</a>';
                            }
                            else {
                                return dataItem.imsi
                            }
                        }
                    },
                    { field: "msisdn", title: "MSISDN", editable: false },
                    { field: "cell", title: "CELL", editable: false },
                    { field: "rcaSummary", title: "RCA Summary", editable: false }
                ]

                options.columns = columns;
                options.sortable = true;
                options.filterable = true;
                options.resizable = true;
                options.reorderable = false;
                options.groupable = true;
                options.pageable = false;
                options.scrollable = false;
                options.selectable = "row";
                //options.change = onIMSISelectedChange;
                options.groupable = {
                    messages: {
                        empty: "Drop Group columns here"
                    }
                };
                $scope.IMSIgridOptions = options;
            } catch (e) {
                alert(e);
            }
        }


        $scope.openCTS = function (imsi) {
            globalService.setCurrentIMSI({ imsi: imsi, id: imsi });
            $location.path('/ctr');
            $scope.$apply();
        }

        function loadIMSIData(selectedObject) {
            try {

                var data = $.grep(rcaData.MasterData, function (e) { return e.errorDomain == selectedObject.category && e.ccProtocol == selectedObject.protocolname && e.problemSignature == selectedObject.problemsignature });
                var reportDataSource = new kendo.data.DataSource({
                    data: data,
                    //pageSize: 10, //commonService.pageSize
                });
                var grid = $("#imsiGrid").data("kendoGrid");
                grid.setDataSource(reportDataSource);

            } catch (e) {
                alert(e);
            }
        }

        $scope.kCTWindowOptions = {
            title: "Call Trace Details",
            modal: true,
            visible: false,
            //resizable: false,
            width: 1700,
            height: 900,
        };

        function showCTPopup() {
            try {
                var element = $("#CTWindow");
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

        function init() {
            try {
                setGridOptions();
                setIMSIGridOptions();
            } catch (e) {
                alert(e);
            }
        }

        function loadData() {

            try {
                var requestDate = kendo.toString(kendo.parseDate(globalService.getSelectedDate()), 'yyyy-MM-dd');
                if (commonService.isStaticData()) {
                    requestDate = "Date" + (new Date().getDate() - globalService.getSelectedDate().getDate());
                    var data = $localStorage.rcaData;
                    var filteredData = data[0];
                    rcaData = filteredData;
                    $scope.rcaData = rcaData;
                }
                else {
                }
            } catch (e) {
                alert(e);
            }
        }
    });
}());