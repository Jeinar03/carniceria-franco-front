import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideosSelectComponent } from './videos-select.component';

const routes: Routes = [
     {
      path:'grupos-musculares', component:VideosSelectComponent
     }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class VideosSelectRoutingModule { }
