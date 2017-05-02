"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var dashboard_service_1 = require("./dashboard.service");
var DashboardComponent = (function () {
    function DashboardComponent(_dashboardService, _http, _router) {
        this._dashboardService = _dashboardService;
        this._http = _http;
        this._router = _router;
        this.lineChartData = [
            { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
            { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
            { data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C' }
        ];
        this.lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
        this.lineChartOptions = {
            animation: false,
            responsive: true
        };
        this.lineChartColours = [
            {
                backgroundColor: 'rgba(148,159,177,0.2)',
                borderColor: 'rgba(148,159,177,1)',
                pointBackgroundColor: 'rgba(148,159,177,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148,159,177,0.8)'
            },
            {
                backgroundColor: 'rgba(77,83,96,0.2)',
                borderColor: 'rgba(77,83,96,1)',
                pointBackgroundColor: 'rgba(77,83,96,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(77,83,96,1)'
            },
            {
                backgroundColor: 'rgba(148,159,177,0.2)',
                borderColor: 'rgba(148,159,177,1)',
                pointBackgroundColor: 'rgba(148,159,177,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148,159,177,0.8)'
            }
        ];
        this.lineChartLegend = true;
        this.lineChartType = 'line';
        this.barChartOptions = {
            scaleShowVerticalLines: false,
            responsive: true
        };
        this.barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
        this.barChartType = 'bar';
        this.barChartLegend = true;
        this.barChartData = [
            { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
            { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
        ];
        this.dataMonthSelected = "365";
        this.dashboardData = {};
        this.apiJsonData = {};
        this.assets = [];
        this.products = [];
        this.performances = [];
        this.earnings = [];
        this.performance = [];
        this.CustomerName = this.customerName();
    }
    DashboardComponent.prototype.randomize = function () {
        var _lineChartData = new Array(this.lineChartData.length);
        for (var i = 0; i < this.lineChartData.length; i++) {
            _lineChartData[i] = { data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label };
            for (var j = 0; j < this.lineChartData[i].data.length; j++) {
                _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
            }
        }
        this.lineChartData = _lineChartData;
    };
    // events
    DashboardComponent.prototype.chartClicked = function (e) {
        console.log(e);
    };
    DashboardComponent.prototype.chartHovered = function (e) {
        console.log(e);
    };
    DashboardComponent.prototype.randomize1 = function () {
        // Only Change 3 values
        var data = [
            Math.round(Math.random() * 100),
            59,
            80,
            (Math.random() * 100),
            56,
            (Math.random() * 100),
            40
        ];
        var clone = JSON.parse(JSON.stringify(this.barChartData));
        clone[0].data = data;
        this.barChartData = clone;
        /**
         * (My guess), for Angular to recognize the change in the dataset
         * it has to change the dataset variable directly,
         * so one way around it, is to clone the data, change it and then
         * assign it;
         */
    };
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._dashboardService.getApiJsonData()
            .subscribe(function (resApiJsonData) { return _this.apiJsonData = resApiJsonData; }, function (resApiJsonError) { return _this.errorMsg = resApiJsonError; });
        //this.getHomeData();
        //this.reload();
    };
    DashboardComponent.prototype.getHomeData = function () {
        var _this = this;
        console.log("get home data this.dataMonthSelected");
        console.log(this.dataMonthSelected);
        //console.log(this.apiJsonData);
        this.url = this.apiJsonData['Dashboard']['Main'];
        //console.log(this.url);
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        //var token = currentUser.token; // your token
        //console.log(JSON.parse(currentUser['_body']));
        this._dashboardService.getDashBoardData(this.url, this.dataMonthSelected)
            .subscribe(function (resDashBoardData) {
            _this.dashboardData = resDashBoardData;
            if (_this.dashboardData != undefined) {
                console.log(_this.dashboardData);
                window['data_dashboard'] = _this.dashboardData;
                var temp = _this.dashboardData['LDashboardAssets'];
                var totals = [0, 0];
                if (temp != null || temp.count > 0) {
                    temp.forEach(function (n, i) {
                        totals[0] += n.InvestedValue;
                        totals[1] += n.CurrentValue;
                        n.InvestedValue = n.InvestedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        n.CurrentValue = n.CurrentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    });
                }
                var finalArray = temp;
                var a = {
                    Assets: "",
                    InvestedValue: totals[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    CurrentValue: totals[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                };
                finalArray.push(a);
                _this.assets = finalArray;
                console.log("Assets");
                console.log(_this.assets);
                //PRODUCTS//
                var tempProducts = _this.dashboardData['LDashboardProducts'];
                var totalProducts = [0, 0];
                if (tempProducts != null || tempProducts.count > 0) {
                    tempProducts.forEach(function (n, i) {
                        totalProducts[0] += n.InvestedValue;
                        totalProducts[1] += n.CurrentValue;
                        n.InvestedValue = n.InvestedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        n.CurrentValue = n.CurrentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    });
                }
                var ProductsArray = tempProducts;
                var temparray = {
                    Product: "",
                    InvestedValue: totalProducts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    CurrentValue: totalProducts[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                };
                ProductsArray.push(temparray);
                _this.products = ProductsArray;
                _this.performances = _this.dashboardData['LDashboardPerformance'];
                _this.earnings = _this.dashboardData['LDashboardEarnings'];
                _this.performance = _this.dashboardData['LDashboardPerformance'];
                //PRODUCTS//
                //GRAPH//
                //google.charts.setOnLoadCallback(this.drawChart);
            }
            (function (resDashboardError) { return _this.errorMsg = resDashboardError; });
        });
        //console.log(this.Authorization_Token);
    };
    DashboardComponent.prototype.drawChart = function () {
        // var c = [];
        // var nf = {};
        // var color = ['#8BC34A', '#42A5F5', '#8BC34A', '#42A5F5', '#8BC34A', '#42A5F5'];
        // var p = [];
        // var isAdd = false;
        // if (this.performance.length >= 1) {
        //     p.push(performance[0].Assets);
        //     p.push(parseFloat(performance[0].Total));
        //     p.push(color[0]);
        //     p.push(parseFloat(performance[0].ABS) + '%'
        //         + ' (' + Math.floor(performance[0].Total).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ')');
        // }
        // // var data = google.visualization.arrayToDataTable([
        // //     ['Asset', 'XIRR (%)', {
        // //         role: 'style'
        // //     }, {
        // //         role: 'annotation'
        // //     }], p
        // // ]);
        // for (var i = 1; i < this.performance.length; i++) {
        //     c.push({'v': performance[i].Assets});
        //     c.push({'v': parseFloat(performance[i].Total)});
        //     c.push({'v': color[i]});
        //     c.push({
        //         'v': parseFloat(performance[i].ABS) + '%'
        //         + ' (' + Math.floor(performance[i].Total).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ')'
        //     });
        //     nf = {'c': c};
        //     console.log(data);
        //     if (typeof(data.Nf) != 'undefined')
        //         data.Nf.push(nf);
        //     else
        //         data.qg.push(nf);
        // }
        // var options = {
        //     legend: {
        //         position: 'none'
        //     }
        // };
        // // var data3 = google.visualization.arrayToDataTable([
        // //     ['Asset', 'INR', {
        // //         role: 'style'
        // //     }, {
        // //         role: 'annotation'
        // //     }],
        // //     ['DIVIDEND', this.earnings["Dividend"], '#4B77BE', this.earnings["Dividend"]],
        // //     ['BOOK P/L', this.earnings["RealizedPL"], '#E87E04', this.earnings["RealizedPL"]],
        // //     ['TOTAL', this.earnings["Total"], '#2C3E50', this.earnings["Total"]]
        // // ]);
        // var options3 = {
        //     legend: {
        //         position: 'none'
        //     }
        // };
        // var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
        // chart.draw(data, options);
        // var chart3 = new google.visualization.ColumnChart(document.getElementById('chart_div3'));
        // chart3.draw(data3, options3);
    };
    //GRAPH ENDS HERE//
    DashboardComponent.prototype.reload = function () {
        this.getHomeData();
    };
    DashboardComponent.prototype.monthChange = function () {
        console.log("this.dataMonthSelected");
        console.log(this.dataMonthSelected);
        this.getHomeData();
    };
    DashboardComponent.prototype.customerName = function () {
        var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        console.log("CustomerName : ");
        console.log(JSON.parse(currentUser['_body']));
        return JSON.parse(currentUser['_body']).FirstName;
    };
    DashboardComponent.prototype.navigateToPlans = function (asset) {
        if (asset.toUpperCase() == "EQUITY") {
            this._router.navigate(['#!/my_plans']);
            //$rootScope.planValue = 1;
        }
        else if (asset.toUpperCase() == "DEBT") {
            this._router.navigate(['#!/my_plans']);
            //$rootScope.planValue = 0;
        }
    };
    DashboardComponent.prototype.navigateToProduct = function (product) {
        if (product == "MUTUAL FUND") {
            this._router.navigate(['#!/mutual_fund/dashboard']);
        }
        else if (product == "STOCK" || product == "BOND") {
            this._router.navigate(['#!/equity/dashboard']);
        }
        else if (product == "MANAGED ACCOUNT") {
            this._router.navigate(['#!/pms/dashboard']);
        }
    };
    return DashboardComponent;
}());
DashboardComponent = __decorate([
    core_1.Component({
        selector: 'dashboard-app',
        templateUrl: 'app/main-content/dashboard/dashboard.component.html',
        styles: ["\n            .dashboardContents {width : 100%}\n            .dashboardInnerContents { margin-left : 20%; margin-top : -800px; }\n          "],
        providers: [dashboard_service_1.DashboardService]
    }),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService, http_1.Http, router_1.Router])
], DashboardComponent);
exports.DashboardComponent = DashboardComponent;
//# sourceMappingURL=dashboard.component.js.map