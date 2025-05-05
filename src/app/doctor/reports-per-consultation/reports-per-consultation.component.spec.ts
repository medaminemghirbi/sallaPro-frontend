import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsPerConsultationComponent } from './reports-per-consultation.component';

describe('ReportsPerConsultationComponent', () => {
  let component: ReportsPerConsultationComponent;
  let fixture: ComponentFixture<ReportsPerConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsPerConsultationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsPerConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
