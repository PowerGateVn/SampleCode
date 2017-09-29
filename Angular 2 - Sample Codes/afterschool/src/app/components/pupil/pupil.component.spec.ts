import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PupilComponent } from './pupil.component';

describe('PupilComponent', () => {
  let component: PupilComponent;
  let fixture: ComponentFixture<PupilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PupilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PupilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
