import { Directive, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SitioConfigService, SitioConfiguracion } from '../../services/sitio-config/sitio-config.service';
import { DATOS_LEGALES, FECHA_ACTUALIZACION_LEGAL, VERSION_LEGAL } from './datos-legales';

/** Lo que comparten las cuatro paginas: datos del negocio (Sistema, Sitio Web) y datos solo legales. */
@Directive()
export abstract class LegalBase implements OnInit {
  configuracion$!: Observable<SitioConfiguracion>;
  readonly datos = DATOS_LEGALES;
  readonly fechaActualizacion = FECHA_ACTUALIZACION_LEGAL;
  readonly version = VERSION_LEGAL;

  constructor(private sitioConfigService: SitioConfigService) {}

  ngOnInit(): void {
    this.configuracion$ = this.sitioConfigService.obtenerConfiguracion();
    window.scrollTo(0, 0);
  }
}
