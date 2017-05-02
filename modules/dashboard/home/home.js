'use strict';

angular.module('myApp.home', ['ngRoute', 'oc.lazyLoad', 'ngLoadingSpinner'])

    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'modules/dashboard/home/home.html',
            controller: 'homeCtrl'
        });
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};
    }])

    .controller('homeCtrl', ['$http', '$scope', '$window', '$location', 'dataService_dash_home', '$rootScope', function ($http, $scope, $window, $location, dataService_dash_home, $rootScope) {

        checkLogin();
        $scope.CustomerName = customerName();
        $(".page-header").show();
        $(".page-sidebar-wrapper").show();
        $(".page-footer").show();
        $("body").removeClass("login");


        $scope.assets = null;

        var url = $window.data.Dashboard.Main;
        var token = $window.sessionStorage.getItem("Token");

        $scope.dataMonthSelected = "365";

        $scope.monthChange = function () {
            getHomeData();
        }

        function getHomeData() {

            dataService_dash_home.getData($scope.dataMonthSelected).then(function (data) {

                $window.data_dashboard = data;
                var temp = data.LDashboardAssets;
                var totals = [0, 0];
                if (temp != null || temp.count > 0) {
                    temp.forEach(function (n, i) {
                        totals[0] += n.InvestedValue;
                        totals[1] += n.CurrentValue;
                        n.InvestedValue = n.InvestedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        n.CurrentValue = n.CurrentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    });
                }
                var finalArray = temp;
                var a = {
                    Assets: "",
                    InvestedValue: totals[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    CurrentValue: totals[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                };
                finalArray.push(a);
                $scope.assets = finalArray;

                var tempProducts = data.LDashboardProducts;
                var totalProducts = [0, 0];
                if (tempProducts != null || tempProducts.count > 0) {
                    tempProducts.forEach(function (n, i) {
                        totalProducts[0] += n.InvestedValue;
                        totalProducts[1] += n.CurrentValue;
                        n.InvestedValue = n.InvestedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        n.CurrentValue = n.CurrentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    });
                }
                var ProductsArray = tempProducts;
                var temparray = {
                    Product: "",
                    InvestedValue: totalProducts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    CurrentValue: totalProducts[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                };
                ProductsArray.push(temparray);
                $scope.products = ProductsArray;

                $scope.performances = data.LDashboardPerformance;

                var earnings = data.LDashboardEarnings;
                var performance = data.LDashboardPerformance;


                google.charts.setOnLoadCallback(drawChart);

                function drawChart() {
                    var c = [];
                    var nf = {};
                    var color = ['#8BC34A', '#42A5F5', '#8BC34A', '#42A5F5', '#8BC34A', '#42A5F5'];
                    var p = [];
                    var isAdd = false;

                    if (performance.length >= 1) {
                        p.push(performance[0].Assets);
                        p.push(parseFloat(performance[0].Total));
                        p.push(color[0]);
                        p.push(parseFloat(performance[0].ABS) + '%'
                            + ' (' + Math.floor(performance[0].Total).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ')');
                    }

                    var data = google.visualization.arrayToDataTable([
                        ['Asset', 'XIRR (%)', {
                            role: 'style'
                        }, {
                            role: 'annotation'
                        }], p
                    ]);

                    for (var i = 1; i < performance.length; i++) {
                        c.push({'v': performance[i].Assets});
                        c.push({'v': parseFloat(performance[i].Total)});
                        c.push({'v': color[i]});
                        c.push({
                            'v': parseFloat(performance[i].ABS) + '%'
                            + ' (' + Math.floor(performance[i].Total).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ')'
                        });
                        nf = {'c': c};
                        console.log(data);
                        if (typeof(data.Nf) != 'undefined')
                            data.Nf.push(nf);
                        else
                            data.qg.push(nf);
                    }

                    var options = {
                        legend: {
                            position: 'none'
                        }
                    };

                    var data3 = google.visualization.arrayToDataTable([
                        ['Asset', 'INR', {
                            role: 'style'
                        }, {
                            role: 'annotation'
                        }],
                        ['DIVIDEND', earnings.Dividend, '#4B77BE', earnings.Dividend],
                        ['BOOK P/L', earnings.RealizedPL, '#E87E04', earnings.RealizedPL],
                        ['TOTAL', earnings.Total, '#2C3E50', earnings.Total]
                    ]);
                    var options3 = {
                        legend: {
                            position: 'none'
                        }
                    };

                    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
                    chart.draw(data, options);
                    var chart3 = new google.visualization.ColumnChart(document.getElementById('chart_div3'));
                    chart3.draw(data3, options3);
                }
            });
        }

        $scope.navigateToPlans = function (asset) {
            if (asset.toUpperCase() == "EQUITY") {
                $window.location.hash = "#!/my_plans";
                $rootScope.planValue = 1;
            }
            else if (asset.toUpperCase() == "DEBT") {
                $window.location.hash = "#!/my_plans";
                $rootScope.planValue = 0;
            }
        }
        $scope.navigateToProduct = function (product) {
            if (product == "MUTUAL FUND") {
                $window.location.hash = "#!/mutual_fund/dashboard";
            }
            else if (product == "STOCK" || product == "BOND") {
                $window.location.hash = "#!/equity/dashboard";

            }
            else if (product == "MANAGED ACCOUNT") {
                $window.location.hash = "#!/pms/dashboard";

            }
        }


        getHomeData();
        $scope.dataMonthSelected = "365";

        $scope.reload = function () {
            getHomeData();
        }
    }])

    .factory('dataService_dash_home', function ($q) {
        return {
            getData: function (dataMonthSelected) {
                var deferred = $q.defer();

                $.ajax({
                    type: "POST",
                    data: "=" + JSON.stringify({
                        'CustomerId': window.sessionStorage.getItem("CustomerId"),
                        'AssetType': '0',
                        'days': dataMonthSelected
                    }),
                    beforeSend: function (request) {
                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        request.setRequestHeader("Authorization-Token", window.sessionStorage.getItem("Token"));
                    },
                    url: window.data.Dashboard.Main,
                    success: function (data) {
                        deferred.resolve(data);
                    }
                });

                return deferred.promise;
            }
        };
    });