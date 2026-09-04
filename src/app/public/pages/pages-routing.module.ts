import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisRutinasGuard } from 'src/guards/mis-rutinas/mis-rutinas.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { ProductosComponent } from './productos/productos.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { CarritoComponent } from './carrito/carrito.component';

const routes: Routes = [
  {
    path: 'productos',
    component: ProductosComponent,
  },
  {
    path: 'categorias',
    component: CategoriasComponent,
  },
  {
    path: 'carrito',
    component: CarritoComponent,
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [MisRutinasGuard],
  },
  {
    path: 'seguimiento',
    component: SeguimientoComponent,
    canActivate: [MisRutinasGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
