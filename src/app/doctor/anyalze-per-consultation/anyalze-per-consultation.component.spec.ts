import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnyalzePerConsultationComponent } from './anyalze-per-consultation.component';

describe('AnyalzePerConsultationComponent', () => {
  let component: AnyalzePerConsultationComponent;
  let fixture: ComponentFixture<AnyalzePerConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnyalzePerConsultationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnyalzePerConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
