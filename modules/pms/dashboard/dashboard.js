'use strict';

angular.module('myApp.pms_dashboard', ['ngRoute', 'oc.lazyLoad', 'ngLoadingSpinner', 'ngCsv'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/pms/dashboard', {
            templateUrl: 'modules/PMS/dashboard/dashboard.html',
            controller: 'pms_dashboardCtrl'
        });

    } ])

    .controller('pms_dashboardCtrl', ['$http', '$scope', '$window', '$location', 'dataService_pms_folio_list', 'dataService_pms_dashboard', function($http, $scope, $window, $location, dataService_pms_folio_list, dataService_pms_dashboard) {

        checkLogin();
        $scope.CustomerName = customerName();
        $scope.AsOn = moment(Date()).format('DD-MMM-YYYY');
        $(".page-header").show();
        $(".page-sidebar-wrapper").show();
        $(".page-footer").show();
        $("body").removeClass("login");

        function drawChart(dataJson) {
            dataJson = dataJson[0];
            debugger;
            // Create the data table.
            var data2 = new google.visualization.DataTable();
            data2.addColumn('string', 'Assets');
            data2.addColumn('number', 'Percentage');

            var rows = [];

            var row = [];
            row.push('Equity');
            row.push((dataJson.Equity / dataJson.TotalPort) * 100);
            rows.push(row);

            var row = [];
            row.push('Fixed Income');
            row.push((dataJson.FixedIncome / dataJson.TotalPort) * 100);
            rows.push(row);

            var row = [];
            row.push('Cash & Cash Equivalent');
            row.push((dataJson.CashOnHand / dataJson.TotalPort) * 100);
            rows.push(row);

            var row = [];
            row.push('Other');
            row.push((dataJson.Others / dataJson.TotalPort) * 100);
            rows.push(row);

            data2.addRows(rows);

            // Set chart options
            var options2 = {
                pieHole: 0.4,
                legend: { position: 'bottom' },
                chartArea: { left: 20, top: 20, width: '100%', height: '75%' },
                colors: ['#8BC34A', '#42A5F5', '#FFC107']
            };

            var chart2 = new google.visualization.PieChart(document.getElementById('chart_div'));
            chart2.draw(data2, options2);

        }

        dataService_pms_folio_list.getData().then(function(data) {
            $scope.items = data.CustomerPMSFolioList;
            $scope.dataItemSelected = data.CustomerPMSFolioList[0];
            if ($scope.dataItemSelected) {
                dataService_pms_dashboard.getData($scope.dataItemSelected.FolioMapId).then(function(data) {
                    loadData(data);
                });
            }
        });

        function loadData(dataJson) {
            dataJson = dataJson.customerPMSSummary;
            var data = dataJson[0];

            $scope.Equity = data.Equity;
            $scope.Equity_percent = (data.Equity / data.TotalPort) * 100;

            $scope.FixedIncome = data.FixedIncome;
            $scope.FixedIncome_percent = (data.FixedIncome / data.TotalPort) * 100;

            $scope.CashOnHand = data.CashOnHand;
            $scope.CashOnHand_percent = (data.CashOnHand / data.TotalPort) * 100;

            $scope.Others = data.Others;
            $scope.Others_percent = (data.Others / data.TotalPort) * 100;

            $scope.TotalPort = data.TotalPort;
            $scope.TotalPort_percent = '100%';

            $scope.ActiveDate = moment(data.ActiveDate).format('DD-MMM-YYYY');
            $scope.OpeningCorpus = data.OpeningCorpus;
            $scope.NetAddition = data.NetAddition;
            $scope.NetInvestment = data.NetInvestment;
            $scope.MKTValue = data.MKTValue;
            $scope.UnRealised = data.UnRealised;
            $scope.Realised = data.Realised;
            $scope.OtherIncome = data.Income;
            $scope.Expense = data.Expense;
            $scope.Total_EFGH = data.UnRealised + data.Realised + data.Income - data.Expense;
            $scope.OpenAvgRate = data.Expense;
            $scope.CloseAvgRate = ((((parseFloat(data.Income) + parseFloat(data.MKTValue)) / parseFloat(data.NetInvestment)) - 1) * 100).toFixed(2);
            $scope.SUB_LJ = data.OpenAvgRate - data.CloseAvgRate;
            $scope.SchemeName = data.SchemeName;
            $scope.XIRR = data.XIRR;

            $scope.ExcelData = [];
            $scope.tempObj1 =[];
            $scope.tempObj2=[];
            $scope.tempObj3=[];
            $scope.tempObj4=[];
            $scope.tempObj5=[];

            var tempObj1 = {
                AssetClass: 'Equity',
                MktVal: $scope.Equity,
                MktValPercentage: $scope.Equity_percent
            }
            var tempObj2 = {
                AssetClass: 'Fixed Income',
                MktVal: $scope.FixedIncome,
                MktValPercentage: $scope.FixedIncome_percent
            }
            var tempObj3 = {
                AssetClass: 'Cash & CashEquivalent',
                MktVal: $scope.CashOnHand,
                MktValPercentage: $scope.CashOnHand_percent
            }
            var tempObj4 = {
                AssetClass: 'Other',
                MktVal: $scope.Others,
                MktValPercentage: $scope.Others_percent
            }
            var tempObj5 = {
                AssetClass: 'Total',
                MktVal: $scope.TotalPort,
                MktValPercentage: $scope.TotalPort_percent
            }
            $scope.ExcelData.push(tempObj1);
            $scope.ExcelData.push(tempObj2);
            $scope.ExcelData.push(tempObj3);
            $scope.ExcelData.push(tempObj4);
            $scope.ExcelData.push(tempObj5);

            $scope.filename = "PMS_Dashboard";
            drawChart(dataJson);
        }

        $scope.ChangeOption = function() {
            dataService_pms_dashboard.getData($scope.dataItemSelected.FolioMapId).then(function(dataJson) {
                loadData(dataJson);
            });
        }

        $scope.toggleDiv = function(e) {
            if ($("#eqdash").hasClass("collapse")) {
                $("#eqdashdiv1").hide();
                $("#eqdashdiv2").hide();
            }
            else {
                $("#eqdashdiv1").show();
                $("#eqdashdiv2").show();
            }
        }

        $scope.reload = function() {
            dataService_pms_folio_list.getData().then(function(data) {
                $scope.items = data.CustomerPMSFolioList;
                $scope.dataItemSelected = data.CustomerPMSFolioList[0];
                if ($scope.dataItemSelected) {
                    dataService_pms_dashboard.getData($scope.dataItemSelected.FolioMapId).then(function(data) {
                        loadData(data);
                    });
                }
            });
        }
    } ])

    .factory('dataService_pms_folio_list', function($q) {
        return {
            getData: function() {
                var deferred = $q.defer();

                $.ajax({
                    type: "POST",
                    data: "=" + JSON.stringify({ 'CustomerId': window.sessionStorage.getItem("CustomerId") }),
                    beforeSend: function(request) {
                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        request.setRequestHeader("Authorization-Token", window.sessionStorage.getItem("Token"));
                    },
                    url: window.data.PMS.CustomerPMSFolioList,
                    success: function(data) {
                        deferred.resolve(data);
                    }
                });

                return deferred.promise;
            }
        };
    })

    .factory('dataService_pms_dashboard', function($q) {
        return {
            getData: function(selectedItem) {
                var deferred = $q.defer();

                $.ajax({
                    type: "POST",
                    data: "=" + JSON.stringify({ "FolioMapId": selectedItem }
                    ),
                    beforeSend: function(request) {
                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        request.setRequestHeader("Authorization-Token", window.sessionStorage.getItem("Token"));
                    },
                    url: window.data.PMS.CustomerPMSDashboard,
                    success: function(data) {
                        deferred.resolve(data);
                    }
                });

                return deferred.promise;
            }
        };
    });