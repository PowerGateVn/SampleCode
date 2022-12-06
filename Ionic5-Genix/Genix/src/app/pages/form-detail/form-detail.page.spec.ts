import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormDetailPage } from './form-detail.page';

describe('FormDetailPage', () => {
    let component: FormDetailPage;
    let fixture: ComponentFixture<FormDetailPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FormDetailPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(FormDetailPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
