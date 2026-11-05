import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalRoutingModule } from './legal-routing.module';
import { PrivacidadComponent } from './privacidad/privacidad.component';
import { TerminosComponent } from './terminos/terminos.component';
import { DevolucionesComponent } from './devoluciones/devoluciones.component';
import { CookiesComponent } from './cookies/cookies.component';

@NgModule({
  declarations: [PrivacidadComponent, TerminosComponent, DevolucionesComponent, CookiesComponent],
  imports: [CommonModule, LegalRoutingModule],
})
export class LegalModule {}
