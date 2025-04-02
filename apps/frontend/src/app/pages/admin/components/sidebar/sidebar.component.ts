import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'] // Corrigé pour 'styleUrls' (avec 's')
})
export class SidebarComponent implements OnInit {
  userRole: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Récupérer le rôle de l'utilisateur lors de l'initialisation du composant
    this.authService.getUserProfile().subscribe(profile => {
      this.userRole = profile ? profile.Rle : null;
    });
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  logout(): void {
    this.authService.logout();
  }
}
