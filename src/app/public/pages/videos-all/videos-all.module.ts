import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideosAllRoutingModule } from './videos-all-routing.module';
import { FormsModule } from '@angular/forms'; // Importa FormsModule


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    VideosAllRoutingModule,
    FormsModule
  ]
})
export class VideosAllModule { }
