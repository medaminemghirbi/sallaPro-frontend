import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyDoctorProfilComponent } from './verify-doctor-profil.component';

describe('VerifyDoctorProfilComponent', () => {
  let component: VerifyDoctorProfilComponent;
  let fixture: ComponentFixture<VerifyDoctorProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyDoctorProfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyDoctorProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
