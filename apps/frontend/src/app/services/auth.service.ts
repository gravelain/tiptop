import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import axios from 'axios';
import { Observable, of, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from './token.service';
import { BASE_URL } from '../../utils/config';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = BASE_URL;
  private currentUserRole: string | null = null; // Propriété pour stocker le rôle utilisateur
  constructor(
    private tokenService: TokenService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  login(email: string, password: string): Promise<any> {
    return axios.post(`${this.apiUrl}/login`, { Email: email, password: password }, { headers: { 'Content-Type': 'application/json' } })
      .then((response: any) => {
        let data: any = response.data;
        if (data) {
          const token = data.token;
          if (token) {
            this.tokenService.setToken(token);
            this.router.navigate(['/user-history']);
          }

          return Promise.resolve(data);
        }

        return Promise.reject(new Error('Erreur inattendue'));
      })
      .catch((error) => {
        console.error('Erreur lors de la connexion:', error);
        return Promise.reject(error);
      });
  }


  register(firstName: string, name: string, email: string, password: string, Rle: string = 'U'): Observable<any> {
    return from(
      axios.post(`${this.apiUrl}/register`, { 
        firstName, 
        name, 
        email, 
        password,
        Rle
      })
    ).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Erreur lors de l\'inscription:', error);
        
        // Si l'erreur provient de la réponse du serveur (comme une erreur 400)
        if (error.response && error.response.data && error.response.data.message) {
          // Renvoyer l'erreur avec le message du serveur
          return throwError(() => new Error(error.response.data.message));
        }
        
        // Renvoyer une erreur générique si aucune réponse spécifique n'est trouvée
        return throwError(() => new Error('Une erreur inattendue s\'est produite.'));
      })
    );
  }


  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/home']);
  }

  getUserProfile(): Observable<any | null> {
    const token = this.tokenService.getToken();
    if (!token) return of(null);

    return from(
      axios.get(`${this.apiUrl}/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    ).pipe(
      map(response => {
        const userData = response.data;
        this.currentUserRole = userData.Rle; // Stocker le rôle utilisateur
        return userData;
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération du profil utilisateur:', error);
        return of(null);
      })
    );
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  // Obtenir le rôle actuel de l'utilisateur à partir du token JWT
  getCurrentUserRole(): string | null {
    return this.currentUserRole; // Retourner le rôle stocké
  }
  
  

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    const token = this.tokenService.getToken();
    return !!token; // Retourne true si le token existe, sinon false
  }
}