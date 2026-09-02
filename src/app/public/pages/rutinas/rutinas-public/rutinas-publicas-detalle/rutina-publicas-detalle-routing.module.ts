import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RutinasPublicasDetalleComponent } from './rutinas-publicas-detalle.component';

const routes: Routes = [
     {
      path:'rutinas-publicas', component:RutinasPublicasDetalleComponent
     }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class RutinasPublicasDetalleRoutingModule { }
