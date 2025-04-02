import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoginMode = true;
  email = '';
  password = '';
  confirmPassword = '';
  name = '';
  firstName = '';
  Rle = 'U';  // Initialiser avec 'U'
  errorMessage = '';
  successMessage = '';  // Nouveau champ pour le message de succès

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['signup']) {
        this.isLoginMode = false;
      }
    });
  }

  toggleForm(isLoginMode: boolean) {
    this.isLoginMode = isLoginMode;
    this.errorMessage = ''; // Réinitialiser les messages lors du changement de formulaire
    this.successMessage = '';
    

    this.isLoginMode = isLoginMode;
    this.errorMessage = ''; // Réinitialiser les messages lors du changement de formulaire
    this.successMessage = '';
    
    // Réinitialiser les champs du formulaire
    this.email = '';
    this.password = '';
    this.name = '';
    this.firstName = '';
  }

  validatePassword(password: string): boolean {
    const passwordPattern = /^(?!.*\d{8})^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordPattern.test(password);
  }

  onSubmit(e: any) {
    e.preventDefault();

    // Valider les champs obligatoires
    if (!this.email || !this.password || (!this.isLoginMode && !this.firstName)) {
        this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
        return;
    }

    // Forcer la valeur de Rle
    this.Rle = this.Rle || 'U';

    // Valider le mot de passe en mode inscription
    if (!this.isLoginMode) {
        if (!this.validatePassword(this.password)) {
            this.errorMessage = 'Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule, un chiffre, et un caractère spécial, et ne doit pas commencer par un chiffre.';
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.errorMessage = 'Les mots de passe ne correspondent pas.';
            return;
        }

        // Tentative d'inscription                   
        this.authService.register(this.firstName, this.name, this.email, this.password, this.Rle).subscribe(
            response => {
                console.log('Response from server:', response);
                if (response && response.message) {
                    const cleanedMessage = response.message.trim().replace(/\s+/g, ' ');
                    if (cleanedMessage.includes('Utilisateur enregistrer avec succes')) {
                        this.errorMessage = ''; // Réinitialiser l'erreur s'il y a un succès
                        this.successMessage = 'Inscription réussie ! Vous allez être redirigé vers la page de connexion.';
        
                        // Rediriger vers la page de connexion après 3 secondes
                        setTimeout(() => {
                            this.toggleForm(true); 
                        }, 3000);
                    } else {
                        this.errorMessage = 'Une erreur inattendue s\'est produite lors de l\'inscription.';
                    }
                } else {
                    this.errorMessage = 'Réponse inattendue du serveur.';
                }
            },
            error => {
                console.error('Register error:', error);
        
                // Afficher l'erreur renvoyée par le backend sur l'interface
                this.successMessage = ''; // Réinitialiser le message de succès s'il y a une erreur
                this.errorMessage = error.message || 'Une erreur inattendue s\'est produite.';
            }
        );
                            
    } else {
        // Traitement du login
        this.authService.login(this.email, this.password)
        .then((response: any) => {
                if (response && response.token) {
                    const token = response.token;
                    localStorage.setItem("token", token);

                    // Récupérer le profil de l'utilisateur après la connexion
                    this.authService.getUserProfile().subscribe(
                        user => {
                            const role = user.Rle;

                            // Redirection en fonction du rôle
                            switch (role) {
                                case 'A':
                                    this.router.navigate(['/admin/dashboard']);
                                    break;
                                case 'C':
                                    this.router.navigate(['/admin/tickets']);
                                    break;
                                case 'U':
                                    this.router.navigate(['/user-history']);
                                    break;
                                default:
                                    console.error('Rôle utilisateur non reconnu:', role);
                                    this.errorMessage = 'Rôle utilisateur non reconnu.';
                                    break;
                            }
                        },
                        error => {
                            console.error('Erreur lors de la récupération des informations utilisateur:', error);
                            this.errorMessage = 'Une erreur est survenue lors de la récupération de votre profil.';
                        }
                    );
                } else {
                    this.errorMessage = "Connexion échouée : les informations fournies sont incorrectes.";
                }
            })
            .catch((error: any) => {
                console.error('Login error:', error);
                if (error.response && error.response.status === 401) {
                    this.errorMessage = 'Échec de la connexion. Les informations fournies sont incorrectes.';
                } else {
                    this.errorMessage = 'Échec de la connexion. Veuillez vérifier vos informations.';
                }
            }
        );
    }
  }
}
