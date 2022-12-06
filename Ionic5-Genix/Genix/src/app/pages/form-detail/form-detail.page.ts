import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormioAppConfig } from 'angular-formio';

@Component({
    selector: 'app-form-detail',
    templateUrl: './form-detail.page.html',
    styleUrls: ['./form-detail.page.scss']
})
export class FormDetailPage implements OnInit {
    form = null;
    constructor(public activatedRoute: ActivatedRoute, public router: Router, public config: FormioAppConfig) {
        this.activatedRoute.queryParams.subscribe((res: any) => {
            if (this.router.getCurrentNavigation().extras) {
                this.form = this.router.getCurrentNavigation().extras;
            }
        });
    }

    ngOnInit() {}
}
