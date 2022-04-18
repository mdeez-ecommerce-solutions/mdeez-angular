import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamajwadiPartyGraphComponent } from './samajwadi-party-graph.component';

describe('SamajwadiPartyGraphComponent', () => {
  let component: SamajwadiPartyGraphComponent;
  let fixture: ComponentFixture<SamajwadiPartyGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SamajwadiPartyGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamajwadiPartyGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
