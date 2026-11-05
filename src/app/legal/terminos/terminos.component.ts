import { Component } from '@angular/core';
import { SitioConfigService } from '../../../services/sitio-config/sitio-config.service';
import { LegalBase } from '../legal-base';

@Component({
  selector: 'app-legal-terminos',
  templateUrl: './terminos.component.html',
  styleUrls: ['../legal.css'],
})
export class TerminosComponent extends LegalBase {
  constructor(sitioConfigService: SitioConfigService) {
    super(sitioConfigService);
  }
}
