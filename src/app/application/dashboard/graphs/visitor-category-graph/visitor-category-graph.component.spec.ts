import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorCategoryGraphComponent } from './visitor-category-graph.component';

describe('VisitorCategoryGraphComponent', () => {
  let component: VisitorCategoryGraphComponent;
  let fixture: ComponentFixture<VisitorCategoryGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorCategoryGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorCategoryGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
