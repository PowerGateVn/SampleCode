import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubmissionListPage } from './submission-list.page';

describe('SubmissionListPage', () => {
    let component: SubmissionListPage;
    let fixture: ComponentFixture<SubmissionListPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SubmissionListPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(SubmissionListPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
