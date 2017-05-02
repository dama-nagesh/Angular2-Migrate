'use strict';

angular.module('myApp.eq_dashboard', ['ngRoute', 'oc.lazyLoad', 'ngLoadingSpinner', 'ngCsv'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/equity/dashboard', {
            templateUrl: 'modules/equity/dashboard/dashboard.html',
            controller: 'eq_dashboardCtrl'
        });

    }])

    .controller('eq_dashboardCtrl', ['$http', '$scope', '$window', '$location', 'dataService_eq_dashboard', function ($http, $scope, $window, $location, dataService_eq_dashboard) {

        checkLogin();
        $scope.CustomerName = customerName();
        $(".page-header").show();
        $(".page-sidebar-wrapper").show();
        $(".page-footer").show();
        $("body").removeClass("login");

        $(".sort").click(function (e) {
            if ($(e.target).hasClass("backsort")) {
                $(e.target).removeClass("backsort").addClass("backupsort");
            } else if ($(".sort").hasClass("backdownsort")) {
                $(e.target).removeClass("backdownsort").addClass("backupsort");
            } else {
                $(e.target).addClass("backdownsort").removeClass("backupsort");
            }
            $(e.target).prevAll("th").removeClass("backdownsort backupsort").addClass("backsort");
            $(e.target).nextAll("th").removeClass("backdownsort backupsort").addClass("backsort");
        });

        function drawChart(dataJson) {
            // Create the data table.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Scheme Name');
            data.addColumn('number', 'Current Value');

            var rows = [];
            for (var d = 0; d < dataJson.length; d++) {
                var row = [];
                row.push(dataJson[d].Scheme);
                row.push(dataJson[d].CurrentValue);
                rows.push(row);
            }
            data.addRows(rows);
            // Set chart options
            var options = {
                pieHole: 0.4,
                legend: {position: 'right'},
                chartArea: {left: 20, top: 20, width: '100%', height: '90%'},
                colors: ['#EF5350', '#5C6BC0', '#42A5F5', '#66BB6A', '#FFCA28']
            };
            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
            chart.draw(data, options);
        }

        function loadData(data) {
            $scope.CountRecords = data.CustomerAssetAllocation.length;

            var totals=[0,0,0];
            $.each(data.CustomerAssetAllocation, function (key, value) {
                totals[0] += value.Units;
                totals[1] += value.CurrentPrice;
                totals[2] += value.CurrentValue;
            });

            $scope.filteredRecords = []
                , $scope.currentPage = 1
                , $scope.numPerPage = 10
                , $scope.maxSize = 5;

            $scope.$watch('currentPage + numPerPage', function () {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

                var finalArray = data.CustomerAssetAllocation.slice(begin, end);
                var a = {Scheme: "TOTAL", Units: totals[0], CurrentPrice: totals[1], CurrentValue: totals[2], ABS: 0};
                finalArray.push(a);
                $scope.items = finalArray;
            });

            drawChart(data.CustomerAssetAllocation);
        }

        dataService_eq_dashboard.getData().then(function (dataJson) {
            loadData(dataJson);
            $scope.apiData=dataJson;
            dataJson = dataJson.CustomerAssetAllocation;
            //$scope.ExcelData = dataJson;
            $scope.ExcelData = [];
            $.each(dataJson, function (index, val) {
                var tempObj = {
                    Scheme: val.Scheme,
                    Units: val.Units,
                    CurrentPrice: val.CurrentPrice,
                    CurrentValue: val.CurrentValue
                }
                $scope.ExcelData.push(tempObj);
            });

            $scope.filename = "Equity_Dashboard";
        });

        $scope.toggleDiv = function (e) {
            if ($("#eqdash").hasClass("collapse")) {
                $("#eqdashdiv1").hide();
                $("#eqdashdiv2").hide();
            }
            else {
                $("#eqdashdiv1").show();
                $("#eqdashdiv2").show();
            }
        }

        $scope.reload = function () {
            dataService_eq_dashboard.getData().then(function (dataJson) {
                dataJson = dataJson.CustomerAssetAllocation;
                $scope.items = dataJson;
                drawChart(dataJson);
            });
        }

        $scope.navigateToEqTransaction = function(schemeName){
            window.eqSchemeName=schemeName;
            $window.location.hash = "#!/equity/view_transaction";
        }

    $window.sort = "asc";
    $scope.orderByField = function (value) {
     var data = $scope.apiData;
     if (data.CustomerAssetAllocation != undefined || data.CustomerAssetAllocation != null) {
        if ($window.sort == "asc") {
            data.CustomerAssetAllocation.sort(function (a, b) {
                if (typeof a[value] == "string") {

                    var aDate = new Date(moment(a[value],'DD-MM-YYYY'));
                    var bDate = new Date(moment(b[value],'DD-MM-YYYY'));
                    if (aDate == "Invalid Date" || bDate == "Invalid Date") {
                        var nameA = a[value].toLowerCase(), nameB = b[value].toLowerCase()
                        if (nameA < nameB) //sort string ascending
                            return -1
                        if (nameA > nameB)
                            return 1
                        return 0 //default return value (no sorting)
                    }
                    else {
                        return aDate.getTime() - bDate.getTime() //sort by date ascending
                    }
                }
                else if (typeof a[value] == "number") {
                    return a[value] - b[value]
                }
            });
            $window.sort = "desc";
        }
        else {
            data.CustomerAssetAllocation.sort(function (a, b) {
                if (typeof a[value] == "string") {

                    var aDate = new Date(moment(a[value],'DD-MM-YYYY'));
                    var bDate = new Date(moment(b[value],'DD-MM-YYYY'));
                    if (aDate == "Invalid Date" || bDate == "Invalid Date") {
                        var nameA = a[value].toLowerCase(), nameB = b[value].toLowerCase()
                        if (nameA < nameB) //sort string descending
                            return 1
                        if (nameA > nameB)
                            return -1
                        return 0 //default return value (no sorting)
                    }
                    else {
                        return bDate.getTime() - aDate.getTime() //sort by date descending
                    }
                }
                else if (typeof a[value] == "number") {
                    return b[value] - a[value]
                }
            });
            $window.sort = "asc";
        }
    }
    loadData(data);
    }
    }])

    .factory('dataService_eq_dashboard', function ($q) {
        return {
            getData: function () {
                var deferred = $q.defer();

                $.ajax({
                    type: "POST",
                    data: "=" + JSON.stringify({
                        'CustomerId': window.sessionStorage.getItem("CustomerId"),
                        'AssetSubTypes': '1'
                    }),
                    beforeSend: function (request) {
                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        request.setRequestHeader("Authorization-Token", window.sessionStorage.getItem("Token"));
                    },
                    url: window.data.Mutualfund.Dashboard,
                    success: function (data) {
                        deferred.resolve(data);
                    }
                });

                return deferred.promise;
            }
        };
    });