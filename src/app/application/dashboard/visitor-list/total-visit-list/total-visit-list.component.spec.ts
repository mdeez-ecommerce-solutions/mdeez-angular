import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalVisitListComponent } from './total-visit-list.component';

describe('TotalVisitListComponent', () => {
  let component: TotalVisitListComponent;
  let fixture: ComponentFixture<TotalVisitListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalVisitListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalVisitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
