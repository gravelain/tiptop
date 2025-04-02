import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Assurez-vous que le chemin est correct
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  name: string = '';
  email: string = '';
  message: string = '';
  confirmationMessage: string = '';
  isLoggedIn: boolean = false; // Variable pour vérifier si l'utilisateur est connecté

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Vérifiez si l'utilisateur est connecté
    this.authService.getUserProfile().subscribe(
      (user: any) => {
        if (user) {
          this.isLoggedIn = true;
          this.name = user.firstName + ' ' + (user.name || '');
          this.email = user.email || '';
        } else {
          this.isLoggedIn = false;
        }
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
        this.isLoggedIn = false;
      }
    );
  }

  public sendEmail(e: Event) {
    e.preventDefault();
    emailjs.sendForm('service_3q6e7nn', 'template_3q7il3i', e.target as HTMLFormElement, 'BwsWqc0u0BYPTQpRK')
      .then((result: EmailJSResponseStatus) => {
        this.confirmationMessage = 'Votre message a été envoyé avec succès !';
        this.name = '';
        this.email = '';
        this.message = '';
      }, (error) => {
        this.confirmationMessage = 'Une erreur s\'est produite lors de l\'envoi de votre message. Veuillez réessayer plus tard.';
      });
  }
}
