import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpiGraphComponent } from './ppi-graph.component';

describe('PpiGraphComponent', () => {
  let component: PpiGraphComponent;
  let fixture: ComponentFixture<PpiGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PpiGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PpiGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
