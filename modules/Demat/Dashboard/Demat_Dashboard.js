/**
* Created by smishra on 10/20/2016.
*/
'use strict';
angular.module('myApp.Demat_Demat_Dashboard', ['ngRoute', 'oc.lazyLoad', 'ngLoadingSpinner', 'ngCsv'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/Demat/Dashboard', {
            templateUrl: 'modules/Demat/Dashboard/Demat_Dashboard.html',
            controller: 'Demat_DashboardCtrl'
        });

    } ])
    .controller('Demat_DashboardCtrl', ['$http', '$scope', '$window', '$location', 'dataService_demat_dashboard', function($http, $scope, $window, $location, dataService_demat_dashboard) {
        checkLogin();
        $scope.CustomerName = customerName();

        $(".page-header").show();
        $(".page-sidebar-wrapper").show();
        $(".page-footer").show();
        $("body").removeClass("login");
        $scope.items = [];


        function loadData(data) {
            $scope.CountRecords = data.CustomerDematSummary.length;
            $scope.ExcelData = [];
            $.each(data.CustomerDematSummary, function (index, val) {
                var tempObj = {
                    ScripName: val.ScripName,
                    DPID: val.DPID,
                    ISIN: val.ISIN,
                    FreeQty: val.FreeQty,
                    Price: val.Price,
                    Amount: val.Amount
                }
                $scope.ExcelData.push(tempObj);
            });

            $scope.filename = "Demat_Dashboard";
            var totals = [0, 0];
            $.each(data.CustomerDematSummary, function(key, value) {
                totals[0] += parseFloat(value.Amount);
                totals[1] += parseFloat(value.FreeQty);
            });

            $scope.filteredRecords = []
                , $scope.currentPage = 1
                , $scope.numPerPage = 10
                , $scope.maxSize = 5;

            $scope.$watch('currentPage + numPerPage', function() {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

                var finalArray = data.CustomerDematSummary.slice(begin, end);
                var a = {
                    ScripName: "TOTAL",
                    DPID: "",
                    ISIN: "",
                    FreeQty: Math.round(parseFloat(totals[1])),
                    Price: "",
                    Amount:  Math.round(parseFloat(totals[0])) 
                };
                finalArray.push(a);
                $scope.items = finalArray;
            });
        }
        function loadDematCash(data) {
            var dematCach = data.CustomerDematCash[0];
            $scope.ClientCode = dematCach.ClientCode;
            $scope.BankName = dematCach.BankName;
            $scope.ACCNum = dematCach.ACCNum;
            $scope.DPID = dematCach.DPID;
            $scope.CashBalance = dematCach.CashBalance + ' Cr';
            $scope.ClearCashBalance = dematCach.ClearCashBalance;
            $scope.UnClearCashBalance = dematCach.UnClearCashBalance;
            $scope.AsOn = data.CustomerDematSummary[0].TransDate;
        }


        dataService_demat_dashboard.getData().then(function(data) {
            $window.localStorage.setItem("Demat_Holding_Summary", JSON.stringify(data));
            $scope.apiData = data;
            loadData(data);
            loadDematCash(data);
        });


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


    } ])


    .factory('dataService_demat_dashboard', function($q) {
        return {
            getData: function() {
                var deferred = $q.defer();
                $.ajax({
                    type: "POST",
                    data: "=" + JSON.stringify({ "CustomerId": window.sessionStorage.getItem("CustomerId") }
                    ),
                    beforeSend: function(request) {
                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        request.setRequestHeader("Authorization-Token", window.sessionStorage.getItem("Token"));
                    },
                    url: window.data.PMS.CustomerDematSummary,
                    success: function(data) {
                        deferred.resolve(data);
                    }
                });

                return deferred.promise;
            }
        };
    });