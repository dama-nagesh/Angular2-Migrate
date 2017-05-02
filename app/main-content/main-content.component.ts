import { Component, OnInit } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';

@Component({
    selector : 'main-content',

    template : `
                  <dashboard-app></dashboard-app> 
                `,

    //templateUrl : 'app/main-content/main-content.component.html'

    styles:[`
            dashboard-app { width : 60%}
          `],
})


export class MainContentComponent {}