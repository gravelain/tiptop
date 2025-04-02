import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.css']
})
export class CookieBannerComponent {
  isCookieBannerVisible: boolean = true;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Vérifier si l'application s'exécute dans un navigateur
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      // Vérifier si l'utilisateur a déjà accepté les cookies
      const cookieConsent = localStorage.getItem('cookieConsent');
      if (cookieConsent === 'true') {
        this.isCookieBannerVisible = false;
      }
    }
  }

  acceptCookies(): void {
    if (this.isBrowser) {
      // Enregistrer le consentement de l'utilisateur dans le localStorage
      localStorage.setItem('cookieConsent', 'true');
    }
    this.isCookieBannerVisible = false;
  }

  // Méthode pour réinitialiser le consentement (optionnel)
  clearCookieConsent(): void {
    if (this.isBrowser) {
      localStorage.removeItem('cookieConsent');
    }
    this.isCookieBannerVisible = true;
  }
}
