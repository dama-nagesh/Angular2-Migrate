'use strict';

angular.module('myApp.coming_soon', ['ngRoute', 'oc.lazyLoad'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/coming_soon', {
            templateUrl: 'modules/common/coming_soon/coming_soon.html',
            controller: 'coming_soonCtrl'
        });
    }])

    .controller('coming_soonCtrl', ['$http', '$scope', '$window', '$location', '$rootScope', function ($http, $scope, $window, $location, $rootScope) {

        $(".page-header").show();
        $(".page-sidebar-wrapper").show();
        $(".page-footer").show();
        $("body").removeClass("login");


    }]);