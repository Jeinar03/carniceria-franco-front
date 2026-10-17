import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactComponent } from './contact.component';
import { SitioConfigService } from '../../../services/sitio-config/sitio-config.service';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('ContactComponent numero de WhatsApp', () => {
  const component = new ContactComponent({} as SitioConfigService);

  it('deja los 10 digitos aunque lo capturen con 52, +52 o 521', () => {
    expect(component.limpiarNumero('7531093826')).toBe('7531093826');
    expect(component.limpiarNumero('+52 753 109 3826')).toBe('7531093826');
    expect(component.limpiarNumero('5217531093826')).toBe('7531093826');
  });
});
