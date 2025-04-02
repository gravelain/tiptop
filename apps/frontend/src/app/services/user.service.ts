import { Injectable } from '@angular/core';
import { from, Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import axios from 'axios';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { BASE_URL } from '../../utils/config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = BASE_URL;
  
  // BehaviorSubject pour notifier les composants des mises à jour du profil
  private userProfileUpdatedSource = new BehaviorSubject<void>(undefined);
  userProfileUpdated$ = this.userProfileUpdatedSource.asObservable();

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Récupérer le profil utilisateur à partir de l'API
   */
  getUserProfile(): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token manquant ou invalide');
      this.router.navigate(['/login']);
      return throwError(() => new Error('Token manquant ou invalide'));
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    return from(
      axios.get(`${this.apiUrl}/me`, { headers })
    ).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Erreur lors de la récupération du profil utilisateur:', error);
        return throwError(() => new Error('Erreur lors de la récupération du profil utilisateur'));
      })
    );
  }

  /**
   * Mettre à jour les données du profil utilisateur
   * @param userData - Les données à mettre à jour pour le profil utilisateur
   */
  updateUser(userData: any): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token manquant ou invalide');
      this.router.navigate(['/login']);
      return throwError(() => new Error('Token manquant ou invalide'));
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return from(
      axios.put(`${this.apiUrl}/user/update`, userData, { headers })
    ).pipe(
      map(response => response.data),
      tap(() => {
        // Notifier les abonnés que le profil a été mis à jour
        this.userProfileUpdatedSource.next();
      }),
      catchError(error => {
        console.error('Erreur lors de la mise à jour du profil utilisateur:', error);
        return throwError(() => new Error(error.message || 'Erreur lors de la mise à jour du profil utilisateur'));
      })
    );
  }

  /**
   * Récupérer une liste d'utilisateurs depuis l'API
   */
  getUsers(page: number, itemsPerPage: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token manquant ou invalide');
      this.router.navigate(['/login']);
      return throwError(() => new Error('Token manquant ou invalide'));
    }

    return from(
      axios.get(`${this.apiUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: page,
          itemsPerPage: itemsPerPage
        }
      })
    ).pipe(
      map(response => response.data),
      catchError(error => {
        if (error.response && error.response.status === 401) {
          this.router.navigate(['/login']);
        }
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        return throwError(() => new Error('Erreur lors de la récupération des utilisateurs'));
      })
    );
  }
  /**
   * Route des utilisateur ayant participer au concours
   */
  /**
   * Route des utilisateurs ayant participé au concours
   */
  getUserGame(): Observable<any[]> { 
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Token manquant ou invalide');
      this.router.navigate(['/login']);
      return throwError(() => new Error('Token manquant ou invalide'));
    }
  
    const headers = {
      Authorization: `Bearer ${token}`
    };
  
    return from(
      axios.get(`${this.apiUrl}/contest/participants`, { headers })
    ).pipe(
      map(response => {
        // Map to extract the required fields
        return response.data.map((participant: any) => ({
          id: participant.id,
          name: participant.name,
          tickets: participant.tickets,
          firstname: participant.firstname
        }));
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des participants au concours:', error);
        return throwError(() => new Error('Erreur lors de la récupération des participants au concours'));
      })
    );
  }
  

  /**
   * Récupérer le nombre total d'utilisateurs depuis l'API
   */
  getTotalUsersCount(): Observable<number> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token manquant ou invalide');
      return throwError(() => new Error('Token manquant ou invalide'));
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    return from(
      axios.get(`${this.apiUrl}/users`, { headers })
    ).pipe(
      map(response => response.data['hydra:totalItems']),
      catchError(error => {
        console.error('Erreur lors de la récupération du nombre total d\'utilisateurs:', error);
        return throwError(() => new Error('Erreur lors de la récupération du nombre total d\'utilisateurs'));
      })
    );
  }
}
