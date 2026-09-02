import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreguntasRutinasTestComponent } from './preguntas-rutinas-test.component';

const routes: Routes = [
  {
    path:'grupos-musculares', component:PreguntasRutinasTestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreguntasRutinasTestRoutingModule { }
