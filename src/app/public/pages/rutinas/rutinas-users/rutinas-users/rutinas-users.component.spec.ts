import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutinasUsersComponent } from './rutinas-users.component';

describe('RutinasUsersComponent', () => {
  let component: RutinasUsersComponent;
  let fixture: ComponentFixture<RutinasUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutinasUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutinasUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
