import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePaginatorComponent } from './base-paginator.component';

describe('BasePaginatorComponent', () => {
  let component: BasePaginatorComponent;
  let fixture: ComponentFixture<BasePaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasePaginatorComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BasePaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
