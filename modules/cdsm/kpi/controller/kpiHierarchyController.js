(function () {
    'use strict';
    cdsmApp.controller('kpiHierarchyController', function kpiHierarchyController($scope, globalService, commonService, helperService, $rootScope, $timeout, $localStorage, kpiService) {
        var kpiHierarchyData;
        var chartPanel;
        var treeView

        //xmltoJSON();
        //$scope.changeKPI = changeKPI;
        //$scope.searchText;
        
        $scope.$on('onDateChangeEvent', function () {
            $scope.selectedDate = globalService.getSelectedDate();
            $scope.$apply();
        });


        function xmltoJSON()
        {
            var x2js = new X2JS();
            var xmlText = "<KPIHierarchy> <item> <name>Diameter</name> <type>protocol</type> <displayName>Diameter</displayName> <id>P1</id> <item> <name>AbortSession_Attempts</name> <type>kpi</type> <displayName>AbortSession Attempts-Rx</displayName> <interfaceName>Rx</interfaceName> <id>10</id> </item> <item> <name>AbortSession_Failures</name> <type>kpi</type> <displayName>AbortSession Failures-Rx</displayName> <interfaceName>Rx</interfaceName> <id>11</id> </item> <item> <name>AbortSession_FRPercentage</name> <type>kpi</type> <displayName>AbortSession FRPercentage-Rx</displayName> <interfaceName>Rx</interfaceName> <id>12</id> </item> <item> <name>AbortSession_SRPercentage</name> <type>kpi</type> <displayName>AbortSession SRPercentage-Rx</displayName> <interfaceName>Rx</interfaceName> <id>13</id> </item> <item> <name>AbortSession_SuccessfulProcedure</name> <type>kpi</type> <displayName>AbortSession SuccessfulProcedure-Rx</displayName> <interfaceName>Rx</interfaceName> <id>14</id> </item> <item> <name>AuthenticationAuthorization_Attempts</name> <type>kpi</type> <displayName>AuthenticationAuthorization Attempts-Rx</displayName> <interfaceName>Rx</interfaceName> <id>20</id> </item> <item> <name>AuthenticationAuthorization_FRPercentage</name> <type>kpi</type> <displayName>AuthenticationAuthorization FRPercentage-Rx</displayName> <interfaceName>Rx</interfaceName> <id>22</id> </item> <item> <name>AuthenticationAuthorization_SRPercentage</name> <type>kpi</type> <displayName>AuthenticationAuthorization SRPercentage-Rx</displayName> <interfaceName>Rx</interfaceName> <id>23</id> </item> <item> <name>AuthenticationAuthorization_Failures</name> <type>kpi</type> <displayName>AuthenticationAuthorization Failures-Rx</displayName> <interfaceName>Rx</interfaceName> <id>21</id> </item> <item> <name>AuthenticationAuthorization_SuccessfulProcedure</name> <type>kpi</type> <displayName>AuthenticationAuthorization SuccessfulProcedure-Rx</displayName> <interfaceName>Rx</interfaceName> <id>24</id> </item> </item><item> <name>SIP</name> <type>protocol</type> <displayName>SIP</displayName> <id>P1</id> <item> <name>AbortSession_Attempts</name> <type>kpi</type> <displayName>AbortSession Attempts-Rx</displayName> <interfaceName>Rx</interfaceName> <id>10</id> </item> <item> <name>AbortSession_Failures</name> <type>kpi</type> <displayName>AbortSession Failures-Rx</displayName> <interfaceName>Rx</interfaceName> <id>11</id> </item> <item> <name>AbortSession_FRPercentage</name> <type>kpi</type> <displayName>AbortSession FRPercentage-Rx</displayName> <interfaceName>Rx</interfaceName> <id>12</id> </item> <item> <name>AbortSession_SRPercentage</name> <type>kpi</type> <displayName>AbortSession SRPercentage-Rx</displayName> <interfaceName>Rx</interfaceName> <id>13</id> </item> <item> <name>AbortSession_SuccessfulProcedure</name> <type>kpi</type> <displayName>AbortSession SuccessfulProcedure-Rx</displayName> <interfaceName>Rx</interfaceName> <id>14</id> </item> <item> <name>AuthenticationAuthorization_Attempts</name> <type>kpi</type> <displayName>AuthenticationAuthorization Attempts-Rx</displayName> <interfaceName>Rx</interfaceName> <id>20</id> </item> <item> <name>AuthenticationAuthorization_FRPercentage</name> <type>kpi</type> <displayName>AuthenticationAuthorization FRPercentage-Rx</displayName> <interfaceName>Rx</interfaceName> <id>22</id> </item> <item> <name>AuthenticationAuthorization_SRPercentage</name> <type>kpi</type> <displayName>AuthenticationAuthorization SRPercentage-Rx</displayName> <interfaceName>Rx</interfaceName> <id>23</id> </item> <item> <name>AuthenticationAuthorization_Failures</name> <type>kpi</type> <displayName>AuthenticationAuthorization Failures-Rx</displayName> <interfaceName>Rx</interfaceName> <id>21</id> </item> <item> <name>AuthenticationAuthorization_SuccessfulProcedure</name> <type>kpi</type> <displayName>AuthenticationAuthorization SuccessfulProcedure-Rx</displayName> <interfaceName>Rx</interfaceName> <id>24</id> </item> </item> </KPIHierarchy>";
            var jsonObj = x2js.xml_str2json(xmlText);
        }



        $timeout(initialization, 0);

        function initialization()
        {
            setKPIHierarchySource();
            //loadProtocol();
            chartPanel = $scope.$parent.$parent.$parent.selectedChartPanel;
            loadKPIFilterTree();

            $scope.applyKPI = applyKPI;
        }

     
        $scope.changeKPI = function changeKPI() {
            var dataSource = $("#kpiFilterTreeDiv").data("kendoTreeView").dataSource;
            filter(dataSource, $scope.searchText.toLowerCase());
        }

        // sets "hidden" field on items matching query
        function filter(dataSource, query) {
            var hasVisibleChildren = false;
            var data = dataSource instanceof kendo.data.HierarchicalDataSource && dataSource.data();

            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var text = item.displayName.toLowerCase();
                var itemVisible =
                    query === true // parent already matches
                    || query === "" // query is empty
                    || text.indexOf(query) >= 0; // item text matches query

                var anyVisibleChildren = filter(item.children, itemVisible || query); // pass true if parent matches

                hasVisibleChildren = hasVisibleChildren || anyVisibleChildren || itemVisible;

                item.hidden = !itemVisible && !anyVisibleChildren;
            }

            if (data) {
                // re-apply filter on children
                dataSource.filter({ field: "hidden", operator: "neq", value: true });
            }

            return hasVisibleChildren;
        }



        function loadProtocol()
        {
            $("#ddlProtocol").kendoDropDownList({
                dataTextField: "displayName",
                dataValueField: "id",
                dataSource: kpiHierarchyData,
                change: function (e) {
                    var protocolid = this.value();
                    onChangeProtocol(protocolid);
                    // Use the value of the widget
                }
            });
        }

        function onChangeProtocol(protocolid) {
            try {
                loadKPIFilterTree(protocolid);
            } catch (e) {
                alert(e);
            }
        }


        function onKPIHierarchyDataLoaded(data)
        {
            try {
                //var jsonData = JSON.parse(data);
                var jsonData = data;
                kpiHierarchyData = jsonData.KPIHierarchy.items;
                $localStorage.kpiHierarchyData = jsonData;
            } catch (e) {
                alert(e);
            }
        }

        function setKPIHierarchySource() {

            if (commonService.isStaticData())
            {
                kpiHierarchyData = $localStorage.kpiHierarchyData.KPIHierarchy.items;
                return;
            }
            else
            {
                if ($localStorage.kpiHierarchyData)
                {
                    kpiHierarchyData = $localStorage.kpiHierarchyData.KPIHierarchy.items;
                    return;
                }


                var requestDate = kendo.toString(kendo.parseDate(globalService.getSelectedDate()), 'yyyy-MM-dd');
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
                kpiService.getkpiHierarchyData(para).then(function (data) {
                    onKPIHierarchyDataLoaded(data);
                });

              //  return;
            }

            //kpiHierarchyData = [
            //        {
            //            name: "Diameter", type: "protocol", displayName: "Diameter", id: "P1",
            //            items: [
            //                        { name: "AbortSession_Attempts", type: "kpi", displayName: "AbortSession Attempts-Rx", interfaceName : "Rx" , id: 10 },
            //                        { name: "AbortSession_Failures", type: "kpi", displayName: "AbortSession Failures-Rx", interfaceName: "Rx", id: 11 },
            //                        { name: "AbortSession_FRPercentage", type: "kpi", displayName: "AbortSession FRPercentage-Rx", interfaceName: "Rx", id: 12 },
            //                        { name: "AbortSession_SRPercentage", type: "kpi", displayName: "AbortSession SRPercentage-Rx", interfaceName: "Rx", id: 13 },
            //                        { name: "AbortSession_SuccessfulProcedure", type: "kpi", displayName: "AbortSession SuccessfulProcedure-Rx", interfaceName: "Rx", id: 14 },

            //                        { name: "AuthenticationAuthorization_Attempts", type: "kpi", displayName: "AuthenticationAuthorization Attempts-Rx", interfaceName: "Rx", id: 20 },
            //                        { name: "AuthenticationAuthorization_FRPercentage", type: "kpi", displayName: "AuthenticationAuthorization FRPercentage-Rx", interfaceName: "Rx", id: 22 },
            //                        { name: "AuthenticationAuthorization_SRPercentage", type: "kpi", displayName: "AuthenticationAuthorization SRPercentage-Rx", interfaceName: "Rx", id: 23 },
            //                        { name: "AuthenticationAuthorization_Failures", type: "kpi", displayName: "AuthenticationAuthorization Failures-Rx", interfaceName: "Rx", id: 21 },
            //                        { name: "AuthenticationAuthorization_SuccessfulProcedure", type: "kpi", displayName: "AuthenticationAuthorization SuccessfulProcedure-Rx", interfaceName: "Rx", id: 24 }
            //                   ]
            //        },
            //        {
            //            name: "GTPV2-C", type: "protocol", displayName: "GTPV2-C", id: "P2",
            //            items: [
            //                    { name: "CreateBearer_Attempts", type: "kpi", displayName: "CreateBearer Attempts-S11/S5", interfaceName: "S11/S5", id: 30 },
            //                        { name: "CreateBearer_Failures", type: "kpi", displayName: "CreateBearer Failures-S11/S5", interfaceName: "S11/S5", id: 31 },
            //                        { name: "CreateBearer_FRPercentage", type: "kpi", displayName: "CreateBearer FRPercentage-S11/S5", interfaceName: "S11/S5", id: 32 },
            //                        { name: "CreateBearer_SRPercentage", type: "kpi", displayName: "CreateBearer SRPercentage-S11/S5", interfaceName: "S11/S5", id: 33 },
            //                        { name: "CreateBearer_SuccessfulProcedure", type: "kpi", displayName: "CreateBearer SuccessfulProcedure-S11/S5", interfaceName: "S11/S5", id: 34 },

            //                        { name: "CreateIndirectDataForwardingTunnel_Attempts", type: "kpi", displayName: "CreateIndirectDataForwardingTunnel Attempts-S11", interfaceName: "S11", id: 40 },
            //                        { name: "CreateIndirectDataForwardingTunnel_Failures", type: "kpi", displayName: "CreateIndirectDataForwardingTunnel Failures-S11", interfaceName: "S11", id: 41 },
            //                        { name: "CreateIndirectDataForwardingTunnel_FRPercentage", type: "kpi", displayName: "CreateIndirectDataForwardingTunnel FRPercentage-S11", interfaceName: "S11", id: 42 },
            //                        { name: "CreateIndirectDataForwardingTunnel_SRPercentage", type: "kpi", displayName: "CreateIndirectDataForwardingTunnel SRPercentage-S11", interfaceName: "S11", id: 43 },
            //                        { name: "CreateIndirectDataForwardingTunnel_SuccessfulProcedure", type: "kpi", displayName: "CreateIndirectDataForwardingTunnel SuccessfulProcedure-S11", interfaceName: "S11", id: 44 }
            //            ],
            //        },
            //         {
            //             name: "S1AP", type: "protocol", displayName: "S1AP", id: "P3",

            //             items: [
            //                        { name: "DedicatedEPSBearerContextActivation_Attempts", type: "kpi", displayName: "DedicatedEPSBearerContextActivation Attempts-S1-MME", interfaceName: "S1-MME", id: 50 },
            //                        { name: "DedicatedEPSBearerContextActivation_Failures", type: "kpi", displayName: "DedicatedEPSBearerContextActivation Failures-S1-MME", interfaceName: "S1-MME", id: 51 },
            //                        { name: "DedicatedEPSBearerContextActivation_FRPercentage", type: "kpi", displayName: "DedicatedEPSBearerContextActivation FRPercentage-S1-MME", interfaceName: "S1-MME", id: 52 },
            //                        { name: "DedicatedEPSBearerContextActivation_SRPercentage", type: "kpi", displayName: "DedicatedEPSBearerContextActivation SRPercentage-S1-MME", interfaceName: "S1-MME", id: 53 },
            //                        { name: "DedicatedEPSBearerContextActivation_SuccessfulProcedure", type: "kpi", displayName: "DedicatedEPSBearerContextActivation SuccessfulProcedure-S1-MME", interfaceName: "S1-MME", id: 54 },

            //                        { name: "DefaultEPSBearerContextActivation_Attempts", type: "kpi", displayName: "DefaultEPSBearerContextActivation Attempts-S1-MME", interfaceName: "S1-MME", id: 60 },
            //                        { name: "DefaultEPSBearerContextActivation_Failures", type: "kpi", displayName: "DefaultEPSBearerContextActivation Failures-S1-MME", interfaceName: "S1-MME", id: 61 },
            //                        { name: "DefaultEPSBearerContextActivation_FRPercentage", type: "kpi", displayName: "DefaultEPSBearerContextActivation FRPercentage-S1-MME", interfaceName: "S1-MME", id: 62 },
            //                        { name: "DefaultEPSBearerContextActivation_SRPercentage", type: "kpi", displayName: "DefaultEPSBearerContextActivation SRPercentage-S1-MME", interfaceName: "S1-MME", id: 63 },
            //                        { name: "DefaultEPSBearerContextActivation_SuccessfulProcedure", type: "kpi", displayName: "DefaultEPSBearerContextActivation SuccessfulProcedure-S1-MME", interfaceName: "S1-MME", id: 64 }
            //             ]
            //         },
            //          {
            //              name: "SIP", type: "protocol", displayName: "SIP", id: "P4",
            //              items: [{ name: "Average_Registration_Request_Delay", type: "kpi", displayName: "Average Registration Request Delay", interfaceName: "", id: 70 },
            //                      { name: "Average_Successful_Session_Duration_Time", type: "kpi", displayName: "Average Successful Session Duration Time", interfaceName: "", id: 71 },
            //                      { name: "Call_Drop_Rate", type: "kpi", displayName: "Call Drop Rate", interfaceName: "", id: 72 },
            //                      { name: "Failed_Session_Setup_Rate", type: "kpi", displayName: "Failed Session Setup Rate", interfaceName: "", id: 73 },
            //                      { name: "Ineffective_Registration_Attempt_Rate", type: "kpi", displayName: "Ineffective Registration Attempt Rate", interfaceName: "", id: 74 },
            //                      { name: "Ineffective_Session_Attempt_Rate", type: "kpi", displayName: "Ineffective Session Attempt Rate", interfaceName: "", id: 75 },
            //                      { name: "Invite_Successful_Request_Attempt", type: "kpi", displayName: "Invite Successful Request Attempt", interfaceName: "", id: 76 },
            //                      { name: "Session_Completion_Rate", type: "kpi", displayName: "Session Completion Rate", interfaceName: "", id: 77 },
            //                      { name: "Session_Defects_Rate", type: "kpi", displayName: "Session Defects Rate", interfaceName: "", id: 78 },
            //                      { name: "Session_Establishment_Effectiveness_Rate", type: "kpi", displayName: "Session Establishment Effectiveness Rate", interfaceName: "", id: 79 },
            //                      { name: "Session_Establishment_Rate", type: "kpi", displayName: "Session Establishment Rate", interfaceName: "", id: 799 },


            //              ]
            //          },
            //           {
            //               name: "RAN", type: "protocol", displayName: "RAN", id: "P5",

            //               items: [
            //                       { name: "Accessibility_Call_Setup_Success_rate", type: "kpi", displayName: "Accessibility_Call Setup Success rate", interfaceName: "", id: 80 },
            //                       { name: "Accessibility_RRC_setup_success_rate", type: "kpi", displayName: "Accessibility_RRC setup success rate", interfaceName: "", id: 81 },
            //                       { name: "Accessibility_E_RAB_Setup_Success_rate", type: "kpi", displayName: "Accessibility_E-RAB Setup Success rate", interfaceName: "", id: 82 },
            //                       { name: "Accessibility_S1_Signalling_establishment_success_rate", type: "kpi", displayName: "Accessibility_S1 Signalling establishment success rate", interfaceName: "", id: 83 },

            //                        { name: "Retainability_Call_Drop_Rate", type: "kpi", displayName: "Retainability_Call Drop Rate", interfaceName: "", id: 90 },
            //                        { name: "Retainability_ERAB_Abnormal_release", type: "kpi", displayName: "Retainability_ERAB Abnormal release", interfaceName: "", id: 91 },
            //                        { name: "Retainability_Downlink_Latency", type: "kpi", displayName: "Retainability_Downlink Latency", interfaceName: "", id: 92 }
            //               ]
            //           }
            //];
        }

        function loadKPIFilterTree(protocolid) {
            try {

                //var kpisforProtocol;
                //kpisforProtocol = $.grep(kpiHierarchyData, function (a) { return a.id == protocolid })[0].items;

                

                for (var i = 0; i < kpiHierarchyData.length; i++) {
                    var protocol = kpiHierarchyData[i];
                    var kpis = protocol.items;

                    for (var k = 0; k < kpis.length; k++) {
                        var kpiSelected = $.grep(chartPanel.kpis, function (a) { return a.kpiId == kpis[k].id });
                        if (kpiSelected.length > 0) {
                            kpis[k].checked = true;
                            kpis[k].color = kpiSelected[0].color;
                            kpis[k].chartType = kpiSelected[0].chartType;
                            kpis[k].showLabel = kpiSelected[0].showLabel;
                            kpis[k].chartAxis = kpiSelected[0].chartAxis;
                        }
                    }
                }




                var options = {};
                options.dataSource = {
                    data: kpiHierarchyData //kpisforProtocol
                };
                options.dataTextField = ["displayName", "displayName"];
                //options.template = "#= item.displayName # (#= item.interfaceName #)"
                //options.template = kendo.template($("#kpi-template").html());
                options.checkboxes = {
                    checkChildren: true
                };
                options.loadOnDemand = false;

                $scope.filterTreeOptions = options;
                $scope.$apply();

                treeView = $("#kpiFilterTreeDiv").data("kendoTreeView");
                
                //for (var i = 0; i < chartPanel.kpis.length; i++) {
                //    var kpiId = chartPanel.kpis[i].kpiId;
                //    var kpiDataItem = treeView.dataSource.get(kpiId);
                //    var kpiElement = treeView.findByUid(kpiDataItem.uid);
                //    treeView.dataItem(kpiElement).set("checked", true);
                //}




            } catch (e) {
                alert(e);
            }
        }

        function applyKPI()
        {
            try {
                var message = validateKPIs();
                if (message != "")
                    {
                    commonService.showGoAwayMessage("info", message, "KPI Selection");
                    return;
                    }
                $rootScope.$broadcast('chartKPIsChanged', { chartPanel: chartPanel });
            } catch (e) {
                alert(e);
            }
        }

        function validateKPIs() {
            try {
                var checkedNodes = [],
                message="";

                

                checkedNodeIds(treeView.dataSource.view(), checkedNodes);

                if (checkedNodes.length > 0) {
                    //message = "KPIs selected (Ids): " + checkedNodes.join(",");
                    chartPanel.kpis = checkedNodes;
                } else {
                    message = "No KPI selected!!";
                }

                return message;
                

                //$("#selectedKPIs").html(message);
            } catch (e) {
                alert(e);
            }
        }

        function checkedNodeIds(nodes, checkedNodes) {
            try {
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].checked && nodes[i].type == "kpi") {


                        //var messageNode = treeView.parent(treeView.findByText(nodes[i].name));
                        //var messageName = treeView.text(messageNode);

                        var protocolNode = treeView.parent(treeView.findByText(nodes[i].displayName));
                        var protocolName = treeView.text(protocolNode);

                        checkedNodes.push({ kpiId: nodes[i].id, kpiName: nodes[i].name, kpiDisplayName: nodes[i].displayName, protocolName: protocolName, color: nodes[i].color, chartType: nodes[i].chartType, showLabel: nodes[i].showLabel, chartAxis: nodes[i].chartAxis });
                        //console.log(treeview.text(parent));
                    }

                    if (nodes[i].hasChildren) {
                        checkedNodeIds(nodes[i].children.view(), checkedNodes);
                    }
                }
            } catch (e) {
                alert(e);
            }

            
        }
    });
}());