import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpanFillerComponent } from './span-filler.component';

describe('SpanFillerComponent', () => {
  let component: SpanFillerComponent;
  let fixture: ComponentFixture<SpanFillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpanFillerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpanFillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
