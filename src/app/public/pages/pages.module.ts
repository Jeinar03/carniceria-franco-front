import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PagesRoutingModule } from './pages-routing.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { ProductosComponent } from './productos/productos.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { CarritoComponent } from './carrito/carrito.component';

@NgModule({
  declarations: [
    UserProfileComponent,
    SeguimientoComponent,
    ProductosComponent,
    CategoriasComponent,
    CarritoComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class PagesModule {}
