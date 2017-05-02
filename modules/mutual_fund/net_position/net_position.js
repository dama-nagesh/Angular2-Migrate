'use strict';

angular.module('myApp.mf_net_position', ['ngRoute', 'oc.lazyLoad', 'ngLoadingSpinner', 'ngCsv', 'ui.bootstrap'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/mutual_fund/net_position', {
            templateUrl: 'modules/mutual_fund/net_position/net_position.html',
            controller: 'mf_net_positionCtrl'
        });
    }])

    .controller('mf_net_positionCtrl', ['$http', '$scope', '$window', '$location', 'dataService_mf_net_position', function ($http, $scope, $window, $location, dataService_mf_net_position) {

        checkLogin();
        $scope.CustomerName = customerName();
        $(".page-header").show();
        $(".page-sidebar-wrapper").show();
        $(".page-footer").show();
        $("body").removeClass("login");
        $scope.dataItemSelected = '0';

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

        function loadData(data) {
            $scope.CountRecords = data.CustomerNetPosition.length;

            var totals = [0, 0, 0, 0, 0, 0];
            $.each(data.CustomerNetPosition, function (key, value) {
                totals[0] += value.BalanceUnits;
                totals[1] += value.InvestedValue;
                totals[2] += value.CurrentValue;
                totals[3] += value.UnRealizedPL;
                totals[4] += value.DVP;
                totals[5] += value.DVR;
            });

            $scope.mfItems = []
                , $scope.currentPage = 1
                , $scope.numPerPage = 10
                , $scope.maxSize = 5;

            $scope.$watch('currentPage + numPerPage', function () {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

                var finalArray = data.CustomerNetPosition.slice(begin, end);
                var a = {
                    Scheme: "TOTAL",
                    FolioNum: "",
                    SchemeStartDate: "",
                    PurchaseUnits: "",
                    SoldUnits: "",
                    BalanceUnits: totals[0],
                    AvgPrice: "",
                    InvestedValue: totals[1],
                    Redemption: "",
                    NAV:  "",
                    CurrentValue: totals[2],
                    RealizedPL: 0,
                    UnRealizedPL: totals[3],
                    TotalPL: 0,
                    DVP: Math.round(totals[4]),
                    DVR: Math.round(totals[5]),
                    TotalPLWithDiv:0,
                    ABS: "",
                    XIRR: ""
                };
                finalArray.push(a);
                $scope.mfItems = finalArray;
            });
        }

        $window.sort = "asc";

        //$("#netPositionTable").height($(window).height() - $(".page-header").height() - 200);
        $scope.orderByField = function (value) {
            var data = $scope.apiData;
            if (data.CustomerNetPosition != undefined || data.CustomerNetPosition != null) {
                if ($window.sort == "asc") {
                    data.CustomerNetPosition.sort(function (a, b) {
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
                    data.CustomerNetPosition.sort(function (a, b) {
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

        dataService_mf_net_position.getData($scope.dataItemSelected).then(function (data) {
            $window.localStorage.setItem("mf_net_position", JSON.stringify(data));
            $scope.apiData = data;
            //$scope.ExcelData = data.CustomerNetPosition;
            $scope.ExcelData = [];
            $.each(data.CustomerNetPosition, function (index, val) {
                var tempObj = {
                    Scheme: val.Scheme,
                    FolioNum: val.FolioNum,
                    SchemeStartDate: val.SchemeStartDate,
                    BalanceUnits: val.BalanceUnits,
                    AvgPrice: val.AvgPrice,
                    NAV: val.NAV,
                    InvestedValue: val.InvestedValue,
                    CurrentValue: val.CurrentValue,
                    DVP: val.DVP,
                    DVR: val.DVR,
                    UnRealizedPL: val.UnRealizedPL,
                    ABS: val.ABS,
                    XIRR: val.XIRR
                }
                $scope.ExcelData.push(tempObj);
            });

            $scope.filename = "MF_NetPosition";
            loadData(data);
        });

        $scope.toggleDiv = function (e) {
            if ($("#mfnp").hasClass("collapse")) {
                $("#mfnpdiv1").hide();
            }
            else {
                $("#mfnpdiv1").show();
            }
        }

        $scope.ChangeOption = function () {
            dataService_mf_net_position.getData($scope.dataItemSelected).then(function (data) {
                $scope.apiData = data;
                loadData(data);
            });
        }

        $('tr').css('background-color', '#f1f4f7');
    }])

    .factory('dataService_mf_net_position', function ($q) {
        return {
            getData: function (selectedItem) {
                var deferred = $q.defer();

                $.ajax({
                    type: "POST",
                    data: "=" + JSON.stringify({
                        'CustomerId': window.sessionStorage.getItem("CustomerId"),
                        'AssetSubTypes': '0',
                        'FilterValue' : selectedItem
                    }),
                    beforeSend: function (request) {
                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        request.setRequestHeader("Authorization-Token", window.sessionStorage.getItem("Token"));
                    },
                    url: window.data.Mutualfund.NetPosition,
                    success: function (data) {
                        deferred.resolve(data);
                    }
                });

                return deferred.promise;
            }
        };
    });
