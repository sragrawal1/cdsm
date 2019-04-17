(function () {
    'use strict';
    cdsmApp.controller('roeController', function roeController($scope, globalService, commonService, helperService, $rootScope, rcaService, $timeout, $location, $http) {
        
        var markers;
        var locations;

        markers = [{ "latlong": [30.2675, -97.7409], "siteName": "Site 1", "siteID": "1" },
{ "latlong": [30.2707, -97.7490], "siteName": "Site 2", "siteID": "2" },
{ "latlong": [30.2705, -97.7409], "siteName": "Site 3", "siteID": "3" },
{ "latlong": [30.2686, -97.7494], "siteName": "Site 4", "siteID": "4" }];

        markers = [{ "locationId": 1, "siteId": 1, "siteName": "Herndon 1", "latlong": [38.985391, -77.382516], "details": "Details 1", "shape": "greenSite"},
{ "locationId": 1, "siteId": 1, "siteName": "Herndon 2", "latlong": [38.966842, -77.370586], "details": "Details 2", "shape": "greenSite" },
{ "locationId": 1, "siteId": 1, "siteName": "Herndon 3", "latlong": [38.972113, -77.407150], "details": "Details 3", "shape": "redSite" },
{ "locationId": 1, "siteId": 1, "siteName": "Herndon 4", "latlong": [38.954294, -77.383203], "details": "Details 4", "shape": "redSite" },
{ "locationId": 2, "siteId": 1, "siteName": "Los Angeles 1", "latlong": [34.181134, -118.633260], "details": "Details 5" },
{ "locationId": 2, "siteId": 1, "siteName": "Los Angeles 2", "latlong": [33.723198, -118.306417], "details": "Details 6" },
{ "locationId": 2, "siteId": 1, "siteName": "Los Angeles 3", "latlong": [34.017381, -118.353108], "details": "Details 7" },
{ "locationId": 2, "siteId": 1, "siteName": "Los Angeles 4", "latlong": [34.259487, -118.435506], "details": "Details 8" },
{ "locationId": 3, "siteId": 1, "siteName": "Miami 1", "latlong": [25.780203, -80.242123], "details": "Details 9" },
{ "locationId": 3, "siteId": 1, "siteName": "Miami 2", "latlong": [25.839854, -80.199895], "details": "Details 10" },
{ "locationId": 3, "siteId": 1, "siteName": "Miami 3", "latlong": [25.779893, -80.196118], "details": "Details 11" },
{ "locationId": 3, "siteId": 1, "siteName": "Miami 4", "latlong": [25.742171, -80.155606], "details": "Details 12" }];





        $scope.$on('onDateChangeEvent', function () {
            //$scope.selectedDate = globalService.getSelectedDate();
            //$scope.$apply();
        });

        init();

        function init()
        {
            createMap();
            loadLocations();
        }

        function loadLocations() {
            locations = [{ "locationId": 1, "locationName": "Herndon", "locationLatLong": [38.9696, -77.3861] },
                { "locationId": 1, "locationName": "Los Angeles", "locationLatLong": [34.0522, -118.2437] },
            { "locationId": 1, "locationName": "Miami", "locationLatLong": [25.7617, -80.1918] }
            ];

            $scope.locationOptions = {
                dataTextField: "locationName",
                dataValueField: "locationId",
                dataSource: locations,
                change: function (e) {
                    locationChange();
                }
            };
            $scope.selectedLocation = locations[0];
            //locationChange();
        }


        function locationChange()
        {
            try {
                var selectedLocation = $scope.selectedLocation;
                //alert(selectedLocation.locationName);
                var map = $("#map").data("kendoMap");
                map.center(selectedLocation.locationLatLong).zoom(10);

                $scope.markers = $.grep(markers, function (e) { return e.locationId == selectedLocation.locationId });
                $scope.$apply();
            } catch (e) {
                alert(e);
            }
        }


        $scope.revenueChartOptions =
            {
                title: {
                    text: "Title"
                },
                legend: {
                    visible: false
                },
                series: [{
                    type: "area",
                    data: [20, 1, 18, 3, 15, 5, 10, 6, 9, 6, 10, 5, 13, 3, 16, 1, 19, 1, 20, 2, 18, 5, 12, 7, 10, 8],
                    line: {
                        style: "smooth"
                    }
                }],
                categoryAxis: {
                    title: {
                        text: "time"
                    },
                    majorGridLines: {
                        visible: false
                    },
                    majorTicks: {
                        visible: false
                    }
                },
                valueAxis: {
                    max: 22,
                    title: {
                        text: "voltage"
                    },
                    majorGridLines: {
                        visible: false
                    },
                    visible: false
                }
            };


        $scope.ARPSChartOptions = {
            title: {
                position: "bottom",
                text: "Share of Internet Population Growth, 2007 - 2012"
            },
            legend: {
                visible: false
            },
            chartArea: {
                background: ""
            },
            seriesDefaults: {
                labels: {
                    visible: true,
                    background: "transparent",
                    template: "#= category #: \n #= value#%"
                }
            },
            series: [{
                type: "pie",
                startAngle: 150,
                data: [{
                    category: "Asia",
                    value: 53.8,
                    color: "#9de219"
                }, {
                    category: "Europe",
                    value: 16.1,
                    color: "#90cc38"
                }, {
                    category: "Latin America",
                    value: 11.3,
                    color: "#068c35"
                }, {
                    category: "Africa",
                    value: 9.6,
                    color: "#006634"
                }, {
                    category: "Middle East",
                    value: 5.2,
                    color: "#004d38"
                }, {
                    category: "North America",
                    value: 3.6,
                    color: "#033939"
                }]
            }],
            tooltip: {
                visible: true,
                format: "{0}%"
            }
        };
        $scope.usageChartOptions = {
            legend: {
                position: "bottom",
                labels: {
                    font: "11px 'open sans'",
                    color: "gray",
                    //margin: { right: 8 }
                }
            },
            seriesDefaults: {
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
                            type: "donut",
                            data: [
                                    { category: "Item 1", value: 65, name: "Item 1" },
                                    { category: "Item 2", value: 5, name: "Item 2" },
                                    { category: "Item 3", value: 15, name: "Item 3" },
                                    { category: "Item 4", value: 14, name: "Item 4" }
                                ]
                        }
            ],
            seriesColors: ['#1ab394', '#f8ac59', '#23c6c8', '#ed5565', '#98df8a', '#1f77b4', '#aec7e8', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],
            tooltip: {
                visible: true,
                template: "#= category # - #= kendo.format('{0:P}', percentage) #"
            }
        };

        function createMap() {

            $scope.mapOptions = {
                center: [30.268107, -97.744821],
                zoom: 10,
                layers: [{
                    type: "tile",
                    urlTemplate: "http://#= subdomain #.tile.openstreetmap.org/#= zoom #/#= x #/#= y #.png",
                    subdomains: ["a", "b", "c"],
                    attribution: "&copy; <a href='http://osm.org/copyright'>OpenStreetMap contributors</a>"
                },
                {
                    type: "marker",
                    dataSource: markers,
                    locationField: "latlong",
                    titleField: "siteName",
                }
                ],
                markerClick: function (e) {
                    //alert('Click Fired');
                },
                markerCreated: function (e) {
                    // Draw a shape (circle) instead of a marker
                    e.marker.options.shape = e.marker.dataItem.shape;
                }
            };

            //$("#map").kendoMap({
            //    center: [30.268107, -97.744821],
            //    zoom: 10,
            //    layers: [{
            //        type: "tile",
            //        urlTemplate: "http://#= subdomain #.tile.openstreetmap.org/#= zoom #/#= x #/#= y #.png",
            //        subdomains: ["a", "b", "c"],
            //        attribution: "&copy; <a href='http://osm.org/copyright'>OpenStreetMap contributors</a>"
            //    },
            //    {
            //        type: "marker",
            //        dataSource: $scope.markers,
            //        locationField: "latlong",
            //        titleField: "siteName"
            //    }
            //    ],
            //    markerClick: function (e) {
            //    }
            //});
        }
    });
}());