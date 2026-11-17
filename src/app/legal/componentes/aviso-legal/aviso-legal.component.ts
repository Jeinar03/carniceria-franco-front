import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { SitioConfigService, SitioConfiguracion } from '../../../../services/sitio-config/sitio-config.service';
import { DATOS_LEGALES } from '../../datos-legales';

/**
 * Aviso de privacidad simplificado (LFPDPPP art. 16) que se muestra donde se piden datos:
 * registro y confirmacion del pedido. Con `conCasilla` pide ademas aceptar privacidad y terminos.
 * Los enlaces abren en pestana nueva para no perder lo capturado.
 */
@Component({
  selector: 'app-aviso-legal',
  templateUrl: './aviso-legal.component.html',
  styleUrls: ['./aviso-legal.component.css'],
})
export class AvisoLegalComponent implements OnInit {
  /** registro: solo aviso y casilla. pedido: agrega "Al confirmar aceptas los Terminos y Devoluciones". */
  @Input() contexto: 'registro' | 'pedido' = 'registro';
  @Input() conCasilla = false;
  @Input() aceptado = false;
  @Output() aceptadoChange = new EventEmitter<boolean>();

  readonly datos = DATOS_LEGALES;
  configuracion$!: Observable<SitioConfiguracion>;

  constructor(private sitioConfigService: SitioConfigService) {}

  ngOnInit(): void {
    this.configuracion$ = this.sitioConfigService.obtenerConfiguracion();
  }

  cambiar(valor: boolean): void {
    this.aceptado = valor;
    this.aceptadoChange.emit(valor);
  }
}
