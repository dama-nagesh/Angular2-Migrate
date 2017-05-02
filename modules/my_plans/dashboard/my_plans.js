'use strict';

angular.module('myApp.my_plans', ['ngRoute', 'oc.lazyLoad', 'ngLoadingSpinner'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/my_plans', {
            templateUrl: 'modules/my_plans/dashboard/my_plans.html',
            controller: 'my_plansCtrl'
        });
    }])

    .controller('my_plansCtrl', ['$http', '$scope', '$window', '$location','dataService_myplan_dashboard','$rootScope', function ($http, $scope, $window, $location,dataService_myplan_dashboard,$rootScope) {

        checkLogin();
        $scope.CustomerName = customerName();
        $(".page-header").show();
        $(".page-sidebar-wrapper").show();
        $(".page-footer").show();
        $("body").removeClass("login");

        //default select
        $scope.dataItemSelected = "1";

        $scope.loadChart = function(){
            dataService_myplan_dashboard.getData($scope.dataItemSelected).then(function(data){
                loadData(data);
            });
        }

        function loadData(data){
            drawChart(data.Performance);
            var temp =  data.Performance;
            var totals=[0,0];
            if(temp!=null || temp.count>0){
                temp.forEach(function(n,i){
                    totals[0] += n.CurrentValue;
                    totals[1] += n.Weightage;
                    n.CurrentValue = n.CurrentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    if(n.AssetSubType.toLowerCase().indexOf("equity") >= 0)
                        n.RedirectUrl = "/#!/equity/dashboard";
                    else if(n.AssetSubType.toLowerCase().indexOf("mutual") >= 0)
                        n.RedirectUrl = "/#!/mutual_fund/dashboard";
                    else if(n.AssetSubType.toLowerCase().indexOf("account") >= 0)
                        n.RedirectUrl = "/#!/pms/dashboard";
                    else
                        n.RedirectUrl = "";
                });
            }

            var finalArray = temp;
            var a = {
                AssetSubType: "TOTAL",
                CurrentValue: totals[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                Weightage: "100"
            };
            finalArray.push(a);
            $scope.my_plan_data = finalArray;
        }

        function drawChart(dataItem) {

            // Create the data table.
            var data2 = new google.visualization.DataTable();
            data2.addColumn('string', 'Assets Sub Type');
            data2.addColumn('number', 'CurrentValue');

            var rows = [];
            for (var d = 0; d < dataItem.length; d++) {
                var row = [];
                row.push(dataItem[d].AssetSubType);
                row.push(dataItem[d].CurrentValue < 0 ? 0: dataItem[d].CurrentValue);
                rows.push(row);
            }

            data2.addRows(rows);

            // Set chart options
            var options2 = {
                pieHole: 0.4,
                legend: {position: 'bottom'},
                chartArea: {left: 20, top: 20, width: '100%', height: '75%'},
                colors: ['#8BC34A', '#42A5F5', '#FFC107']
            };

            var chart2 = new google.visualization.PieChart(document.getElementById('chart_div2'));
            chart2.draw(data2, options2);

        }

        if($rootScope.planValue==0 || $rootScope.planValue==1) {
            $scope.dataItemSelected = $rootScope.planValue.toString();
        }

        dataService_myplan_dashboard.getData($scope.dataItemSelected).then(function(data){
            loadData(data);
        });

        $scope.toggleDiv = function(e){
            if($("#myplantoggle").hasClass("collapse")){
                $("#myplanleft").hide();
                $("#myplanright").hide();
            }
            else{
                $("#myplanleft").show();
                $("#myplanright").show();
            }
        }

        $scope.reload = function(){
            dataService_myplan_dashboard.getData($scope.dataItemSelected).then(function(data){
                loadData(data);
                //drawChart(data.Performance);
            });
        }
    }])

    .factory('dataService_myplan_dashboard', function ($q) {
        return {
            getData : function (selectedItem) {
                var deferred = $q.defer();
                $.ajax({
                    type: "POST",
                    data: "=" + JSON.stringify({
                        'CustomerId': window.sessionStorage.getItem("CustomerId"),
                        'AssetSubTypes':selectedItem
                    }),
                    beforeSend: function(request) {
                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        request.setRequestHeader("Authorization-Token", window.sessionStorage.getItem("Token"));
                    },
                    url: window.data.MyPlan.Dashboard,
                    success: function(data) {
                        deferred.resolve(data);
                    }
                });

                return deferred.promise;
            }
        };
    });