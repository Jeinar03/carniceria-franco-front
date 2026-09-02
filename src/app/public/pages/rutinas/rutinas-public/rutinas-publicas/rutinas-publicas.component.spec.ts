import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutinasPublicasComponent } from './rutinas-publicas.component';

describe('RutinasPublicasComponent', () => {
  let component: RutinasPublicasComponent;
  let fixture: ComponentFixture<RutinasPublicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutinasPublicasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutinasPublicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
