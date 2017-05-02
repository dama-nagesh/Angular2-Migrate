'use strict';

angular.module('myApp.pms_net_position', ['ngRoute', 'oc.lazyLoad', 'ngLoadingSpinner', 'ngCsv', 'ui.bootstrap'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/pms/net_position', {
            templateUrl: 'modules/pms/net_position/net_position.html',
            controller: 'pms_net_positionCtrl'
        });
    }])

    .controller('pms_net_positionCtrl', ['$http', '$scope', '$window', '$location', 'dataService_pms_folio_list', 'dataService_pms_net_position', function ($http, $scope, $window, $location, dataService_pms_folio_list, dataService_pms_net_position) {

        checkLogin();
        $scope.CustomerName = customerName();
        $scope.AsOn = moment(Date()).format('DD-MMM-YYYY');
        $(".page-header").show();
        $(".page-sidebar-wrapper").show();
        $(".page-footer").show();
        $("body").removeClass("login");
        $scope.dataItemSelectedTransType = '';

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
            dataService_pms_net_position.getData($scope.dataItemSelected.FolioMapId,$scope.dataItemSelectedTransType).then(function (data) {
                //$scope.apiData=data;
                for (var i = 0; i < data.customerPMSSplitDivdTransList.length; i++) {
                    data.customerPMSSplitDivdTransList[i].TransDate = moment(data.customerPMSSplitDivdTransList[i].TransDate).format('DD-MM-YYYY');
                }
                loadData(data);
            });
        });

        function loadData(data) {
            $window.localStorage.setItem("pms_net_position", JSON.stringify(data));
            $scope.apiData = data;

            //for downloading whole/selected appointments
            $scope.ExcelData = [];
            $.each(data.customerPMSSplitDivdTransList, function (index, val) {
                var tempObj = {
                    FundName: val.FundName,
                    TransDate: val.TransDate,
                    FundType: val.FundType,
                    AmtShare: val.AmtShare,
                    Shares: val.Shares,
                    Amount: val.Amount,
                    SchemeName: val.SchemeName
                }
                $scope.ExcelData.push(tempObj);
            });

            $scope.filename = "PMS_NetPosition";
            $scope.CountRecords = data.customerPMSSplitDivdTransList.length;

            var totals=[0,0];
            $.each(data.customerPMSSplitDivdTransList, function (key, value) {
                totals[0] += value.Shares;
                totals[1] += value.Amount;
            });


            $scope.filteredRecords = []
                , $scope.currentPage = 1
                , $scope.numPerPage = 10
                , $scope.maxSize = 5;

            $scope.$watch('currentPage + numPerPage', function () {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

                var finalArray = data.customerPMSSplitDivdTransList.slice(begin, end);
                var a = {FundName:"TOTAL",TransDate:"",FundType:"",AmtShare:"",Shares:totals[0],Amount:totals[1],Status:"",SchemeName:""};
                finalArray.push(a);
                $scope.pmsItems = finalArray;
            });
        }

        $scope.ChangeOption = function () {
            dataService_pms_net_position.getData($scope.dataItemSelected.FolioMapId,$scope.dataItemSelectedTransType).then(function (data) {
                //$scope.apiData=data;
                for (var i = 0; i < data.customerPMSSplitDivdTransList.length; i++) {
                    data.customerPMSSplitDivdTransList[i].TransDate = moment(data.customerPMSSplitDivdTransList[i].TransDate).format('DD-MM-YYYY');
                }
                loadData(data);
            });
        }

        $scope.ChangeOptionTransType = function(){
            dataService_pms_net_position.getData($scope.dataItemSelected.FolioMapId,$scope.dataItemSelectedTransType).then(function (data) {
                //$scope.apiData=data;
                for (var i = 0; i < data.customerPMSSplitDivdTransList.length; i++) {
                    data.customerPMSSplitDivdTransList[i].TransDate = moment(data.customerPMSSplitDivdTransList[i].TransDate).format('DD-MM-YYYY');
                }
                loadData(data);
            });
        }

        $scope.toggleDiv = function (e) {
            if ($("#eqnp").hasClass("collapse")) {
                $("#eqnpdiv1").hide();
            }
            else {
                $("#eqnpdiv1").show();
            }
        }

        $('tr').css('background-color', '#f1f4f7');

        $window.sort = "asc";

        $scope.orderByField = function (value) {
            var data = $scope.apiData;
            if (data.customerPMSSplitDivdTransList != undefined || data.customerPMSSplitDivdTransList != null) {
                if ($window.sort == "asc") {
                    data.customerPMSSplitDivdTransList.sort(function (a, b) {
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
                    data.customerPMSSplitDivdTransList.sort(function (a, b) {
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

    .factory('dataService_pms_net_position', function ($q) {
        return {
            getData: function (selectedItem,TransType) {
                var deferred = $q.defer();

                $.ajax({
                    type: "POST",
                    data: "=" + JSON.stringify({"FolioMapId": selectedItem, "TransType": TransType}),
                    beforeSend: function (request) {
                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        request.setRequestHeader("Authorization-Token", window.sessionStorage.getItem("Token"));
                    },
                    url: window.data.PMS.CustomerPMSNetPosition,
                    success: function (data) {
                        deferred.resolve(data);
                    }
                });

                return deferred.promise;
            }
        };
    });