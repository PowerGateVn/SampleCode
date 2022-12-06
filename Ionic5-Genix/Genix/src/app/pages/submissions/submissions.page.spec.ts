import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubmissionsPage } from './submissions.page';

describe('SubmissionsPage', () => {
    let component: SubmissionsPage;
    let fixture: ComponentFixture<SubmissionsPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SubmissionsPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(SubmissionsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
