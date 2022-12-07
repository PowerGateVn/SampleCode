import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { FormManagerService } from 'angular-formio/manager';
@Component({
    selector: 'app-form-list',
    templateUrl: './form-list.page.html',
    styleUrls: ['./form-list.page.scss']
})
export class FormListPage implements OnInit {
    listForm = null;

    constructor(private api: ApiService, private router: Router, public services: FormManagerService) {}

    ngOnInit() {
        this.api.getListFormsByType('form').subscribe(result => {
            this.listForm = result;
        });
    }

    onClick(item) {
        this.router.navigate(['form-detail'], item);
    }
}
