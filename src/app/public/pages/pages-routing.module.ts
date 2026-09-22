import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { ProductosComponent } from './productos/productos.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { CarritoComponent } from './carrito/carrito.component';
import { PaymentCallbackComponent } from './payment-callback/payment-callback.component';

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
    // A esta ruta regresa Mercado Pago después de pagar (back_urls de la preferencia).
    path: 'payment-callback',
    component: PaymentCallbackComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'seguimiento',
    component: SeguimientoComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
