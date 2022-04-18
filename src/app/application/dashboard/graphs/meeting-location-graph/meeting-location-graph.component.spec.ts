import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingLocationGraphComponent } from './meeting-location-graph.component';

describe('MeetingLocationGraphComponent', () => {
  let component: MeetingLocationGraphComponent;
  let fixture: ComponentFixture<MeetingLocationGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingLocationGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingLocationGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
