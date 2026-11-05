import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivacidadComponent } from './privacidad/privacidad.component';
import { TerminosComponent } from './terminos/terminos.component';
import { DevolucionesComponent } from './devoluciones/devoluciones.component';
import { CookiesComponent } from './cookies/cookies.component';

const routes: Routes = [
  { path: '', redirectTo: 'privacidad', pathMatch: 'full' },
  { path: 'privacidad', component: PrivacidadComponent },
  { path: 'terminos', component: TerminosComponent },
  { path: 'devoluciones', component: DevolucionesComponent },
  { path: 'cookies', component: CookiesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalRoutingModule {}
