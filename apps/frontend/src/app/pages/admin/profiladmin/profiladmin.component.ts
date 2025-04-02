import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profiladmin',
  templateUrl: './profiladmin.component.html',
  styleUrls: ['./profiladmin.component.css']
})
export class ProfiladminComponent implements OnInit {
  user: any = {
    firstName: '',
    name: '',
    email: '',
    phone: '',
    Rle: ''
  };
  originalRle: string = '';
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationType: string = 'success'; // success or error

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      (data) => {
        this.user = data;
        this.originalRle = this.user.Rle;
        // Adapter le rôle pour l'affichage
        if (this.user.Rle === 'A') {
          this.user.Rle = 'Admin';
        } else if (this.user.Rle === 'C') {
          this.user.Rle = 'Caissier';
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération du profil utilisateur:', error);
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    );
  }

  updateProfile(): void {
    const updatedUser = {
      firstName: this.user.firstName,
      name: this.user.name,
      phone: this.user.phone,
      Rle: this.originalRle // Garder le rôle original
    };

    this.userService.updateUser(updatedUser).subscribe(
      () => {
        this.showNotificationMessage('Profil mis à jour avec succès', 'success');
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du profil utilisateur:', error);
        this.showNotificationMessage('Une erreur est survenue lors de la mise à jour du profil', 'error');
      }
    );
  }

  showNotificationMessage(message: string, type: string): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 3000); // Notification visible pendant 3 secondes
  }
}
