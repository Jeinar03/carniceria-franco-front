import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposMuscularesDetalleComponent } from './grupos-musculares-detalle.component';

describe('GruposMuscularesDetalleComponent', () => {
  let component: GruposMuscularesDetalleComponent;
  let fixture: ComponentFixture<GruposMuscularesDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GruposMuscularesDetalleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GruposMuscularesDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
