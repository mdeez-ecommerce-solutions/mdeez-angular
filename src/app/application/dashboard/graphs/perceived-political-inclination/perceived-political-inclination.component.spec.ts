import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerceivedPoliticalInclinationComponent } from './perceived-political-inclination.component';

describe('PerceivedPoliticalInclinationComponent', () => {
  let component: PerceivedPoliticalInclinationComponent;
  let fixture: ComponentFixture<PerceivedPoliticalInclinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerceivedPoliticalInclinationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerceivedPoliticalInclinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
