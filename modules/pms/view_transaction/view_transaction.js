'use strict';

angular.module('myApp.pms_view_transaction', ['ngRoute', 'oc.lazyLoad', 'ngCsv', 'ui.bootstrap'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/pms/view_transaction', {
            templateUrl: 'modules/pms/view_transaction/view_transaction.html',
            controller: 'pms_view_transactionCtrl'
        });

    } ])

    .controller('pms_view_transactionCtrl', ['$http', '$scope', '$window', '$location', 'dataService_pms_view_transaction', 'dataService_pms_folio_list', function($http, $scope, $window, $location, dataService_pms_view_transaction, dataService_pms_folio_list) {

        checkLogin();
        $scope.CustomerName = customerName();
        $scope.AsOn = moment(Date()).format('DD-MMM-YYYY');
        $(".page-header").show();
        $(".page-sidebar-wrapper").show();
        $(".page-footer").show();
        $("body").removeClass("login");

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



        dataService_pms_folio_list.getData().then(function(data) {
            $scope.items = data.CustomerPMSFolioList;
            $scope.dataItemSelected = data.CustomerPMSFolioList[0];
            var pms_trans_obj = {
                "FolioMapId": $scope.dataItemSelected.FolioMapId,

                "TransType": "ALL"
            };
            dataService_pms_view_transaction.getData(pms_trans_obj).then(function(data) {
                loadData(data);
            });
        });

        function loadData(data) {
            $window.localStorage.setItem("pms_view_transaction", JSON.stringify(data));
            $scope.ExcelData = data.CustomerPMSTransaction;
            $scope.filename = "PMS_ViewTransaction";
            $scope.CountRecords = data.CustomerPMSTransaction.length;
            $scope.apiData = data;

         

            $scope.filteredRecords = []
                , $scope.currentPage = 1
                , $scope.numPerPage = 10
                , $scope.maxSize = 5;

            $scope.$watch('currentPage + numPerPage', function() {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

                $scope.pms_trans_items = data.CustomerPMSTransaction.slice(begin, end);
            });
        }


        $scope.ChangeOption = function() {
            var pms_trans_obj = {
                "FolioMapId": $scope.dataItemSelected.FolioMapId,
                "TransType": "ALL"
            };
            dataService_pms_view_transaction.getData(pms_trans_obj).then(function(data) {
                loadData(data);
            });
        }

        $scope.toggleDiv = function(e) {
            if ($("#pmsvt").hasClass("collapse")) {
                $("#pmsvtdiv1").hide();
            }
            else {
                $("#pmsvtdiv1").show();
            }
        }
        $window.sort = "asc";
        $scope.orderByField = function(value) {
            var data = $scope.apiData;
            if (data.CustomerPMSTransaction != undefined || data.CustomerPMSTransaction != null) {
                if ($window.sort == "asc") {
                    data.CustomerPMSTransaction.sort(function(a, b) {
                    if (value == "Script" || value == "Exchange" || value == "TransType" || value == "ContrahctDate") {
                            return a[value].localeCompare(b[value]);
                        }
                        else {
                            return (a[value] > b[value]) ? 1 : ((a[value] < b[value]) ? -1 : 0);
                        }
                    });
                    $window.sort = "desc";
                }
                else {
                    data.CustomerPMSTransaction.sort(function(a, b) {
                    if (value == "Script" || value == "Exchange" || value == "TransType" || value == "ContrahctDate") {
                            return b[value].localeCompare(a[value]);
                        }
                        else {
                            return (b[value] > a[value]) ? 1 : ((b[value] < a[value]) ? -1 : 0);
                        }

                    });
                    $window.sort = "asc";
                }
            }
            loadData(data);
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
    .factory('dataService_pms_view_transaction', function($q) {
        return {
            getData: function(pms_trans_obj) {
                debugger;
                var deferred = $q.defer();

                $.ajax({
                    type: "POST",
                    data: "=" + JSON.stringify(pms_trans_obj),
                    beforeSend: function(request) {
                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        request.setRequestHeader("Authorization-Token", window.sessionStorage.getItem("Token"));
                    },
                    url: window.data.PMS.CustomerPMSTransaction,
                    success: function(data) {
                        deferred.resolve(data);
                    }
                });

                return deferred.promise;
            }
        };
    });