import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorOccupationGraphComponent } from './visitor-occupation-graph.component';

describe('VisitorOccupationGraphComponent', () => {
  let component: VisitorOccupationGraphComponent;
  let fixture: ComponentFixture<VisitorOccupationGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorOccupationGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorOccupationGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
