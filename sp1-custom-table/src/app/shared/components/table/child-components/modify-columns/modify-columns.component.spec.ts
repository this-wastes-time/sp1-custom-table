import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyColumnsComponent } from './modify-columns.component';

describe('ModifyColumnsComponent', () => {
  let component: ModifyColumnsComponent;
  let fixture: ComponentFixture<ModifyColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyColumnsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
