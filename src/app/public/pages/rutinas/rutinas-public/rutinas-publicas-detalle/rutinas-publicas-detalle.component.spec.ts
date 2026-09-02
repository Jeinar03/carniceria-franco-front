import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutinasPublicasDetalleComponent } from './rutinas-publicas-detalle.component';

describe('RutinasPublicasDetalleComponent', () => {
  let component: RutinasPublicasDetalleComponent;
  let fixture: ComponentFixture<RutinasPublicasDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutinasPublicasDetalleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutinasPublicasDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
