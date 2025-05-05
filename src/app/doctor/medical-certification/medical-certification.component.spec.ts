import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalCertificationComponent } from './medical-certification.component';

describe('MedicalCertificationComponent', () => {
  let component: MedicalCertificationComponent;
  let fixture: ComponentFixture<MedicalCertificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalCertificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
