import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingStatusGraphComponent } from './meeting-status-graph.component';

describe('MeetingStatusGraphComponent', () => {
  let component: MeetingStatusGraphComponent;
  let fixture: ComponentFixture<MeetingStatusGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingStatusGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingStatusGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
