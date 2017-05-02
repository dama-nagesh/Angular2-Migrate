'use strict';

angular.module('myApp.eq_view_transaction', ['ngRoute', 'oc.lazyLoad', 'ngCsv', 'ui.bootstrap'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/equity/view_transaction', {
            templateUrl: 'modules/equity/view_transaction/view_transaction.html',
            controller: 'eq_view_transactionCtrl'
        });

    } ])

    .controller('eq_view_transactionCtrl', ['$http', '$scope', '$window', '$location', 'dataService_eq_view_transaction', 'dataService_eq_scheme_name', function($http, $scope, $window, $location, dataService_eq_view_transaction, dataService_eq_scheme_name) {

        checkLogin();
        $scope.CustomerName = customerName();
        $(".page-header").show();
        $(".page-sidebar-wrapper").show();
        $(".page-footer").show();
        $("body").removeClass("login");
        $scope.items = [];
        $scope.dataMonthSelected = "1";

        $(".sort").click(function(e) {
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



        dataService_eq_scheme_name.getData().then(function(data) {
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var FromDate, ToDate;
            var curr = new Date;
            $scope.SchemeItems = data.CustomerScehemeDetailsList;
            if(typeof(window.eqSchemeName)!="undefined") {
                data.CustomerScehemeDetailsList.forEach(function(n,i){
                    if(n.SchemeName == window.eqSchemeName){
                        $scope.dataItemSelected = n;
                    }
                });

                window.eqSchemeName=undefined;
                $scope.dataMonthSelected ="6";
                FromDate = '1 Jan 2001';
                ToDate = curr.getDate() + ' ' + months[curr.getMonth()] + ' ' + curr.getFullYear();
            }else {
                $scope.dataItemSelected = data.CustomerScehemeDetailsList[0];
                FromDate = curr.getDate() - 1 + ' ' + months[curr.getMonth()] + ' ' + curr.getFullYear();
                ToDate = curr.getDate() + ' ' + months[curr.getMonth()] + ' ' + curr.getFullYear();
            }

            var eq_trans_obj = {
                "Scheme": $scope.dataItemSelected.SchemeCode.toString(),
                "FromDate": FromDate,
                "ToDate": ToDate,
                "AssetSubTypes": "1",
                "CustomerId": window.sessionStorage.getItem("CustomerId")
            };

            dataService_eq_view_transaction.getData(eq_trans_obj).then(function(data) {
                $window.localStorage.setItem("eq_view_transaction", JSON.stringify(data));
                $scope.apiData = data;
                $scope.ExcelData = data.CustomerTransaction;
                $scope.filename = "Equity_ViewTransaction";
                loadData(data);
            });
        });

        $scope.ChangeOption = function() {
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            var x = $scope.dataMonthSelected;
            var FromDate;
            var ToDate;
            var curr = new Date;
            if (x == "1") {
                FromDate = curr.getDate() - 1 + ' ' + months[curr.getMonth()] + ' ' + curr.getFullYear();
                ToDate = curr.getDate() + ' ' + months[curr.getMonth()] + ' ' + curr.getFullYear();
            }
            else
                if (x == "2") {
                var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
                var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
                FromDate = firstday.getDate() + ' ' + months[firstday.getMonth()] + ' ' + firstday.getFullYear();
                ToDate = lastday.getDate() + ' ' + months[lastday.getMonth()] + ' ' + lastday.getFullYear();
            }
            else
                if (x == "3") {
                var firstday = new Date(curr.getFullYear(), curr.getMonth(), 1);
                var lastday = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
                FromDate = firstday.getDate() + ' ' + months[firstday.getMonth()] + ' ' + firstday.getFullYear();
                ToDate = lastday.getDate() + ' ' + months[lastday.getMonth()] + ' ' + lastday.getFullYear();
            }
            else
                if (x == "4") {
                    if (curr.getDate() >= 1 && curr.getMonth() >= 3) {
                        FromDate = 1 + ' ' + 'Apr' + ' ' + curr.getFullYear();
                        ToDate = curr.getDate() + ' ' + months[curr.getMonth()] + ' ' + curr.getFullYear();
                    }
                    else {
                        FromDate = 1 + ' ' + 'Apr' + ' ' + (curr.getFullYear() - 1);
                        ToDate = curr.getDate() + ' ' + months[curr.getMonth()] + ' ' + curr.getFullYear();
                    }
                }
                else
                if (x == "5") {
                    if (curr.getDate() >= 1 && curr.getMonth() >= 3) {
                        FromDate = 1 + ' ' + 'Apr' + ' ' + (curr.getFullYear() - 1);
                        ToDate = 31 + ' ' + 'Mar' + ' ' + curr.getFullYear();
                    }
                    else {
                        FromDate = 1 + ' ' + 'Apr' + ' ' + (curr.getFullYear() - 2);
                        ToDate = 31 + ' ' + 'Mar' + ' ' + (curr.getFullYear() - 1);
                    }
                }
            else
                if (x == "6") {
                FromDate = '1 Jan 2001';
                ToDate = curr.getDate() + ' ' + months[curr.getMonth()] + ' ' + curr.getFullYear();
            }
            var eq_trans_obj = {
                "Scheme": $scope.dataItemSelected.SchemeCode.toString(),
                "FromDate": FromDate,
                "ToDate": ToDate,
                "AssetSubTypes": "1",
                "CustomerId": window.sessionStorage.getItem("CustomerId")
            };
            dataService_eq_view_transaction.getData(eq_trans_obj).then(function(data) {
                $window.localStorage.setItem("eq_view_transaction", JSON.stringify(data));
                $scope.apiData = data;
                $scope.ExcelData = data.CustomerTransaction;
                $scope.filename = "Equity_ViewTransaction";
                loadData(data);
            });
        }

        function loadData(data) {
            $scope.CountRecords = data.CustomerTransaction.length;


            $scope.filteredRecords = []
                , $scope.currentPage = 1
                , $scope.numPerPage = 10
                , $scope.maxSize = 5;

            $scope.$watch('currentPage + numPerPage', function() {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

                var finalArray = data.CustomerTransaction.slice(begin, end);
                $scope.items = finalArray;
            });
        }
        $window.sort = "asc";
        $scope.orderByField = function(value) {
            var data = $scope.apiData;
            if (data.CustomerTransaction != undefined || data.CustomerTransaction != null) {
                if ($window.sort == "asc") {
                    data.CustomerTransaction = data.CustomerTransaction.sort(function(a, b) {
                        if (value == "InvName" || value == "Folio" || value == "TransType") {
                            return a[value].localeCompare(b[value]);
                        }
                        else {
                            return (a[value] > b[value]) ? 1 : ((a[value] < b[value]) ? -1 : 0);
                        }
                    })

                    $window.sort = "desc";
                }
                else {
                    data.CustomerTransaction = data.CustomerTransaction.sort(function(a, b) {
                    if (value == "InvName" || value == "Folio" || value == "TransType") {
                            return b[value].localeCompare(a[value]);
                        }
                        else {
                            return (b[value] > a[value]) ? 1 : ((b[value] < a[value]) ? -1 : 0);
                        }
                    })
                    $window.sort = "asc";
                }
            }
            loadData(data);
        }

        $scope.orderByFieldDate = function(value){
            var data = $scope.apiData;
            if (data.CustomerTransaction != undefined || data.CustomerTransaction != null) {
                if ($window.sort == "asc") {
                    data.CustomerTransaction = data.CustomerTransaction.sort(function(a, b) {
                        var aDate= moment(a[value],"DD-MM-YYYY");
                        var bDate = moment(b[value],"DD-MM-YYYY");
                        if(aDate > bDate) return 1;
                        else if(aDate <bDate) return -1;
                        else return 0;
                    })

                    $window.sort = "desc";
                }
                else {
                    data.CustomerTransaction = data.CustomerTransaction.sort(function(a, b) {
                        var aDate= moment(a[value],"DD-MM-YYYY");
                        var bDate = moment(b[value],"DD-MM-YYYY");
                        if(aDate > bDate) return -1;
                        else if(aDate <bDate) return 1;
                        else return 0;
                    })
                    $window.sort = "asc";
                }
            }
            loadData(data);
        }

        $scope.toggleDiv = function(e) {
            if ($("#eqvt").hasClass("collapse")) {
                $("#eqvtdiv1").hide();
            }
            else {
                $("#eqvtdiv1").show();
            }
        }
    } ])

    .factory('dataService_eq_scheme_name', function($q) {
        return {
            getData: function() {
                var deferred = $q.defer();

                $.ajax({
                    type: "POST",
                    data: "=" + JSON.stringify({
                        'CustomerId': window.sessionStorage.getItem("CustomerId"),
                        "AssetSubTypes": "1"
                    }),
                    beforeSend: function(request) {
                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        request.setRequestHeader("Authorization-Token", window.sessionStorage.getItem("Token"));
                    },
                    url: window.data.Mutualfund.GetSchemeNameList,
                    success: function(data) {
                        deferred.resolve(data);
                    }
                });

                return deferred.promise;
            }
        };
    })
    .factory('dataService_eq_view_transaction', function($q) {
        return {
            getData: function(eq_trans_obj) {
                var deferred = $q.defer();

                $.ajax({
                    type: "POST",
                    data: "=" + JSON.stringify(eq_trans_obj),
                    beforeSend: function(request) {
                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        request.setRequestHeader("Authorization-Token", window.sessionStorage.getItem("Token"));
                    },
                    url: window.data.Mutualfund.MFTransaction,
                    success: function(data) {
                        deferred.resolve(data);
                    }
                });

                return deferred.promise;
            }
        };
    });