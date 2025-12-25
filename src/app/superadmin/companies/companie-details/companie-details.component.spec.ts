import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanieDetailsComponent } from './companie-details.component';

describe('CompanieDetailsComponent', () => {
  let component: CompanieDetailsComponent;
  let fixture: ComponentFixture<CompanieDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanieDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanieDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
