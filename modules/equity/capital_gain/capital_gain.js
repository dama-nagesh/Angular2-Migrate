'use strict';

angular.module('myApp.eq_capital_gain', ['ngRoute', 'oc.lazyLoad', 'ngLoadingSpinner', 'ngCsv','ui.bootstrap'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/equity/capital_gain', {
            templateUrl: 'modules/equity/capital_gain/capital_gain.html',
            controller: 'eq_capital_gainCtrl'
        });

    }])

    .controller('eq_capital_gainCtrl', ['$http', '$scope', '$window', '$location', 'dataService_eq_capital_gain', function ($http, $scope, $window, $location, dataService_eq_capital_gain) {

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

        //default select
        $scope.dataItemSelected = "Actual";

        function loadData(data, value){
            $window.localStorage.setItem("eq_capital_gain", JSON.stringify(data));
            $scope.CountRecords = data.CapitalGainSummary.length;

            var totals=[0,0,0];
            $.each(data.CapitalGainSummary, function (key, value) {
                totals[0] += value.EligibleSTCG;
                totals[1] += value.EligibleLTCG;
                totals[2] += value.Total;
            });

            $scope.filteredRecords = []
                ,$scope.currentPage = 1
                ,$scope.numPerPage = 10
                ,$scope.maxSize = 5;

            $scope.$watch('currentPage + numPerPage', function () {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;
                if (value == 'Actual') {
                    var finalArray = data.CapitalGainSummary.slice(begin, end);
                    var a = {InvName:"TOTAL",Folio:"",EligibleSTCG:totals[0],EligibleLTCG:totals[1],Total:totals[2],CapitalGainDetail:""};
                    finalArray.push(a);
                    $scope.items_actual = finalArray;
                } else {
                    var finalArray = data.CapitalGainSummary.slice(begin, end);
                    var a = {InvName:"TOTAL",Folio:"",EligibleSTCG:totals[0],EligibleLTCG:totals[1],Total:totals[2],CapitalGainDetail:""};
                    finalArray.push(a);
                    $scope.items_eligible = finalArray;
                }
            });
        }

        dataService_eq_capital_gain.getData('Actual').then(function (data) {
            $scope.apiData=data;
            loadData(data,'Actual');

            //for downloading whole/selected appointments
            $scope.ExcelData = [];
            $.each(data.CapitalGainSummary, function (index, val) {
                var tempObj = {
                    InvName: val.InvName,
                    Folio: val.Folio,
                    EligibleSTCG: val.EligibleSTCG,
                    EligibleLTCG: val.EligibleLTCG,
                    Total: val.Total
                }
                $scope.ExcelData.push(tempObj);
            });

            $scope.filename = "Equity_CapitalGain";
        });

        $scope.openModel = function (item) {
            $scope.eq_capital_gain_items = item.CapitalGainDetail;
        }

        $scope.toggleDiv = function (e) {
            if ($("#eqcg").hasClass("collapse")) {
                $("#eqcgdiv1").hide();
                $("#eqcgdiv2").hide();
            }
            else {
                $("#eqcgdiv1").show();
                $("#eqcgdiv2").show();
            }
        }

        $scope.toggleTab = function (id1, id2, value) {
            $("#" + id1).show();
            $("#" + id2).hide();
            dataService_eq_capital_gain.getData(value).then(function (data) {
                $scope.apiData = data;
                loadData(data, value);

                //for downloading whole/selected appointments
                $scope.ExcelData = [];
                $.each(data.CapitalGainSummary, function (index, val) {
                    var tempObj = {
                        InvName: val.InvName,
                        Folio: val.Folio,
                        EligibleSTCG: val.EligibleSTCG,
                        EligibleLTCG: val.EligibleLTCG,
                        Total: val.Total
                    }
                    $scope.ExcelData.push(tempObj);
                });
                $scope.filename = "Equity_CapitalGain";
            });
        }

        $scope.reload = function () {
            dataService_eq_capital_gain.getData($scope.dataItemSelected).then(function (data) {
                loadData(data);
            });
        }
        $window.sort = "asc";
        $scope.orderByField = function (value) {
            var data = $scope.apiData;
            if (data.CapitalGainSummary != undefined || data.CapitalGainSummary != null) {
                if ($window.sort == "asc") {
                    data.CapitalGainSummary.sort(function (a, b) {
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
                    data.CapitalGainSummary.sort(function (a, b) {
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
            if($('#tabActual').hasClass('active'))
                loadData(data, 'Actual');
            else
                loadData(data, 'Eligible');
        }
    }])


    .factory('dataService_eq_capital_gain', function ($q) {
        return {
            getData: function (selectedItem) {
                var deferred = $q.defer();

                $.ajax({
                    type: "POST",
                    data: "=" + JSON.stringify({
                        'CustomerId': window.sessionStorage.getItem("CustomerId"),
                        'AssetSubTypes': '1',
                        'CapitalGainType': selectedItem
                    }),
                    beforeSend: function (request) {
                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        request.setRequestHeader("Authorization-Token", window.sessionStorage.getItem("Token"));
                    },
                    url: window.data.Mutualfund.CapitalGain,
                    success: function (data) {
                        deferred.resolve(data);
                    }
                });

                return deferred.promise;
            }
        };
    });