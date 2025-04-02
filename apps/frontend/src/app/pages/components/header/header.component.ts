import { Component, OnInit, HostListener, Inject, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../services/user.service'; // Assurez-vous d'importer UserService si nécessaire


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  isMobile: boolean = false;
  currentSection: string = '';
  isLoggedIn: boolean = false;
  firstName: string = 'Utilisateur';
  email: string = 'email';
  showUserMenu: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router,
    private authService: AuthService,
    private userService: UserService, // Ajout de UserService pour actualiser les informations
    private cdr: ChangeDetectorRef  // Ajout de ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }

    // Récupération du profil utilisateur au démarrage
    this.loadUserProfile();

    // Abonnez-vous aux mises à jour en temps réel du profil utilisateur
    this.userService.userProfileUpdated$.subscribe(() => {
      this.loadUserProfile();
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
    }
  }

  private loadUserProfile(): void {
    this.authService.getUserProfile().subscribe(
      user => {
        if (user) {
          this.isLoggedIn = true;
          this.firstName = user.firstName || 'Utilisateur';
          this.email = user.email || 'user@gmail.com';
        } else {
          this.isLoggedIn = false;
        }
        this.cdr.detectChanges(); // Force la détection des changements
      },
      error => {
        this.isLoggedIn = false;
        this.cdr.detectChanges(); // Force la détection des changements en cas d'erreur
      }
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }

   checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    const menu = document.getElementById('menu');
    if (menu) {
      if (this.isMobile) {
        menu.classList.add('hidden');  // Cacher le menu sur mobile par défaut
      } else {
        menu.classList.add('hidden');  // Cacher le menu par défaut sur desktop
      }
    }
  }
  
  
  
  

  // Toggle the menu visibility
  toggleMenu(): void {
    const menu = document.getElementById('menu');
    if (menu) {
      menu.classList.toggle('hidden');  // Basculer entre affiché/masqué
    }
  }
  

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  scrollToSection(section: string): void {
    this.router.navigate(['/home'], { fragment: section }).then(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.currentSection = entry.target.id;
        }
      });
    }, options);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      observer.observe(section);
    });
  }

  logout(): void {
    this.authService.logout(); // Déconnecte l'utilisateur
    this.isLoggedIn = false;
    this.router.navigate(['/home']);
    this.cdr.detectChanges(); // Force la détection des changements après la déconnexion
  }
}
