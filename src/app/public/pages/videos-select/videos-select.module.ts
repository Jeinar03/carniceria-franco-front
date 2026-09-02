import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideosSelectRoutingModule } from './videos-select-routing.module';
import { FormsModule } from '@angular/forms'; // Importa FormsModule


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    VideosSelectRoutingModule,
    FormsModule
  ]
})
export class VideosSelectModule { }
