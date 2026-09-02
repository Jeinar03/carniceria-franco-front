import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RutinasPublicasComponent } from './rutinas-publicas.component';

const routes: Routes = [
     {
      path:'rutinas-publicas', component:RutinasPublicasComponent
     }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class RutinasPublicasRoutingModule { }
