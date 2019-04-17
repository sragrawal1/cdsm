'use strict';

//var commonModule = angular.module('commonModule', ['ngRoute', 'kendo.directives']);
//var loginModule = angular.module('loginModule', ['ngRoute', 'kendo.directives', 'commonModule']);
//var cdsmApp = angular.module('cdsmApp', ['ngRoute', 'kendo.directives', 'loginModule', 'commonModule']);

var commonModule = angular.module('commonModule', ['ngRoute', 'kendo.directives', 'angular.filter', 'ngCookies', 'ngStorage']);
var loginModule = angular.module('loginModule', ['commonModule']);
var cdsmApp = angular.module('cdsmApp', ['loginModule']);

