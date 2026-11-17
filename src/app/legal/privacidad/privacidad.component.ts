import { Component } from '@angular/core';
import { SitioConfigService } from '../../../services/sitio-config/sitio-config.service';
import { LegalBase } from '../legal-base';

@Component({
  selector: 'app-legal-privacidad',
  templateUrl: './privacidad.component.html',
  styleUrls: ['../legal.css'],
})
export class PrivacidadComponent extends LegalBase {
  constructor(sitioConfigService: SitioConfigService) {
    super(sitioConfigService);
  }
}
