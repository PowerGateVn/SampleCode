import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormListPage } from './form-list.page';

describe('FormListPage', () => {
    let component: FormListPage;
    let fixture: ComponentFixture<FormListPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FormListPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(FormListPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
