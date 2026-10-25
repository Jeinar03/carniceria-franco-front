import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Links de Google Maps. Misma regla que el servidor (App\Rules\UbicacionGoogleMaps): el link
 * se le pasa tal cual al mandadito, asi que solo se acepta el que genera Maps al compartir.
 */
export function esLinkGoogleMaps(valor: string | null | undefined): boolean {
  const texto = (valor || '').trim();
  if (!texto) {
    return false;
  }

  let url: URL;
  try {
    url = new URL(texto);
  } catch {
    return false;
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return false;
  }

  const host = url.hostname.toLowerCase();
  if (host === 'maps.app.goo.gl') {
    return true;
  }
  if (host === 'goo.gl') {
    return url.pathname.startsWith('/maps');
  }
  if (!/^(www\.|maps\.)?google\.com(\.mx)?$/.test(host)) {
    return false;
  }

  return host.startsWith('maps.') || url.pathname.startsWith('/maps');
}

/** Validador de formularios: vacio es valido; si hay texto debe ser un link de Google Maps. */
export const linkMapsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = control.value;
  return !valor || !String(valor).trim() || esLinkGoogleMaps(valor) ? null : { linkMaps: true };
};

/** Link para abrir en Maps: el capturado o, si no hay, una busqueda con la direccion. */
export function enlaceMapa(direccion: string | null | undefined, link?: string | null): string | null {
  if (link && link.trim()) {
    return link.trim();
  }
  if (direccion && direccion.trim()) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(direccion.trim());
  }
  return null;
}
