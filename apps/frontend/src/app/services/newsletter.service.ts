import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import axios from 'axios';
import { catchError, map } from 'rxjs/operators';
import { BASE_URL } from '../../utils/config';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private apiUrl = BASE_URL + '/newsletter';
  private apiUrl2 = BASE_URL + '/api/subscribers';

  // Méthode pour s'inscrire à la newsletter
  subscribeToNewsletter(email: string): Observable<any> {
    const request = axios.post(`${this.apiUrl}/subscribe`, { email });

    return from(request).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error subscribing to newsletter:', error);
        return throwError(() => error);
      })
    );
  }

  // Méthode pour se désinscrire de la newsletter
  unsubscribeFromNewsletter(email: string): Observable<any> {
    const request = axios.post(`${this.apiUrl}/unsubscribe`, { email });

    return from(request).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error unsubscribing from newsletter:', error);
        return throwError(() => error);
      })
    );
  }

  // Méthode pour obtenir toutes les adresses e-mail inscrites à la newsletter
  getAllSubscribedEmails(): Observable<any[]> {
    const request = axios.get(this.apiUrl2);

    return from(request).pipe(
      map(response => response.data), // Modifiez cela en fonction de la structure de votre API
      catchError(error => {
        console.error('Error fetching all subscribed emails:', error);
        return throwError(() => error);
      })
    );
  }
}
