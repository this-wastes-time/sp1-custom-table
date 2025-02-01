import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerPaginatorComponent } from './server-paginator.component';

describe('ServerPaginatorComponent', () => {
  let component: ServerPaginatorComponent;
  let fixture: ComponentFixture<ServerPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerPaginatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
