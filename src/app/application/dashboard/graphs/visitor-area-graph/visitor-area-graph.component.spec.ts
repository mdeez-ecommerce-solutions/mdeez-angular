import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorAreaGraphComponent } from './visitor-area-graph.component';

describe('VisitorAreaGraphComponent', () => {
  let component: VisitorAreaGraphComponent;
  let fixture: ComponentFixture<VisitorAreaGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorAreaGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorAreaGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
