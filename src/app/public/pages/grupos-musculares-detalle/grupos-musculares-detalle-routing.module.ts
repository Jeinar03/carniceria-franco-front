import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GruposMuscularesDetalleComponent } from './grupos-musculares-detalle.component';

const routes: Routes = [
     {
      path:'grupos-musculares', component:GruposMuscularesDetalleComponent
     }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class GruposMuscularesDetalleRoutingModule { }
