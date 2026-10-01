import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { SitioConfigService, SitioConfiguracion } from 'src/services/sitio-config/sitio-config.service';

export interface DatosBancarios {
  banco: string | null;
  titular: string | null;
  cuenta: string | null;
  clabe: string | null;
}

/**
 * Datos para que el cliente sepa a donde transferir (se capturan en el panel, Sistema, Sitio Web).
 * Si no hay ningun dato capturado no muestra nada.
 */
@Component({
  selector: 'app-datos-bancarios',
  templateUrl: './datos-bancarios.component.html',
  styleUrls: ['./datos-bancarios.component.css'],
})
export class DatosBancariosComponent implements OnInit {
  /** Folio del pedido, si ya existe. Sin folio se avisa que se dara al confirmar el pedido. */
  @Input() folio: string | null = null;

  datos: DatosBancarios | null = null;
  copiado: 'cuenta' | 'clabe' | null = null;

  private temporizador: ReturnType<typeof setTimeout> | null = null;

  constructor(private sitioConfigService: SitioConfigService) {}

  ngOnInit(): void {
    this.sitioConfigService
      .obtenerConfiguracion()
      .pipe(take(1))
      .subscribe((config) => {
        this.datos = DatosBancariosComponent.extraerDatos(config);
      });
  }

  /** Devuelve los datos bancarios de la configuracion, o null si no hay ninguno capturado. */
  static extraerDatos(config: SitioConfiguracion | null | undefined): DatosBancarios | null {
    const limpiar = (valor: string | null | undefined): string | null => {
      const texto = (valor ?? '').toString().trim();
      return texto === '' ? null : texto;
    };

    const datos: DatosBancarios = {
      banco: limpiar(config?.banco),
      titular: limpiar(config?.titular_cuenta),
      cuenta: limpiar(config?.numero_cuenta),
      clabe: limpiar(config?.clabe),
    };

    return datos.banco || datos.titular || datos.cuenta || datos.clabe ? datos : null;
  }

  copiar(valor: string | null, campo: 'cuenta' | 'clabe'): void {
    if (!valor || !navigator.clipboard) {
      return;
    }

    navigator.clipboard.writeText(valor).then(() => {
      this.copiado = campo;
      if (this.temporizador) {
        clearTimeout(this.temporizador);
      }
      this.temporizador = setTimeout(() => (this.copiado = null), 2000);
    });
  }
}
