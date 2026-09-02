import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GruposMuscularesComponent } from './grupos-musculares.component';

const routes: Routes = [
     {
      path:'grupos-musculares', component:GruposMuscularesComponent
     }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class GruposMuscularesRoutingModule { }
