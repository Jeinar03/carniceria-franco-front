import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideosAllComponent } from './videos-all.component';

const routes: Routes = [
     {
      path:'grupos-musculares', component:VideosAllComponent
     }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class VideosAllRoutingModule { }
