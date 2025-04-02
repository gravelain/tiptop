import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../../services/ticket.service';
import { AuthService } from '../../../services/auth.service'; // Assurez-vous que le chemin est correct

interface Ticket {
  code: string;
  lot: { id: number; name: string; value: number; percentage: number };
  user?: { firstName: string; phone: string };
  is_claimed: boolean;
  selected?: boolean;
}

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  tickets: Ticket[] = []; // Tous les tickets récupérés du serveur pour la page courante
  displayedTickets: Ticket[] = []; // Tickets à afficher en fonction de la recherche et de la pagination
  searchTerm = '';  // Terme de recherche pour filtrer les tickets par code
  itemsPerPage = 30;  // Nombre d'éléments par page
  currentPage = 1;  // Page actuelle
  totalPages = 0;  // Total des pages
  totalItems = 0;  // Total des éléments
  pages: (number | string)[] = [];
  isLoading = false; // Indicateur de chargement
  userRole: string = ''; // Rôle de l'utilisateur connecté

  message: string | null = null;
  messageType: 'success' | 'error' | null = null;

  constructor(private ticketService: TicketService, private authService: AuthService) {}

  ngOnInit(): void {
    this.getUserRole(); // Récupérer le rôle de l'utilisateur au chargement du composant
    this.loadTickets(this.currentPage, this.itemsPerPage);
  }

  getUserRole(): void {
    this.authService.getUserProfile().subscribe(
      (data) => {
        this.userRole = data.Rle; // Assurez-vous que 'Rle' correspond au nom de la propriété dans la réponse de votre API
      },
      (error) => {
        console.error('Erreur lors de la récupération du rôle utilisateur :', error);
      }
    );
  }

  loadTickets(page: number, itemsPerPage: number) {
    this.isLoading = true;
    this.ticketService.getTickets(page, itemsPerPage, this.searchTerm).subscribe(
      (data) => {
        this.tickets = data.tickets;
        this.totalItems = data.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updateDisplayedTickets(); // Mettre à jour les tickets affichés
        this.calculatePagination(); // Calculer les pages pour la pagination
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement des tickets :', error);
        this.isLoading = false;
      }
    );
  }

  applySearch() {
    // Réinitialiser à la première page lors de la recherche et charger les tickets filtrés par code
    if (this.searchTerm.trim() !== '') {
      this.currentPage = 1;
      this.loadTickets(this.currentPage, this.itemsPerPage);
    }
  }

  updateDisplayedTickets() {
    // Affiche uniquement les tickets récupérés pour la page actuelle
    this.displayedTickets = this.tickets;
  }

  calculatePagination() {
    this.pages = [];
    const maxPagesToShow = 5; // Nombre maximum de pages à afficher
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      this.pages.push(i);
    }

    if (startPage > 1) this.pages.unshift('...');
    if (startPage > 2) this.pages.unshift(1);

    if (endPage < this.totalPages) this.pages.push('...');
    if (endPage < this.totalPages - 1) this.pages.push(this.totalPages);
  }

  goToPage(page: number | string) {
    if (typeof page === 'number' && page !== this.currentPage) {
      this.currentPage = page;
      this.loadTickets(this.currentPage, this.itemsPerPage);
    }
  }

  onItemsPerPageChange() {
    this.currentPage = 1;  // Réinitialiser à la première page
    this.loadTickets(this.currentPage, this.itemsPerPage);  // Recharger les tickets avec la nouvelle valeur d'items par page
  }

  printTicket(ticket: Ticket) {
    const printContent = `
      <h1>Ticket: ${ticket.code}</h1>
      <p>Lot ID: ${ticket.lot.id}</p>
      <p>Status: ${ticket.is_claimed ? 'Validé' : 'Non Validé'}</p>
      <p>Utilisateur: ${ticket.user ? ticket.user.firstName : 'Non assigné'}</p>
      <p>Téléphone: ${ticket.user ? ticket.user.phone : 'Non assigné'}</p>
    `;
    const printWindow = window.open('', '', 'height=400,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Imprimer le Ticket</title></head><body>');
      printWindow.document.write(printContent);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  }

  exportTicket(ticket: Ticket) {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(ticket))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ticket_${ticket.code}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  anyTicketSelected(): boolean {
    return this.displayedTickets.some(ticket => ticket.selected);
  }

  validateSelectedTickets(): void {
    const selectedTickets = this.displayedTickets.filter(ticket => ticket.selected);
    if (selectedTickets.length === 0) {
      this.showTemporaryMessage('Aucun ticket sélectionné.', 'error');
      return;
    }

    selectedTickets.forEach(ticket => {
      this.ticketService.validateTicket(ticket.code).subscribe(
        () => {
          ticket.is_claimed = true;
          ticket.selected = false;
          this.showTemporaryMessage('Tickets validés avec succès.', 'success');
        },
        (error) => {
          console.error('Erreur lors de la validation du ticket :', error.message);
          this.showTemporaryMessage(`Erreur: ${error.message}`, 'error');
        }
      );
    });
  }

  showTemporaryMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
      this.messageType = null;
    }, 5000);
  }

  searchTicketByCode() {
    if (this.searchTerm.trim() === '') {
      this.displayedTickets = this.tickets; // Si aucun terme de recherche, afficher tous les tickets
    } else {
      this.isLoading = true;
      this.ticketService.searchTicketByCode(this.searchTerm).subscribe(
        (data) => {
          this.displayedTickets = [data]; // Afficher uniquement le ticket correspondant
          this.isLoading = false;
        },
        (error) => {
          console.error('Erreur lors de la recherche du ticket :', error);
          this.showTemporaryMessage('Aucun ticket trouvé.', 'error');
          this.isLoading = false;
        }
      );
    }
  }
}
