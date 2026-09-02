import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrearCuentaRoutingModule } from './create-account-routing.module';
import { FormsModule } from '@angular/forms'; // Importa FormsModule


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CrearCuentaRoutingModule,
    FormsModule
  ]
})
export class CrearCuentaModule { }
