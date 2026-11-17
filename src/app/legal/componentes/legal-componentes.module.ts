import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvisoLegalComponent } from './aviso-legal/aviso-legal.component';

/** Piezas legales que se usan fuera de /legal (registro y confirmacion del pedido). */
@NgModule({
  declarations: [AvisoLegalComponent],
  imports: [CommonModule, RouterModule],
  exports: [AvisoLegalComponent],
})
export class LegalComponentesModule {}
