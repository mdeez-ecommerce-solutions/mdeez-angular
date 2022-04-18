import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhomVisitorGraphComponent } from './whom-visitor-graph.component';

describe('WhomVisitorGraphComponent', () => {
  let component: WhomVisitorGraphComponent;
  let fixture: ComponentFixture<WhomVisitorGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhomVisitorGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhomVisitorGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
