import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Http, Response, RequestOptions , Headers} from '@angular/http';
import { Router } from '@angular/router';
import { DashboardService } from './dashboard.service'
import { ChartsModule } from 'ng2-charts';
//import { ChartsModule } from 'ng2-charts/ng2-charts';
import {Chart} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';

@Component({
  selector: 'dashboard-app',

  templateUrl : 'app/main-content/dashboard/dashboard.component.html',

  styles:[`
            .dashboardContents {width : 100%}
            .dashboardInnerContents { margin-left : 20%; margin-top : -800px; }
          `],
providers : [DashboardService]
})
export class DashboardComponent { 

public lineChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  ];
  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions:any = {
    animation: false,
    responsive: true
  };
  public lineChartColours:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  public randomize():void {
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }

  
public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
 
  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

public randomize1():void {
    // Only Change 3 values
    let data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
  }

  dataMonthSelected : string = "365";
  //dataMonthSelected = "365";
  url : string;
  errorMsg : string;
  dashboardData = {};
  apiJsonData = {};
  assets = [];
  products = [];
  performances = [];
  earnings = [];
  performance = [];
  CustomerName = this.customerName();

  constructor(private _dashboardService : DashboardService, private _http : Http, private _router : Router){

  }

  ngOnInit(){
        this._dashboardService.getApiJsonData()
        .subscribe(resApiJsonData => this.apiJsonData = resApiJsonData,
                    resApiJsonError => this.errorMsg = resApiJsonError);

        //this.getHomeData();
        //this.reload();
                   
    }

  getHomeData(){

      console.log("get home data this.dataMonthSelected");
            console.log(this.dataMonthSelected);

      //console.log(this.apiJsonData);
      this.url = this.apiJsonData['Dashboard']['Main'];
      //console.log(this.url);
      var currentUser = JSON.parse(localStorage.getItem('currentUser'));
            //var token = currentUser.token; // your token
            //console.log(JSON.parse(currentUser['_body']));
           
        this._dashboardService.getDashBoardData(this.url, this.dataMonthSelected)
        .subscribe(
            (resDashBoardData) => {
          this.dashboardData = resDashBoardData
          if(this.dashboardData != undefined){
            console.log(this.dashboardData);
            window['data_dashboard'] = this.dashboardData;
            
            var temp = this.dashboardData['LDashboardAssets'];
            
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
                this.assets = finalArray;
                console.log("Assets");
                console.log(this.assets);
                
                //PRODUCTS//
                    var tempProducts = this.dashboardData['LDashboardProducts'];
                var totalProducts = [0, 0];
                if (tempProducts != null || tempProducts.count > 0) {
                    tempProducts.forEach(function (n, i) {
                        totalProducts[0] += n.InvestedValue;
                        totalProducts[1] += n.CurrentValue;
                        n.InvestedValue = n.InvestedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        n.CurrentValue = n.CurrentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    });
                }
                let ProductsArray = tempProducts;
                let temparray = {
                    Product: "",
                    InvestedValue: totalProducts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    CurrentValue: totalProducts[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                };
                ProductsArray.push(temparray);
                this.products = ProductsArray;

                this.performances = this.dashboardData['LDashboardPerformance'];

                this.earnings = this.dashboardData['LDashboardEarnings'];
                this.performance = this.dashboardData['LDashboardPerformance'];
                //PRODUCTS//

                //GRAPH//

                //google.charts.setOnLoadCallback(this.drawChart);

                
           
        }
            resDashboardError => this.errorMsg = resDashboardError
      
        },
        )
            //console.log(this.Authorization_Token);

        
  }

  

  drawChart() {
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
                }

                //GRAPH ENDS HERE//

  reload () {
            this.getHomeData();
        }

        monthChange  () {
            console.log("this.dataMonthSelected");
            console.log(this.dataMonthSelected);
            this.getHomeData();
            
        }

        customerName(){
            var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            console.log("CustomerName : ")
            console.log(JSON.parse(currentUser['_body']));
            return JSON.parse(currentUser['_body']).FirstName;
        }

        navigateToPlans (asset) {
            if (asset.toUpperCase() == "EQUITY") {
                this._router.navigate(['#!/my_plans']);
                //$rootScope.planValue = 1;
            }
            else if (asset.toUpperCase() == "DEBT") {
                this._router.navigate(['#!/my_plans']);
                //$rootScope.planValue = 0;
            }
        }
        navigateToProduct (product) {
            if (product == "MUTUAL FUND") {
                this._router.navigate(['#!/mutual_fund/dashboard']);
            }
            else if (product == "STOCK" || product == "BOND") {
                this._router.navigate(['#!/equity/dashboard']);

            }
            else if (product == "MANAGED ACCOUNT") {
                this._router.navigate(['#!/pms/dashboard']);

            }
        }
}