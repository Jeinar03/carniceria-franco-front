import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoDetalleGMComponent } from './video-detalle-gm.component';

const routes: Routes = [
     {
      path:'grupos-musculares', component:VideoDetalleGMComponent
     }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class VideoDetalleGMRoutingModule { }
