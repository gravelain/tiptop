import { Component, OnInit } from '@angular/core';
import { NewsletterService } from '../../../services/newsletter.service';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit {
  subscribers: any[] = []; // Tableau pour stocker les emails des abonnés venant de l'API
  searchTerm = ''; // Filtrage des abonnés
  itemsPerPage = 10; // Nombre d'éléments par page
  currentPage = 1; // Page courante
  pages: (number | string)[] = []; // Pagination

  emailBody: string = ''; // Contenu de l'email
  attachment: File | null = null; // Fichier joint
  attachmentName: string = ''; // Nom du fichier joint
  confirmationMessage: string = ''; // Message de confirmation
  success: boolean = false; // Indicateur de succès ou échec

  constructor(private newsletterService: NewsletterService) {}

  ngOnInit(): void {
    this.loadSubscribers(); // Charger les abonnés dès le chargement du composant
  }

  // Charger tous les emails d'abonnés via l'API
  loadSubscribers(): void {
    this.newsletterService.getAllSubscribedEmails().subscribe(
      (data) => {
        this.subscribers = data; // Stocker les abonnés récupérés dans le tableau
        this.calculatePagination(); // Calculer la pagination
      },
      (error) => {
        console.error('Erreur lors du chargement des abonnés :', error);
      }
    );
  }

  // Gestionnaire de sélection de fichier
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.attachment = event.target.files[0]; // Store selected file
      this.attachmentName = this.attachment ? this.attachment.name : ''; // Check if attachment is not null
    }
  }

  // Envoyer la newsletter via EmailJS
  sendNewsletter(e: Event): void {
    e.preventDefault();

    const formData = new FormData();
    formData.append('emailBody', this.emailBody);

    if (this.attachment) {
      formData.append('attachment', this.attachment, this.attachment.name);
    }

    // Utiliser EmailJS pour envoyer l'email
    emailjs.sendForm('service_3q6e7nn', 'template_3q7il3i', e.target as HTMLFormElement, 'BwsWqc0u0BYPTQpRK')
      .then((result: EmailJSResponseStatus) => {
        this.confirmationMessage = 'Votre message a été envoyé avec succès !';
        this.success = true;
        this.resetForm();
      }, (error) => {
        this.confirmationMessage = 'Une erreur s\'est produite lors de l\'envoi de votre message.';
        this.success = false;
      });
  }

  // Réinitialiser le formulaire
  resetForm() {
    this.emailBody = '';
    this.attachment = null;
    this.attachmentName = '';
  }

  // Calculer la pagination
  calculatePagination() {
    const totalPages = Math.ceil(this.subscribers.length / this.itemsPerPage);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Aller à une page spécifique
  goToPage(page: number | string) {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.calculatePagination();
    }
  }
}
