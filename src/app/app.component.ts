import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { LogService } from 'src/services/logs/log-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'convertTheme';

  constructor(private router: Router, private logService: LogService) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.logService.setLog('VISITA', `Ruta visitada: ${event.urlAfterRedirects}`).subscribe({
          next: () => console.log('Log registrado para ruta:', event.urlAfterRedirects),
          error: (err) => console.error('Error al registrar log global:', err),
        });
      }
    });
  }
}
