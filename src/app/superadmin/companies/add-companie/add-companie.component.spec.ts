import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanieComponent } from './add-companie.component';

describe('AddCompanieComponent', () => {
  let component: AddCompanieComponent;
  let fixture: ComponentFixture<AddCompanieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCompanieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCompanieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
