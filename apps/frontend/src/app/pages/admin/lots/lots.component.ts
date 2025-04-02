import { Component, OnInit } from '@angular/core';
import { LotService } from '../../../services/lot.service'; // Adjust the path accordingly

 
 @Component({
   selector: 'app-lots',
   templateUrl: './lots.component.html',
   styleUrls: ['./lots.component.css']
 })
 export class LotsComponent implements OnInit {
   lots: any[] = []; // Initialiser comme un tableau vide
   searchTerm = '';
   itemsPerPage = 10;
   currentPage = 1;
   pages: (number | string)[] = [];
 
   constructor(private lotService: LotService) {}
 
   ngOnInit(): void {
     this.loadLots();
   }
 
   loadLots() {
     this.lotService.getLots().subscribe(
       (data) => {
         this.lots = data;
         this.calculatePagination();
       },
       (error) => {
         console.error('Erreur lors du chargement des lots :', error);
       }
     );
   }
 
   filteredLots() {
     let filtered = this.lots;
 
     if (this.searchTerm) {
       filtered = filtered.filter(lot => 
         lot.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
         lot.value.toString().includes(this.searchTerm) ||
         lot.Pourcentage.toString().includes(this.searchTerm)
       );
     }
 
     return filtered.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
   }
 
   calculatePagination() {
     const totalPages = Math.ceil(this.lots.length / this.itemsPerPage);
     const pagesArray: (number | string)[] = [];
 
     for (let i = 1; i <= totalPages; i++) {
       if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
         pagesArray.push(i);
       } else if (pagesArray[pagesArray.length - 1] !== '...') {
         pagesArray.push('...');
       }
     }
     this.pages = pagesArray;
   }
 
   goToPage(page: number | string) {
     if (typeof page === 'number') {
       this.currentPage = page;
       this.calculatePagination();
     }
   }
 
   printLot(lot: any) {
     const printContent = `
       <h1>Lot: ${lot.name}</h1>
       <p>Valeur: ${lot.value} €</p>
       <p>Pourcentage: ${lot.Pourcentage}%</p>
     `;
     const printWindow = window.open('', '', 'height=400,width=800');
     if (printWindow) {
       printWindow.document.write('<html><head><title>Imprimer le Lot</title></head><body>');
       printWindow.document.write(printContent);
       printWindow.document.close();
       printWindow.print();
     }
   }
 
   exportLot(lot: any) {
     const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(lot))}`;
     const downloadAnchor = document.createElement('a');
     downloadAnchor.setAttribute('href', dataStr);
     downloadAnchor.setAttribute('download', `lot_${lot.name}.json`);
     document.body.appendChild(downloadAnchor);
     downloadAnchor.click();
     downloadAnchor.remove();
   }
 }
 