import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  paginatedUsers: any[] = [];
  currentPage = 1;
  totalPages = 1;
  pages: (number | string)[] = [];
  searchTerm: string = '';
  selectedRole: string = '';
  itemsPerPage: number = 10;
  totalItems: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers(this.currentPage, this.itemsPerPage).subscribe(
      (data) => {
        this.users = data['hydra:member'] || [];
        this.totalItems = data['hydra:totalItems'] || 0;
        this.applyFiltersAndPagination();
      },
      (error) => {
        console.error('Erreur lors du chargement des utilisateurs :', error);
      }
    );
  }

  applyFiltersAndPagination(): void {
    this.filterUsers();
    this.paginateUsers();
    this.generatePagesArray();
  }

  filterUsers(): void {
    let filtered = this.users;

    if (this.searchTerm) {
      filtered = filtered.filter(user =>
        (user.firstName && user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (user.name && user.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }

    if (this.selectedRole) {
      filtered = filtered.filter(user => user.roles && user.roles.includes(this.selectedRole));
    }

    this.filteredUsers = filtered;
    this.totalItems = this.filteredUsers.length;
}


  paginateUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  generatePagesArray(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    const pagesArray: (number | string)[] = [];

    for (let i = 1; i <= this.totalPages; i++) {
      if (i === 1 || i === this.totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
        pagesArray.push(i);
      } else if (pagesArray[pagesArray.length - 1] !== '...') {
        pagesArray.push('...');
      }
    }

    this.pages = pagesArray;
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number' && page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFiltersAndPagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1; // Reset to first page
    this.applyFiltersAndPagination();  // Reapply filters and pagination with new itemsPerPage value
  }

  printUsers(): void {
    const printContent = document.getElementById('user-table')?.outerHTML;
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Users</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>
            ${printContent || ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }

  exportUsers(): void {
    const csvContent = "data:text/csv;charset=utf-8,"
      + this.paginatedUsers.map(user => `${user.firstName},${user.name},${user.email},${user.phone},${user.roles.join(', ')}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
