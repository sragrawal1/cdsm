(function () {
    'use strict';
    cdsmApp.controller('rcalogController', function rcalogController($scope, globalService, commonService, helperService, $rootScope, $timeout,$http) {

        var logData = [];
        var currentLogIndex = 0;
        //alert('Log loaded');

        //startProgressLoading();
        $timeout(startProgressLoading, 1000);



        $scope.$on('onDateChangeEvent', function () {
            //$scope.selectedDate = globalService.getSelectedDate();
            //$scope.$apply();
        });

        //function startProgressLoading()
        //{

        //}


        $("#pbRANData").kendoProgressBar({
            min: 0,
            max: 100,
            type: "percent",
            change: function (e) {
                this.progressWrapper.css({
                    "background-color": "#EE9F05",
                    "border-color": "#EE9F05"
                })
            },
            animation: {
                duration: 10
            }
        });


        //progresstest();



        function progresstest() {
            var pb = $("#pbRANData").data("kendoProgressBar");
            pb.value(0);

            var interval = setInterval(function () {
                if (pb.value() < 100) {
                    pb.value(pb.value() + 1);
                } else {
                    clearInterval(interval);
                }
            }, 10);
        }


        function assignProgressBar(elementid, maxvalue) {
            $(elementid).kendoProgressBar({
                min: 0,
                max: maxvalue,
                type: "percent",
                change: function (e) {
                    this.progressWrapper.css({
                        "background-color": "#EE9F05",
                        "border-color": "#EE9F05"
                    });
                    onChange(e);
                },
                complete: onComplete,
                animation: {
                    duration: 1
                }
            });
        }

        function onChange(e) {
            try {
                var message;
                message = $scope.logData[currentLogIndex].data[e.value - 1];
                //kendoConsole.log(message);

                var x = document.getElementById("rcaOptions");
                var option = document.createElement("option");
                option.text = message;
                x.add(option, x[0]);

            } catch (e) {
                if (e.message != "Unable to get property 'add' of undefined or null reference")
                    {
                    //alert(e);
                }
            }
        }

        function onComplete(e) {

            $rootScope.$broadcast('rcaMessageLoaded', { category: $scope.logData[currentLogIndex].identifier });
            $scope.$apply();
            currentLogIndex = currentLogIndex + 1;
            progress($scope.logData[currentLogIndex]);
        }

        function progress(log) {
            try {
                if (log == undefined || log == null) {
                    return;
                }
                $("#div" + log.identifier).show();
                var dataLength = log.data.length;
                assignProgressBar("#pb" + log.identifier, dataLength);
                var pb = $("#pb" + log.identifier).data("kendoProgressBar");
                pb.value(0);

                var interval = setInterval(function () {
                    if (pb.value() < dataLength) {
                        pb.value(pb.value() + 1);
                    } else {
                        clearInterval(interval);
                    }
                }, log.interval);
            } catch (e) {
                if (e.message != "Unable to get property 'value' of undefined or null reference")
                {
                    //alert(e);
                }
                    
            }
        }

        function startProgressLoading() {
            loadLogData();
            progress($scope.logData[currentLogIndex]);
            $timeout(function () { loadStaticKPIs($http) }, 4000);
        }

        function loadLogData() {
            logData.push(
                {
                    identifier: "RANData", text: "Processing RAN Data", interval: 20,
                    data: ['Opening socket port for LTE Call trace…',
                           'Analyzing CTR data….',
                           'Analyzing Drive test data….',
                           'Analyzing PM counters…'
                    ]
                });

            logData.push({
                identifier: "RANEvents", text: "RAN Events", interval: 1,
                data: [
                   'INTERNAL_EVENT_ADMISSION_BLOCKING_STARTED….',
                   'INTERNAL_EVENT_ADMISSION_BLOCKING_STOPPED….',
                   'INTERNAL_EVENT_ADMISSION_BLOCKING_UPDATED….',
                   'INTERNAL_EVENT_ADV_CELL_SUP_DETECTION….',
                   'INTERNAL_EVENT_ADV_CELL_SUP_RECOVERY_ATTEMPT….',
                   'INTERNAL_EVENT_ADV_CELL_SUP_RECOVERY_RESULT….',
                   'INTERNAL_EVENT_ANR_CONFIG_MISSING….',
                   //'INTERNAL_EVENT_ANR_PCI_REPORT_WANTED….',
                   //'INTERNAL_EVENT_ANR_STOP_MEASURING….',
                   //'INTERNAL_EVENT_CANDNREL_ADD….',
                   //'INTERNAL_EVENT_CANDNREL_REMOVE….',
                   //'INTERNAL_EVENT_CELL_DL_CAPACITY….',
                   //'INTERNAL_EVENT_CELL_WAKEUP_DETECTED….',
                   //'INTERNAL_EVENT_CELL_WAKEUP_TRIGGERED….',
                   //'INTERNAL_EVENT_CMAS_REPET_STOPPED….',
                   //'INTERNAL_EVENT_CMAS_REQ….',
                   //'INTERNAL_EVENT_CMAS_RESP….',
                   //'INTERNAL_EVENT_COV_CELL_DISCOVERY_END….',
                   //'INTERNAL_EVENT_COV_CELL_DISCOVERY_START….',
                   //'INTERNAL_EVENT_COV_CELL_DISCOVERY_UPDATE….',
                   //'INTERNAL_EVENT_DL_COMP_MEAS_CONFIG_REJECT….',
                   //'INTERNAL_EVENT_DL_COMP_MEAS_REP_DISCARD….',
                   //'INTERNAL_EVENT_DYNAMIC_UE_ADMISSION_BLOCKING_STARTED….',
                   //'INTERNAL_EVENT_DYNAMIC_UE_ADMISSION_BLOCKING_STOPPED….',
                   //'INTERNAL_EVENT_DYNAMIC_UE_ADMISSION_BLOCKING_UPDATED….',
                   //'INTERNAL_EVENT_ERAB_DATA_INFO….',
                   //'INTERNAL_EVENT_ERAB_RELEASE_DELAYED….',
                   //'INTERNAL_EVENT_ERAB_ROHC_FAIL_LIC_REJECT….',
                   //'INTERNAL_EVENT_ETWS_REPET_STOPPED',
                   //'INTERNAL_EVENT_ETWS_REQ',
                   //'INTERNAL_EVENT_ETWS_RESP',
                   //'INTERNAL_EVENT_EUTRAN_FREQUENCY_ADD',
                   //'INTERNAL_EVENT_FREQ_REL_ADD',
                   //'INTERNAL_EVENT_HO_WRONG_CELL_REEST',
                   //'INTERNAL_EVENT_HO_WRONG_CELL',
                   //'INTERNAL_EVENT_IMLB_ACTION….',
                   //'INTERNAL_EVENT_IMLB_CONTROL….',
                   //'INTERNAL_EVENT_INTEGRITY_VER_FAIL_RRC_MSG….',
                   //'INTERNAL_EVENT_IP_ADDR_GET_FAILURE….',
                   //'INTERNAL_EVENT_LB_EVALUATION_TO….',
                   //'INTERNAL_EVENT_LB_INTER_FREQ….',
                   //'INTERNAL_EVENT_LB_SUB_RATIO….',
                   //'INTERNAL_EVENT_LICENSE_UNAVAILABLE….',
                   //'INTERNAL_EVENT_LOAD_CONTROL_STATE_TRANSITION….',
                   //'INTERNAL_EVENT_MAX_FILESIZE_REACHED….',
                   //'INTERNAL_EVENT_MAX_FILESIZE_RECOVERY….',
                   //'INTERNAL_EVENT_MAX_STORAGESIZE_REACHED….',
                   //'INTERNAL_EVENT_MAX_UETRACES_REACHED….',
                   //'INTERNAL_EVENT_MBMS_INTEREST_INDICATION….',
                   //'INTERNAL_EVENT_MEAS_CONFIG_A1….',
                   //'INTERNAL_EVENT_MEAS_CONFIG_A2….',
                   //'INTERNAL_EVENT_MEAS_CONFIG_A3….',
                   //'INTERNAL_EVENT_MEAS_CONFIG_A4….',
                   //'INTERNAL_EVENT_MEAS_CONFIG_A5….',
                   //'INTERNAL_EVENT_MEAS_CONFIG_A6….',
                   //'INTERNAL_EVENT_MEAS_CONFIG_B1_CDMA2000….',
                   //'INTERNAL_EVENT_MEAS_CONFIG_B1_UTRA….',
                   //'INTERNAL_EVENT_MEAS_CONFIG_B2_CDMA2000….',
                   //'INTERNAL_EVENT_MEAS_CONFIG_B2_GERAN….',
                   //'INTERNAL_EVENT_MEAS_CONFIG_B2_UTRA….',
                   //'INTERNAL_EVENT_MEAS_CONFIG_PERIODICAL_EUTRA….',
                   //'INTERNAL_EVENT_MEAS_CONFIG_PERIODICAL_GERAN….',
                   //'INTERNAL_EVENT_MEAS_CONFIG_PERIODICAL_UTRA….',
                   //'INTERNAL_EVENT_MEASUREMENT_REPORT_RECEIVED….',
                   //'INTERNAL_EVENT_MIMO_SLEEP_DETECTED….',
                   //'INTERNAL_EVENT_NEIGHBCELL_ADDITIONAL_CGI….',
                   //'INTERNAL_EVENT_NEIGHBCELL_CHANGE….',
                   //'INTERNAL_EVENT_NEIGHBENB_CHANGE….',
                   //'INTERNAL_EVENT_NEIGHBREL_ADD….',
                   //'INTERNAL_EVENT_NEIGHBREL_REMOVE….',
                   //'INTERNAL_EVENT_NO_RESET_ACK_FROM_MME….',
                   //'INTERNAL_EVENT_ONGOING_UE_MEAS….',
                   //'INTERNAL_EVENT_PCI_CONFLICT_DETECTED….',
                   //'INTERNAL_EVENT_PCI_CONFLICT_RESOLVED….',
                   //'INTERNAL_EVENT_PM_DATA_COLLECTION_LOST….',
                   //'INTERNAL_EVENT_PM_EVENT_SUSPECTMARKED….',
                   //'INTERNAL_EVENT_PM_RECORDING_FAULT_JVM….',
                   //'INTERNAL_EVENT_RECOMMENDED_NR_SI_UPDATES_REACHED….',
                   //'INTERNAL_EVENT_RESUME_LOW_ARP_DRB_DL_RLC_FAIL….',
                   //'INTERNAL_EVENT_RETAIN_UECTXT_HIGH_ARP_DRB….',
                   //'INTERNAL_EVENT_RIM_RAN_INFORMATION_RECEIVED….',
                   //'INTERNAL_EVENT_RIM_RAN_INFORMATION_SENT….',
                   //'INTERNAL_EVENT_RIM_RAN_STATUS_CHANGED….',
                   //'INTERNAL_EVENT_RRC_ERROR….',
                   //'INTERNAL_EVENT_RRC_UE_INFORMATION….',
                   //'INTERNAL_EVENT_S1_ERROR_INDICATION….',
                   //'INTERNAL_EVENT_S1_NAS_NON_DELIVERY_INDICATION….',
                   //'INTERNAL_EVENT_S1AP_PROTOCOL_ERROR….',
                   //'INTERNAL_EVENT_SON_OSCILLATION_DETECTED….',
                   //'INTERNAL_EVENT_SON_UE_OSCILLATION_PREVENTED….',
                   //'INTERNAL_EVENT_SPID_PRIORITY_IGNORED….',
                   //'INTERNAL_EVENT_TOO_EARLY_HO….',
                   //'INTERNAL_EVENT_TOO_LATE_HO….',
                   //'INTERNAL_EVENT_UE_ANR_CONFIG_PCI_REMOVE',
                   //'INTERNAL_EVENT_UE_ANR_CONFIG_PCI',
                   //'INTERNAL_EVENT_UE_ANR_PCI_REPORT',
                   //'INTERNAL_EVENT_UE_CAPABILITY',
                   //'INTERNAL_EVENT_UE_LB_MEAS',
                   //'INTERNAL_EVENT_UE_LB_QUAL',
                   //'INTERNAL_EVENT_UE_MEAS_FAILURE',
                   //'INTERNAL_EVENT_UE_MOBILITY_EVAL',
                   //'INTERNAL_EVENT_UETR_MEASUREMENT_REPORT_RECEIVED',
                   //'INTERNAL_EVENT_UETR_RRC_SCELL_DECONFIGURED',
                   //'INTERNAL_EVENT_UNEXPECTED_RRC_MSG',
                   //'INTERNAL_EVENT_WIFI_MOBILITY_EVAL_CONNECTED',
                   //'INTERNAL_EVENT_WIFI_MOBILITY_EVAL_IDLE',
                   //'INTERNAL_EVENT_X2_CONN_RELEASE',
                   //'INTERNAL_EVENT_X2_ERROR_INDICATION',
                   //'INTERNAL_EVENT_X2AP_PROTOCOL_ERROR',
                   //'INTERNAL_PER_BRANCH_UL_NOISEINTERF_REPORT',
                   //'INTERNAL_PER_CAP_LICENSE_UTIL_REP',
                   //'INTERNAL_PER_CELL_QCI_TRAFFIC_REP',
                   //'INTERNAL_PER_CELL_TRAFFIC_REPORT',
                   //'INTERNAL_PER_EVENT_CMAS_REPET_COMPL',
                   //'INTERNAL_PER_EVENT_ETWS_REPET_COMPL',
                   //'INTERNAL_PER_PRB_LICENSE_UTIL_REP',
                   //'INTERNAL_PER_PROCESSOR_LOAD',
                   //'INTERNAL_PER_RADIO_CELL_CQI_SUBBAND',
                   //'INTERNAL_PER_RADIO_CELL_MEASUREMENT_TDD',
                   //'INTERNAL_PER_RADIO_CELL_MEASUREMENT',
                   //'INTERNAL_PER_RADIO_CELL_NOISE_INTERFERENCE_PRB',
                   //'INTERNAL_PER_RADIO_UE_MEASUREMENT_TA',
                   //'INTERNAL_PER_RADIO_UE_MEASUREMENT',
                   //'INTERNAL_PER_RADIO_UTILIZATION',
                   //'INTERNAL_PER_UE_ACTIVE_SESSION_TIME',
                   //'INTERNAL_PER_UE_LCG_TRAFFIC_REP',
                   //'INTERNAL_PER_UE_RB_TRAFFIC_REP',
                   //'INTERNAL_PER_UE_TRAFFIC_REP',
                   //'INTERNAL_PER_UETR_BRANCH_UL_NOISEINTERF_REPORT',
                   //'INTERNAL_PER_UETR_CAP_LICENSE_UTIL_REP',
                   //'INTERNAL_PER_UETR_CELL_QCI_TRAFFIC_REP',
                   //'INTERNAL_PER_UETR_CELL_TRAFFIC_REPORT',
                   //'INTERNAL_PER_UETR_PRB_LICENSE_UTIL_REP',
                   //'INTERNAL_PER_UETR_RADIO_CELL_CQI_SUBBAND',
                   //'INTERNAL_PER_UETR_RADIO_CELL_MEASUREMENT_TDD',
                   //'INTERNAL_PER_UETR_RADIO_CELL_MEASUREMENT',
                   //'INTERNAL_PER_UETR_RADIO_CELL_NOISE_INTERFERENCE_PRB',
                   //'INTERNAL_PER_UETR_RADIO_UE_MEASUREMENT',
                   //'INTERNAL_PER_UETR_RADIO_UTILIZATION',
                   //'INTERNAL_PER_UETR_UE_ACTIVE_SESSION_TIME',
                   //'INTERNAL_PER_UETR_UE_LCG_TRAFFIC_REP',
                   //'INTERNAL_PER_UETR_UE_RB_TRAFFIC_REP',
                   //'INTERNAL_PER_UETR_UE_TRAFFIC_REP',
                   //'INTERNAL_PROC_ANR_CGI_REPORT',
                   //'INTERNAL_PROC_CELL_SLEEP_TRIGGERED',
                   //'INTERNAL_PROC_DNS_LOOKUP',
                   //'INTERNAL_PROC_ERAB_MODIFY',
                   //'INTERNAL_PROC_ERAB_RELEASE',
                   //'INTERNAL_PROC_ERAB_SETUP',
                   //'INTERNAL_PROC_HO_EXEC_S1_IN',
                   //'INTERNAL_PROC_HO_EXEC_S1_OUT',
                   //'INTERNAL_PROC_HO_EXEC_X2_IN',
                   //'INTERNAL_PROC_HO_EXEC_X2_OUT',
                   //'INTERNAL_PROC_HO_PREP_S1_IN',
                   //'INTERNAL_PROC_HO_PREP_S1_OUT',
                   //'INTERNAL_PROC_HO_PREP_X2_IN',
                   //'INTERNAL_PROC_HO_PREP_X2_OUT',
                   //'INTERNAL_PROC_INITIAL_CTXT_SETUP',
                   //'INTERNAL_PROC_M3_SETUP',
                   //'INTERNAL_PROC_MBMS_SESSION_START',
                   //'INTERNAL_PROC_MIMO_SLEEP_SWITCHED',
                   //'INTERNAL_PROC_NAS_TRANSFER_DL',
                   //'INTERNAL_PROC_NON_PLANNED_PCI_CGI_REPORT',
                   //'INTERNAL_PROC_REVERSE_DNS_LOOKUP',
                   //'INTERNAL_PROC_RRC_CONN_RECONF_NO_MOB',
                   //'INTERNAL_PROC_RRC_CONN_SETUP',
                   //'INTERNAL_PROC_RRC_CONNECTION_RE_ESTABLISHMENT',
                   //'INTERNAL_PROC_S1_SETUP',
                   //'INTERNAL_PROC_S1_SIG_CONN_SETUP',
                   //'INTERNAL_PROC_S1_TENB_CONF_LOOKUP',
                   //'INTERNAL_PROC_SCTP_SETUP',
                   //'INTERNAL_PROC_SCTP_SHUTDOWN',
                   //'INTERNAL_PROC_SOFT_LOCK',
                   //'INTERNAL_PROC_UE_CTXT_FETCH',
                   //'INTERNAL_PROC_UE_CTXT_MODIFY',
                   //'INTERNAL_PROC_UE_CTXT_RELEASE',
                   //'INTERNAL_PROC_UETR_RRC_SCELL_CONFIGURED',
                   //'INTERNAL_PROC_X2_RESET',
                   //'INTERNAL_PROC_X2_SETUP',
                   //'INTERNAL_UE_MEAS_ABORT',
                   //'M3_M3_SETUP_FAILURE',
                   //'M3_M3_SETUP_REQUEST',
                   //'M3_M3_SETUP_RESPONSE',
                   //'M3_MBMS_SESSION_START_FAILURE',
                   //'M3_MBMS_SESSION_START_REQUEST',
                   //'M3_MBMS_SESSION_START_RESPONSE',
                   //'M3_MBMS_SESSION_STOP_REQUEST',
                   //'M3_MBMS_SESSION_STOP_RESPONSE',
                   //'M3_MCE_CONFIGURATION_UPDATE_FAILURE',
                   //'M3_MCE_CONFIGURATION_UPDATE_REQUEST',
                   //'M3_MCE_CONFIGURATION_UPDATE_RESPONSE',
                   //'M3_RESET',
                   //'RRC_CONNECTION_RE_ESTABLISHMENT_COMPLETE',
                   //'RRC_CONNECTION_RE_ESTABLISHMENT',
                   //'RRC_CSFB_PARAMETERS_REQUEST_CDMA2000',
                   //'RRC_CSFB_PARAMETERS_RESPONSE_CDMA2000',
                   //'RRC_DL_INFORMATION_TRANSFER',
                   //'RRC_HANDOVER_FROM_EUTRA_PREPARATION_REQUEST',
                   //'RRC_INTER_FREQ_RSTD_MEASUREMENT_INDICATION',
                   //'RRC_MASTER_INFORMATION_BLOCK',
                   //'RRC_MBMS_INTEREST_INDICATION',
                   //'RRC_MBSFNAREA_CONFIGURATION',
                   //'RRC_MEASUREMENT_REPORT',
                   //'RRC_MOBILITY_FROM_E_UTRA_COMMAND_EXT',
                   //'RRC_MOBILITY_FROM_E_UTRA_COMMAND',
                   //'RRC_RRC_CONNECTION_RE_ESTABLISHMENT_REJECT',
                   //'RRC_RRC_CONNECTION_RE_ESTABLISHMENT_REQUEST',
                   //'RRC_RRC_CONNECTION_RECONFIGURATION_COMPLETE',
                   //'RRC_RRC_CONNECTION_RECONFIGURATION',
                   //'RRC_RRC_CONNECTION_REJECT',
                   //'RRC_RRC_CONNECTION_RELEASE',
                   //'RRC_RRC_CONNECTION_REQUEST',
                   //'RRC_RRC_CONNECTION_SETUP_COMPLETE',
                   //'RRC_RRC_CONNECTION_SETUP',
                   //'RRC_SECURITY_MODE_COMMAND',
                   //'RRC_SECURITY_MODE_COMPLETE',
                   //'RRC_SECURITY_MODE_FAILURE',
                   //'RRC_SYSTEM_INFORMATION_BLOCK_TYPE_1',
                   //'RRC_SYSTEM_INFORMATION',
                   //'RRC_UE_CAPABILITY_ENQUIRY',
                   //'RRC_UE_CAPABILITY_INFORMATION',
                   //'RRC_UE_INFORMATION_REQUEST',
                   //'RRC_UE_INFORMATION_RESPONSE',
                   //'RRC_UL_HANDOVER_PREPARATION_TRANSFER',
                   //'RRC_UL_INFORMATION_TRANSFER',
                   //'S1_DOWNLINK_NAS_TRANSPORT',
                   //'S1_DOWNLINK_NON_UE_ASSOCIATED_LPPA_TRANSPORT',
                   //'S1_DOWNLINK_S1_CDMA2000_TUNNELING_EXT',
                   //'S1_DOWNLINK_S1_CDMA2000_TUNNELING',
                   //'S1_DOWNLINK_UE_ASSOCIATED_LPPA_TRANSPORT',
                   //'S1_ENB_CONFIGURATION_TRANSFER',
                   //'S1_ENB_CONFIGURATION_UPDATE_ACKNOWLEDGE',
                   //'S1_ENB_CONFIGURATION_UPDATE_FAILURE',
                   //'S1_ENB_CONFIGURATION_UPDATE',
                   //'S1_ENB_DIRECT_INFORMATION_TRANSFER',
                   //'S1_ENB_STATUS_TRANSFER',
                   //'S1_ERAB_MODIFY_REQUEST',
                   //'S1_ERAB_MODIFY_RESPONSE',
                   //'S1_ERAB_RELEASE_COMMAND',
                   //'S1_ERAB_RELEASE_INDICATION',
                   //'S1_ERAB_RELEASE_REQUEST',
                   //'S1_ERAB_RELEASE_RESPONSE',
                   //'S1_ERAB_SETUP_REQUEST',
                   //'S1_ERAB_SETUP_RESPONSE',
                   //'S1_ERROR_INDICATION',
                   //'S1_HANDOVER_CANCEL_ACKNOWLEDGE',
                   //'S1_HANDOVER_CANCEL',
                   //'S1_HANDOVER_COMMAND',
                   //'S1_HANDOVER_FAILURE',
                   //'S1_HANDOVER_NOTIFY',
                   //'S1_HANDOVER_PREPARATION_FAILURE',
                   //'S1_HANDOVER_REQUEST_ACKNOWLEDGE',
                   //'S1_HANDOVER_REQUEST',
                   //'S1_HANDOVER_REQUIRED',
                   //'S1_INITIAL_CONTEXT_SETUP_FAILURE',
                   //'S1_INITIAL_CONTEXT_SETUP_REQUEST',
                   //'S1_INITIAL_CONTEXT_SETUP_RESPONSE',
                   //'S1_INITIAL_UE_MESSAGE',
                   //'S1_KILL_REQUEST',
                   //'S1_KILL_RESPONSE',
                   //'S1_LOCATION_REPORT_FAILURE_INDICATION',
                   //'S1_LOCATION_REPORT',
                   //'S1_LOCATION_REPORTING_CONTROL',
                   //'S1_MME_CONFIGURATION_TRANSFER',
                   //'S1_MME_CONFIGURATION_UPDATE_ACKNOWLEDGE',
                   //'S1_MME_CONFIGURATION_UPDATE_FAILURE',
                   //'S1_MME_CONFIGURATION_UPDATE',
                   //'S1_MME_DIRECT_INFORMATION_TRANSFER',
                   //'S1_MME_STATUS_TRANSFER',
                   //'S1_NAS_NON_DELIVERY_INDICATION',
                   //'S1_OVERLOAD_START',
                   //'S1_OVERLOAD_STOP',
                   //'S1_PAGING',
                   //'S1_PATH_SWITCH_REQUEST_ACKNOWLEDGE',
                   //'S1_PATH_SWITCH_REQUEST_FAILURE',
                   //'S1_PATH_SWITCH_REQUEST',
                   //'S1_RESET_ACKNOWLEDGE',
                   //'S1_RESET',
                   //'S1_S1_SETUP_FAILURE',
                   //'S1_S1_SETUP_REQUEST',
                   //'S1_S1_SETUP_RESPONSE',
                   //'S1_THROUGHPUT_ESTIMATION_REQUEST',
                   //'S1_THROUGHPUT_ESTIMATION_RESPONSE',
                   //'S1_UE_CAPABILITY_INFO_INDICATION',
                   //'S1_UE_CONTEXT_MODIFICATION_FAILURE',
                   //'S1_UE_CONTEXT_MODIFICATION_REQUEST',
                   //'S1_UE_CONTEXT_MODIFICATION_RESPONSE',
                   //'S1_UE_CONTEXT_RELEASE_COMMAND',
                   //'S1_UE_CONTEXT_RELEASE_COMPLETE',
                   //'S1_UE_CONTEXT_RELEASE_REQUEST',
                   //'S1_UPLINK_NAS_TRANSPORT',
                   //'S1_UPLINK_NON_UE_ASSOCIATED_LPPA_TRANSPORT',
                   //'S1_UPLINK_S1_CDMA2000_TUNNELING',
                   //'S1_UPLINK_UE_ASSOCIATED_LPPA_TRANSPORT',
                   //'S1_WIFI_ACCESS_DECISION_REQUEST',
                   //'S1_WIFI_ACCESS_DECISION_RESPONSE',
                   //'S1_WRITE_REPLACE_WARNING_REQUEST',
                   //'S1_WRITE_REPLACE_WARNING_RESPONSE',
                   //'UE_MEAS_EVENT_FEAT_NOT_AVAIL',
                   //'UE_MEAS_EVENT_NOT_CONFIG',
                   //'UE_MEAS_INTRAFREQ1',
                   //'UE_MEAS_INTRAFREQ2',
                   //'X2_CELL_ACTIVATION_FAILURE',
                   //'X2_CELL_ACTIVATION_REQUEST',
                   //'X2_CELL_ACTIVATION_RESPONSE',
                   //'X2_CONTEXT_FETCH_FAILURE',
                   //'X2_CONTEXT_FETCH_REQUEST',
                   //'X2_CONTEXT_FETCH_RESPONSE_ACCEPT',
                   //'X2_CONTEXT_FETCH_RESPONSE_REJECT',
                   //'X2_CONTEXT_FETCH_RESPONSE',
                   //'X2_ENB_CONFIGURATION_UPDATE_ACKNOWLEDGE',
                   //'X2_ENB_CONFIGURATION_UPDATE_FAILURE',
                   //'X2_ENB_CONFIGURATION_UPDATE',
                   //'X2_ERROR_INDICATION',
                   //'X2_HANDOVER_CANCEL',
                   //'X2_HANDOVER_PREPARATION_FAILURE',
                   //'X2_HANDOVER_REPORT',
                   //'X2_HANDOVER_REQUEST_ACKNOWLEDGE',
                   //'X2_HANDOVER_REQUEST',
                   //'X2_PRIVATE_MESSAGE',
                   //'X2_PROPRIETARY_CELL_SLEEP_FAILURE',
                   //'X2_PROPRIETARY_CELL_SLEEP_RESPONSE',
                   //'X2_PROPRIETARY_CELL_SLEEP_START_REQUEST',
                   //'X2_PROPRIETARY_CELL_SLEEP_STOP_REQUEST',
                   //'X2_RESET_REQUEST',
                   //'X2_RESET_RESPONSE',
                   //'X2_RLF_INDICATION',
                   //'X2_SN_STATUS_TRANSFER',
                   //'X2_UE_CONTEXT_RELEASE',
                   //'X2_X2_SETUP_FAILURE',
                   //'X2_X2_SETUP_REQUEST',
                   //'X2_X2_SETUP_RESPONSE'
                ]
            });



            logData.push({
                identifier: "RANKPIs", text: "RAN KPIs", interval: 1,
                data: [
                    'Accessibility<span class="glyphicon glyphicon-remove"></span>',
                    'Retainability',
                    'Monbility',
                    'Utilization',
                    'Traffic',
                    'Latency',
                    'Service Integrity'
                ]
            });


            logData.push({
                identifier: "LoadProbeData", text: "Loading Probe Data", interval: 1,
                data: [
                    'Loading S6 Interface Probe data….',
                    'Loading S11 Interface Probe data…..',
                    'Loading S1 Interface probe data…..',
                    'Loading Rx Interface Data…..',
                    'Loading Cx Interface Data…..',
                    'Loading ISC Interface Data…..',
                    'Loading SGI Inerface data….',
                    'Loading Mg Interface Data….',
                    'Loading Gx Interface data….',
                    'Loading S6a Interface Data….',
                    'Loading S5/S8 Interface data….'
                ]
            });


            logData.push({
                identifier: "ProcessProbeData", text: "Processing Probe Data", interval: 1,
                data: [
                    'Processing S6 Interface Probe data….',
                    'Processing S11 Interface Probe data….',
                    'Processing S1 Interface probe data….',
                    'Processing Rx Interface Data….',
                    'Processing Cx Interface Data….',
                    'Processing ISC Interface Data….',
                    'Processing SGI Interface data….',
                    'Processing Mg Interface Data….',
                    'Processing Gx Interface data….',
                    'Processing S6a Interface Data….',
                    'Processing S5/S8 Interface data….'
                ]
            });

            logData.push({
                identifier: "AnalyzeProtocol", text: "Analyzing Protocols", interval: 1,
                data: [
                    ' ESM Information Request….',
                    ' GUTI REALLOCATION COMMAND….',
                    ' GUTI REALLOCATION COMPLETE….',
                    ' Authentication Request….',
                    ' Authentication Response….',
                    ' Authentication Reject….',
                    ' Security Mode Command….',
                    ' Security Mode Complete….',
                    ' Security Mode Reject….',
                    //' Identity Request….',
                    //' Identity Response….',
                    //' Attach Request….',
                    //' Attach Accept….',
                    //' Attach Complete….',
                    //' Attach Reject….',
                    //' Detach Request….',
                    //' Detach Accept….',
                    //' EMM information….',
                    //' Tracking Area Update Request….',
                    //' Tracking Area Update Accept….',
                    //' Tracking Area Update Complete….',
                    //' Tracking Area Update Reject….',
                    //' Service Request….',
                    //' Service Accept….',
                    //' Service Reject….',
                    //' Extended Service Request….',
                    //' Extended Service Accept….',
                    //' Extended Service Reject….',
                    //' Activate Default EPS Bearer Context Request….',
                    //' Activate Default EPS Bearer Context Accept….',
                    //' Activate Default EPS Bearer Context Reject….',
                    //' Activate Dedicated EPS Bearer Context Request….',
                    //' Activate Dedicated EPS Bearer Context Accept….',
                    //' Activate Dedicated EPS Bearer Context Reject….',
                    //' Modify EPS Bearer Context Request….',
                    //' Modify EPS Bearer Context Accept….',
                    //' Modify EPS Bearer Context Reject….',
                    //' Deactivate EPS Bearer Context Request….',
                    //' Deactivate EPS Bearer Context Accept….',
                    //' PDN Connectivity Request….',
                    //' Activate EPS Default EPS Bearer Context Request….',
                    //' PDN Connectivity Reject….',
                    //' PDN Disconnect Request….',
                    //' Deacctivate EPS EPS Bearer Context Request….',
                    //' PDN Disconnect Reject….',
                    //' Bearer Resource Allocation Request….',
                    //' Bearer Resource Allocation Reject….',
                    //' Bearer Resource Modification Request….',
                    //' Bearer Resource Modification Reject….',
                    //' Handover Required….',
                    //' Handover Command….',
                    //' Handover Preparation Failure….',
                    //' Handover Request….',
                    //' Handover Request Acknowledge….',
                    //' Handover Failure….',
                    //' Path Swtich Request….',
                    //' Path Swtich Request Acknowledge….',
                    //' Path Swtich Request Failure….',
                    //' Handover Cancel….',
                    //' Handover Cancel Acknowledge….',
                    //' HandoverNotify….',
                    //' Erab Setup Request….',
                    //' Erab Setup Response….',
                    //' Erab Modify Request….',
                    //' Erab Modify Response….',
                    //' Erab Release Command….',
                    //' Erab Release Response….',
                    //' Erab Release Indication….',
                    //' Initial Context Setup Request….',
                    //' Initial Context Setup Response….',
                    //' Initial Context Setup Failure….',
                    //' UE Context Release Request….',
                    //' UE Context Release Command….',
                    //' UE Context Release Completed….',
                    //' UE Context Modification Request….',
                    //' UE Context Modification Response….',
                    //' eNB Configuration Update….',
                    //' eNB Configuration Update Acknowledge….',
                    //' eNB Configuration Update Failure….',
                    //' MME Configuration Update….',
                    //' MME Configuration Update Acknowledge….',
                    //' MME Configuration Update Failure….',
                    //' Write-Replace Warning Request….',
                    //' Write-Replace Warning Response….',
                    //' Overload Start….',
                    //' Overload Stop….',
                    //' S1 Setup Request….',
                    //' S1 Setup Response….',
                    //' S1 Setup Failure….',
                    //' Reset….',
                    //' Reset Acknowledge….',
                    //' S1AP Paging….',
                    //' S1 NAS Service Request….',
                    //'Evaluating Procedures - GTPV2….',
                    //'Create session request….',
                    //'Create session response….',
                    //'Modify bearer request….',
                    //'Modify bearer response….',
                    //'Delete Session request….',
                    //'Delete Session response….',
                    //'Create Bearer request….',
                    //'Create Bearer response….',
                    //'Update Bearer Request….',
                    //'Delete Bearer Request….',
                    //'Delete Bearer Response….',
                    //'Create Indirect Data Forwarding Tunnel Request….',
                    //'Create Indirect Data Forwarding Tunnel Response….',
                    //'Delete Indirect Data Forwarding Tunnel Request….',
                    //'Delete Indirect Data Forwarding Tunnel Response….',
                    //'Release Access Bearers Request….',
                    //'Release Access Bearers Response….',
                    //'Downlink Data Notification….',
                    //'Downlink Data Notification Acknowledge….',
                    //'Downlink Data Notification Failure Indication….',
                    //'Delete PDN Connection Set Request….',
                    //'Delete PDN Connection Set Response….',
                    //'Delete Bearer Command….',
                    //'Modify bearer Command….',
                    //'- Evaluating Procedures - Diameter….',
                    //'User-Authorization-Request (UAR)….',
                    //'User-Authorization-Answer (UAA)….',
                    //'Server-Assignment-Request (SAR)….',
                    //'Server-Assignment-Answer (SAA)….',
                    //'Location-Information-Request (LIR)….',
                    //'Location-Information-Answer (LIA)….',
                    //'Multimedia-Auth-Request (MAR)….',
                    //'Multimedia-Auth-Answer (MAA)….',
                    //'Registration-Registration-Request (RTR)….',
                    //'Registration-Registration-Answer (RTA)….',
                    //'Push-Profile-Request (PPR)….',
                    //'Push-Profile-Answer (PPA)….',
                    //'Credit Control Request - Initial (CCR)….',
                    //'Credit Control Answer - Granted (CCA)….',
                    //'Credit Control Request - Update (CCR)….',
                    //'Credit Control Answer - Update (CCA)….',
                    //'Credit Control Request - Event (CCR)….',
                    //'Credit Control Answer- Event (CCA)….',
                    //'Credit Control Request - Termination (CCR)….',
                    //'Credit Control Answer - Termination (CCA)….',
                    //'Re-Authorization Request (RAR)….',
                    //'Re-Authorization Answer (RAA)….',
                    //'Authentication & Authorization Request (AAR)….',
                    //'Authentication & Authorization Response (AAR)….',
                    //'Abort Session Request (ASR)….',
                    //'Abort Session Answer (ASR)….',
                    //'Session Termination Request (STR)….',
                    //'Session Termination Answer (STA)….',
                    //'- Evaluating Procedures - SIP Messages….',
                    //'INVITE….',
                    //'ACK….',
                    //'BYE….',
                    //'CANCEL….',
                    //'OPTIONS….',
                    //'PRACK….',
                    //'SUBSCRIBE….',
                    //'NOTIFY….',
                    //'PUBLISH….',
                    //'INFO….',
                    //'REFER….',
                    //'MESSAGE….',
                    //'UPDATE….',
                    //'REGISTER….',
                    //'Service Level SIP KPIs….',
                    //'SEER….',
                    //'SER….',
                    //'SCR….',
                    //'Call setup time….',
                    //'SDR….'
                ]
            });

            logData = [];

            logData.push({
                identifier: "EvaluateProblemCategories", text: "Evaluate Problem Categories", interval: 100,
                data: [
                    'Analyzing Protocol -  RRC',
                    'Analyzing Protocols - S1AP….',
                    'Analyzing Protocols - GTPV2….',
                    'Analyzing Protocols - Diameter….',
                    'Analyzing Protocols - SIP….'
                ]
            });


            logData.push({
                identifier: "FinalizingErrordomains", text: "Finalizing Error domains", interval: 100,
                data: [
                    'RAN  Problem Found - 2',
                    'EPC Problem Found-5',
                    'IMS Problem Found-11',
                    'Others Problem Found-14'
                ]
            });



            logData.push({
                identifier: "PerformingCrossdomainanalytics", text: "Performing Cross domain analytics", interval: 100,
                data: [
                    'Analyzing INTERNAL_PROC_S1_SETUP...',
                    'Analyzing INTERNAL_PROC_S1_SIG_CONN_SETUP...',
                    'Analyzing INTERNAL_PROC_S1_TENB_CONF_LOOKUP...',
                    'Analyzing INTERNAL_PROC_SCTP_SETUP...',
                    'Analyzing INTERNAL_PROC_UE_CTXT_RELEASE...',
                    'Analyzing RRC_CONNECTION_RE_ESTABLISHMENT_COMPLETE...',
                    'Analyzing RRC_CONNECTION_RE_ESTABLISHMENT...',
                    'Analyzing RRC_RRC_CONNECTION_SETUP...',
                    'Analyzing RRC_RRC_CONNECTION_SETUP_COMPLETE...',
                    'Analyzing RRC_SECURITY_MODE_COMMAND...',
                    'Analyzing RRC_SECURITY_MODE_COMPLETE...',
                    'Analyzing RRC_UE_CAPABILITY_ENQUIRY...',
                    'Analyzing RRC_UE_CAPABILITY_INFORMATION...',
                    'Analyzing RRC_UE_INFORMATION_REQUEST...',
                    'Analyzing RRC_UE_INFORMATION_RESPONSE...',
                    'Analyzing S1_ERAB_MODIFY_REQUEST...',
                    'Analyzing S1_ERAB_MODIFY_RESPONSE...',
                    'Analyzing S1_HANDOVER_PREPARATION_FAILURE...',
                    'Analyzing S1_INITIAL_CONTEXT_SETUP_FAILURE...',
                    'Analyzing X2_SETUP_FAILURE...',
                    'Analyzing X2_HANDOVER_PREPARATION_FAILURE...',
                    'Analyzing S1_HANDOVER_PREPARATION_FAILURE...',
                    'Analyzing RRC_SECURITY_MODE_FAILURE...',
                    'Decoding coverage parameters (RSRP, RSRQ)',
                    'Analyzing T300 timer values for corelation',
                    'Analyzing T301 timer value for corelation',
                    'Analyzing neighbor relations problematic cases',
                    'Analyzing  T310 timer value for corelation',
                    'Analyzing T311 timer value for corelation',
                    'Identifying poor coverage cases'
                ]
            });

            //logData.push({
            //    identifier: "Finalizingrootcauseofthefailures", text: "Finalizing root cause of the failures", interval: 1,
            //    data: [
            //      '- Bucketizing CN probelem signatures',
            //    '   -480_Temporarily Unavailable',
            //    '   -487_Request Terminated',
            //    '   -500_Server Internal Error',
            //    '   -503_Service Unavailable',
            //    '   -504_Server Time-out',
            //    ' - Bucketizing RAN probelem signatures',
            //    '   -Poor Coverage',
            //    '   -T300 Expired ',
            //    '   -T301 Expired',
            //    '   -T310 Expired',
            //    '   -T311 Expired'
            //    ]
            //});

            $scope.logData = logData;
            return;
        }

        //Load Static data
        function loadStaticKPIs($http) {
            if (commonService.isStaticData()) {
                $http.get("Data/failureData.json").success(function (data) {
                    $rootScope.sanKeynodeData = data["sanKeynodeData"];
                    $rootScope.sanKeyLinkData = data["sanKeyLinkData"];
                    console.log("broadcasting sankey");
                    $rootScope.$broadcast('reloadSankey');
                    console.log("broadcasted sankey");

                }).error(function (err) {
                    alert.log(err);
                })
            }
        }

    });
}());