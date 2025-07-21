import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingAnalyazeComponent } from './loading-analyaze.component';

describe('LoadingAnalyazeComponent', () => {
  let component: LoadingAnalyazeComponent;
  let fixture: ComponentFixture<LoadingAnalyazeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingAnalyazeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingAnalyazeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
