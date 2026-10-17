import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { SitioConfigService } from '../../../services/sitio-config/sitio-config.service';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('FooterComponent numero de WhatsApp', () => {
  const component = new FooterComponent({} as SitioConfigService);

  it('deja los 10 digitos aunque lo capturen con 52, +52 o 521', () => {
    expect(component.limpiarNumero('7531093826')).toBe('7531093826');
    expect(component.limpiarNumero('753-109-3826')).toBe('7531093826');
    expect(component.limpiarNumero('527531093826')).toBe('7531093826');
    expect(component.limpiarNumero('+52 753 109 3826')).toBe('7531093826');
    expect(component.limpiarNumero('5217531093826')).toBe('7531093826');
  });
});
