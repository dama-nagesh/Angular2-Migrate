import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarDataService } from './sidebar.data.service';
import { ModulesDataService } from './modules.data.service';

@Component({
    selector : 'sidebar-list',
    // template : `
                
    //             `,
    templateUrl : 'app/sidebar1.component.html',

    providers : [SidebarDataService, ModulesDataService]
    
})

export class SideBarComponent {

    sidebarData = [];
    pageUrls = [];
    logourl : string;
    errorMsg : string;

    constructor(private router : Router, private _sidebarDataService : SidebarDataService, private _modulesDataService : ModulesDataService){}
    //logourl = window.data.LOGO.LogoImgUrl + window.sessionStorage.getItem("LogoPath");
    onSelect(empdep){
        this.router.navigate(['/sidebar', empdep.id]);
    }

    ngOnInit(){
        this._sidebarDataService.getSideBarData()
        .subscribe(resSidebarData => this.sidebarData = resSidebarData,
                    resSidebarError => this.errorMsg = resSidebarError);

        this._modulesDataService.getModulesData()
        .subscribe(resModulesData => this.pageUrls = resModulesData,
                    resModulesError => this.errorMsg = resModulesError);

        //this.logourl = this.pageUrls["LOGO"].LogoImgUrl;
    }

};