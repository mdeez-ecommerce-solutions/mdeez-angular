import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalVisitComponent } from './total-visit.component';

describe('TotalVisitComponent', () => {
  let component: TotalVisitComponent;
  let fixture: ComponentFixture<TotalVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalVisitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
