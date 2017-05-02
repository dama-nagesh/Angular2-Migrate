'use strict';

angular.module('myApp.holding_statement', ['ngRoute', 'oc.lazyLoad', 'ngLoadingSpinner', 'ngCsv'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/pms/holding_statement', {
            templateUrl: 'modules/pms/holding_statement/holding_statement.html',
            controller: 'holding_statementCtrl'
        });

    }])

    .controller('holding_statementCtrl', ['$http', '$scope', '$window', '$location', 'dataService_pms_folio_list', 'dataService_pms_holding', function ($http, $scope, $window, $location, dataService_pms_folio_list, dataService_pms_holding) {

        checkLogin();
        $scope.CustomerName = customerName();
        $scope.AsOn = moment(Date()).format('DD-MMM-YYYY');
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

        dataService_pms_folio_list.getData().then(function (data) {

            $scope.items = data.CustomerPMSFolioList;
            $scope.dataItemSelected = data.CustomerPMSFolioList[0];
            //$scope.apiData = data;
            if ($scope.dataItemSelected != null) {
                dataService_pms_holding.getData($scope.dataItemSelected).then(function (data) {
                    $scope.apiData = data;
                    loadData(data);
                });
            }
        });

        function loadData(data) {

            $scope.ExcelData = data.CustomerPMSHolding;
            $scope.filename = "PMS_Holdings";

            $window.localStorage.setItem("pms_holding_statement_data", JSON.stringify(data.CustomerPMSHolding));

            $scope.CountRecords = data.CustomerPMSHolding.length;
            var totals=[0,0,0,0,0,0];
            $.each(data.CustomerPMSHolding, function (key, value) {
                totals[0] += value.Quantity;
                totals[1] += value.AvgCost;
                totals[2] += value.Cost;
                totals[3] += value.BSE_CurrPrice;
                totals[4] += value.Marketvalue;
                totals[5] += value.UnReal;
            });

            $scope.filteredRecords = []
                , $scope.currentPage = 1
                , $scope.numPerPage = 10
                , $scope.maxSize = 5;

            $scope.$watch('currentPage + numPerPage', function () {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

                var finalArray = data.CustomerPMSHolding.slice(begin, end);
                var a = {CommonScripCode:"TOTAL",Quantity:totals[0],AvgCost:totals[1],Cost:totals[2],BSE_CurrPrice:totals[3],Marketvalue:totals[4],UnReal:totals[5]};
                finalArray.push(a);
                $scope.pmsItems = finalArray;
            });
        }

        $scope.toggleDiv = function (e) {
            if ($("#pmshs").hasClass("collapse")) {
                $("#pmshsdiv1").hide();
            }
            else {
                $("#pmshsdiv1").show();
            }
        }

        $scope.reload = function () {
            dataService_pms_holding.getData($scope.dataItemSelected).then(function (data) {
                $scope.apiData = data;
                loadData(data);
            });
        }

        $scope.ChangeOption = function () {
            if ($scope.dataItemSelected != null) {
                dataService_pms_holding.getData($scope.dataItemSelected).then(function (data) {
                   $scope.apiData = data;
                    loadData(data);
                });
            }
        }
        $window.sort = "asc";
        $scope.orderByField = function (value) {
            var data = $scope.apiData;
            if (data.CustomerPMSHolding != undefined || data.CustomerPMSHolding != null) {
                if ($window.sort == "asc") {
                    data.CustomerPMSHolding.sort(function (a, b) {
                        if (typeof a[value] == "string") {

                            var aDate = new Date(moment(a[value],'DD-MM-YYYY'));
                            var bDate = new Date(moment(b[value],'DD-MM-YYYY'));
                            if(aDate=="Invalid Date" || bDate=="Invalid Date"){
                                var nameA = a[value].toLowerCase(), nameB = b[value].toLowerCase()
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            }
                            else{
                                return aDate.getTime()-bDate.getTime() //sort by date ascending
                            }
                        }
                        else if (typeof a[value] == "number") {
                            return a[value] - b[value]
                        }
                    });
                    $window.sort = "desc";
                }
                else {
                    data.CustomerPMSHolding.sort(function (a, b) {
                        if (typeof a[value] == "string") {

                            var aDate = new Date(moment(a[value],'DD-MM-YYYY'));
                            var bDate = new Date(moment(b[value],'DD-MM-YYYY'));
                            if(aDate=="Invalid Date" || bDate=="Invalid Date") {
                                var nameA = a[value].toLowerCase(), nameB = b[value].toLowerCase()
                                if (nameA < nameB) //sort string descending
                                    return 1
                                if (nameA > nameB)
                                    return -1
                                return 0 //default return value (no sorting)
                            }
                            else{
                                return bDate.getTime()-aDate.getTime() //sort by date descending
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
    .factory('dataService_pms_folio_list', function ($q) {
        return {
            getData: function () {
                var deferred = $q.defer();

                $.ajax({
                    type: "POST",
                    data: "=" + JSON.stringify({'CustomerId': window.sessionStorage.getItem("CustomerId")}),
                    beforeSend: function (request) {
                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        request.setRequestHeader("Authorization-Token", window.sessionStorage.getItem("Token"));
                    },
                    url: window.data.PMS.CustomerPMSFolioList,
                    success: function (data) {
                        deferred.resolve(data);
                    }
                });

                return deferred.promise;
            }
        };
    })
    .factory('dataService_pms_holding', function ($q) {
        return {
            getData: function (selectedValue) {
                var deferred = $q.defer();

                $.ajax({
                    type: "POST",
                    data: "=" + JSON.stringify({
                        'FolioMapId': selectedValue.FolioMapId
                    }),
                    beforeSend: function (request) {
                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        request.setRequestHeader("Authorization-Token", window.sessionStorage.getItem("Token"));
                    },
                    url: window.data.PMS.CustomerPMSHolding,
                    success: function (data) {
                        deferred.resolve(data);
                    }
                });

                return deferred.promise;
            }
        };
    });
