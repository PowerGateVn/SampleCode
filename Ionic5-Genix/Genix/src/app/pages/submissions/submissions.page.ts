import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-submissions',
    templateUrl: './submissions.page.html',
    styleUrls: ['./submissions.page.scss']
})
export class SubmissionsPage implements OnInit {
    listSubmissions = null;
    constructor(public api: ApiService, private router: Router) {}

    ngOnInit() {
        this.api.getAllForm().subscribe(result => {
            this.listSubmissions = result;
        });
    }
    onClick(item) {
        this.router.navigate(['/submission-list'], { queryParams: { submission: item.path } });
    }
}
