'use strict';

angular.module('myApp.my_plans_performance', ['ngRoute', 'oc.lazyLoad', 'ngLoadingSpinner'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/my_plans_performance', {
            templateUrl: 'modules/my_plans/performance/performance.html',
            controller: 'my_plans_performanceCtrl'
        });
    }])

    .controller('my_plans_performanceCtrl', ['$http', '$scope', '$window', '$location', function ($http, $scope, $window, $location) {

        checkLogin();
        $scope.CustomerName = customerName();
        $(".page-header").show();
        $(".page-sidebar-wrapper").show();
        $(".page-footer").show();
        $("body").removeClass("login");

        function drawChart() {


            var data = new google.visualization.DataTable();
            data.addColumn('number', 'Day');
            data.addColumn('number', 'Model Portfolio');
            data.addColumn('number', 'Actual Return');
            data.addColumn('number', 'Index Return');

            data.addRows([
                [1, 0, 80.8, 41.8],
                [2, 10, 69.5, 32.4],
                [3, 20, 57, 25.7],
                [4, 30, 18.8, 10.5],
                [5, 40, 17.6, 10.4],
                [6, 50, 13.6, 7.7],
                [7, 60, 12.3, 9.6],
                [8, 70, 29.2, 10.6],
                [9, 80, 42.9, 14.8],
                [10, 90, 30.9, 11.6],
                [11, 100, 7.9, 4.7],
                [12, 110, 8.4, 5.2],
                [13, 120, 6.3, 3.6],
                [14, 130, 6.2, 3.4]
            ]);

            var options = {
                legend: {position: 'bottom'},

                chart: {
                    title: 'Performance of equity',
                    subtitle: 'in (INR)'
                },

                //width: 900,
                height: 500,

                axes: {
                    x: {
                        0: {side: 'bottom'}
                    }
                }
            };

            var chart = new google.charts.Line(document.getElementById('line_top_x'));

            chart.draw(data, options);

        }

        drawChart();

    }]);