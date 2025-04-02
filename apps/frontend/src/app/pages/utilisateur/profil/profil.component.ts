import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  @Output() profileUpdated = new EventEmitter<any>();

  firstName: string = '';
  name: string = ''; 
  email: string = '';
  phone: string = '';
  userId: number | null = null;
  isLoading = true;
  updateSuccessMessage: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe(
      (user: any) => {
        if (user) {
          this.firstName = user.firstName || '';
          this.name = user.name || ''; 
          this.email = user.email || '';
          this.phone = user.phone || '';
          this.userId = user.id;
        } else {
          this.router.navigate(['/login']);
        }
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      }
    );
  }
  
  onUpdate(): void {
    const updatedUserData = {
        firstName: this.firstName,
        name: this.name, 
        email: this.email,
        phone: this.phone
    };

    this.userService.updateUser(updatedUserData).subscribe(
        (response: any) => {
            this.updateSuccessMessage = true;
            this.profileUpdated.emit(updatedUserData); // Émettre l'événement de mise à jour du profil

            setTimeout(() => {
                this.updateSuccessMessage = false;
            }, 3000);
        },
        (error: any) => {
            console.error('Une erreur est survenue lors de la mise à jour du profil', error);
        }
    );
  }
}
