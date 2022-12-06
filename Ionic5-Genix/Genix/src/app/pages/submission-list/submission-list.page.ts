import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { FormioAppConfig } from 'angular-formio';

@Component({
    selector: 'app-submission-list',
    templateUrl: './submission-list.page.html',
    styleUrls: ['./submission-list.page.scss']
})
export class SubmissionListPage implements OnInit {
    listSubmission = null;
    submission = null;

    constructor(private api: ApiService, private router: ActivatedRoute, public config: FormioAppConfig) {
        this.submission = this.router.snapshot.queryParamMap.get('submission');
    }

    ngOnInit() {
        this.router.queryParamMap.subscribe(params => {
            const param = params.get('submission');
            if (param) {
                this.api.getListSubmissions(this.submission).subscribe(result => {
                    this.listSubmission = result;
                });
            }
        });
    }
}
