import { Injectable } from '@angular/core';
import axios from 'axios';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { BASE_URL } from '../../utils/config';
import { HttpErrorResponse } from '@angular/common/http';
import * as qs from 'qs';
@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = BASE_URL + '/tickets';
  private apirUrl2 = BASE_URL +'/ticket'

  constructor(private authService: AuthService) {}

  getTickets(page: number = 1, itemsPerPage: number = 10, searchTerm: string = ''): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token is missing or invalid');
      return throwError(() => new Error('Token is missing or invalid'));
    }

    const params = {
      page: page,
      itemsPerPage: itemsPerPage,
      search: searchTerm
    };

    const request = axios.get(this.apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: params
    });
    
    return from(request).pipe(
      map(response => ({
        tickets: response.data['hydra:member'].map((ticket: any) => ({
          code: ticket.code,
          lot: ticket.lot ? {
            id: ticket.lot.id,
            name: ticket.lot.name,
            value: ticket.lot.value,
            percentage: ticket.lot.Pourcentage
          } : null,
          user: ticket.user ? {
            firstName: ticket.user.firstName,
            phone: ticket.user.phone,
          } : null,
          isClaimed: ticket.isClaimed || false
        })),
        totalItems: response.data['hydra:totalItems']
      })),
      catchError(error => {
        console.error('Error fetching tickets:', error);
        return throwError(() => error);
      })
    );
  }



  getTotalTicketsCount(): Observable<number> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token is missing or invalid');
      return throwError(() => new Error('Token is missing or invalid'));
    }

    const request = axios.get(this.apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return from(request).pipe(
      map(response => response.data['hydra:totalItems']),
      catchError(error => {
        console.error('Error fetching total tickets count:', error);
        return throwError(() => error);
      })
    );
  }

  // Nouvelle méthode pour valider un ticket
  validateTicket(ticketCode: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token is missing or invalid');
      return throwError(() => new Error('Token is missing or invalid'));
    }


    // Convertir les données en format x-www-form-urlencoded
    const data = qs.stringify({ code: ticketCode });

    const request = axios.put(`${this.apirUrl2}/validation`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'  // Définir le type de contenu
      }
    });

    return from(request).pipe(
      map(response => response.data),
      catchError(error => {
        // Log the error details for debugging
        console.error('Error validating ticket:', error.response ? error.response.data : error.message);
        return throwError(() => new Error(error.response ? error.response.data.message : 'Unknown error occurred'));
      })
    );
  }

  // Nouvelle méthode pour rechercher un ticket par son code
  searchTicketByCode(ticketCode: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token is missing or invalid');
      return throwError(() => new Error('Token is missing or invalid'));
    }

    const request = axios.get(`${this.apirUrl2}/search`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        code: ticketCode  // Paramètre de recherche par code du ticket
      }
    });

    return from(request).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error searching ticket by code:', error);
        return throwError(() => error);
      })
    );
  }

  
}
