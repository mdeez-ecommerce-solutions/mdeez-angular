import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeGroupGraphComponent } from './age-group-graph.component';

describe('AgeGroupGraphComponent', () => {
  let component: AgeGroupGraphComponent;
  let fixture: ComponentFixture<AgeGroupGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgeGroupGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeGroupGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
