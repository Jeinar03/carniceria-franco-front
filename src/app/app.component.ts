import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Ya no se registra cada pagina que visita el cliente (decision 7 del spec de legales).
  title = 'convertTheme';
}
