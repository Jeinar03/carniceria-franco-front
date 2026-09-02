import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RutinasUsersComponent } from './rutinas-users.component';

const routes: Routes = [
     {
      path:'rutinas-users', component:RutinasUsersComponent
     }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class RutinasUsersRoutingModule { }
