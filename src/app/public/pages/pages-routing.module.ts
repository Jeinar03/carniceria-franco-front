import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogGirdComponent } from './blog-gird/blog-gird.component';
import { TestimontalComponent } from './testimontal/testimontal.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { RutinasPublicasComponent } from './rutinas/rutinas-public/rutinas-publicas/rutinas-publicas.component';
import { RutinasUsersComponent } from './rutinas/rutinas-users/rutinas-users/rutinas-users.component';
import { MisRutinasGuard } from 'src/guards/mis-rutinas/mis-rutinas.guard';
import { RutinasPublicasDetalleComponent } from './rutinas/rutinas-public/rutinas-publicas-detalle/rutinas-publicas-detalle.component';
import { GruposMuscularesComponent } from './grupos-musculares/grupos-musculares.component';
import { GruposMuscularesDetalleComponent } from './grupos-musculares-detalle/grupos-musculares-detalle.component';
import { VideoDetalleGMComponent } from './video-detalle-gm/video-detalle-gm.component';
import {PreguntasRutinasTestComponent} from "./rutinas/preguntas-rutinas-test/preguntas-rutinas-test.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import { VideosAllComponent } from './videos-all/videos-all.component';
import { VideosSelectComponent } from './videos-select/videos-select.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { LesionesComponent } from './lesiones/lesiones.component';
import { GuiaRecuperacionComponent } from './guia-recuperacion/guia-recuperacion.component';
import { ProductosComponent } from './productos/productos.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { CarritoComponent } from './carrito/carrito.component';

const routes: Routes = [
  {
    path: 'blog-gird',
    component:BlogGirdComponent
  },
  {
    path: 'blog-detail',
    component:BlogDetailComponent
  },
  {
    path: 'testimontal',
    component:TestimontalComponent
  },
  {
    path: 'create-account',
    component:CreateAccountComponent
  },
  {
    path: 'rutinas-publicas',
    component:RutinasPublicasComponent
  },
  {
    path: 'grupos-musculares',
    component:GruposMuscularesComponent
  },
  {
    path: 'seguimiento',
    component:SeguimientoComponent,
    canActivate: [MisRutinasGuard]
  },
  {
    path: 'rutinas-publicas/:id',
    component: RutinasPublicasDetalleComponent
  },
  {
    path: 'grupos-musculares/video/:id',
    component: VideoDetalleGMComponent
  },
  {
    path: 'grupos-musculares/:id',
    component: GruposMuscularesDetalleComponent
  },
  {
    path: 'videos/:nombre',
    component: VideosSelectComponent
  },
  {
    path: 'rutinas-users',
    component:RutinasUsersComponent,
    canActivate: [MisRutinasGuard]
  },
  {
    path: 'videos-all',
    component:VideosAllComponent,

  },
  {
    path: 'lesiones',
    component:LesionesComponent,

  },
  {
    path: 'guia-recuperacion',
    component:GuiaRecuperacionComponent,

  },
  {
    path: 'preguntas-rutinas-test',
    component:PreguntasRutinasTestComponent,
    canActivate: [MisRutinasGuard]
  },
  {
    path: 'profile',
    component:UserProfileComponent,
    canActivate: [MisRutinasGuard]
  },
  {
    path: 'productos',
    component: ProductosComponent
  },
  {
    path: 'categorias',
    component: CategoriasComponent
  },
  {
    path: 'carrito',
    component: CarritoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class PagesRoutingModule { }
