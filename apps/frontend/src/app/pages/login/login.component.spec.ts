import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginComponent } from './login.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register', 'login', 'getUserProfile']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ signup: true }) // Simule l'activation du mode inscription
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch to signup mode when signup query param is present', () => {
    expect(component.isLoginMode).toBeFalse(); // S'assure qu'on est en mode inscription
  });

  it('should toggle form mode', () => {
    component.toggleForm(true);
    expect(component.isLoginMode).toBeTrue(); // Passe en mode login

    component.toggleForm(false);
    expect(component.isLoginMode).toBeFalse(); // Retour en mode inscription
  });

  it('should display error when required fields are missing in signup mode', () => {
    component.isLoginMode = false; // Mode inscription
    component.email = '';
    component.password = '';
    component.onSubmit({ preventDefault: () => {} });
    expect(component.errorMessage).toBe('Veuillez remplir tous les champs obligatoires.');
  });

  it('should validate password correctly', () => {
    expect(component.validatePassword('Password123!')).toBeTrue();
    expect(component.validatePassword('password')).toBeFalse();
  });

  // Test pour l'inscription d'un nouvel utilisateur
  it('should register a new user successfully', fakeAsync(() => {
    const mockResponse = { message: 'Utilisateur enregistrer avec succes' };
    authService.register.and.returnValue(of(mockResponse));
    spyOn(component, 'toggleForm');

    component.isLoginMode = false; // Mode inscription
    component.email = 'test@test.com';
    component.password = 'Password123!';
    component.firstName = 'John';
    component.name = 'Doe';
    component.confirmPassword = 'Password123!';
    component.onSubmit({ preventDefault: () => {} });

    tick(3000); // Simule le délai de 3 secondes pour la redirection

    expect(component.successMessage).toBe('Inscription réussie ! Vous allez être redirigé vers la page de connexion.');
    expect(component.errorMessage).toBe('');
    expect(component.toggleForm).toHaveBeenCalledWith(true); // Doit appeler toggleForm pour passer en mode connexion
  }));

  // Test pour la gestion de l'erreur d'inscription (par exemple, utilisateur déjà existant)
  it('should handle registration error from server', () => {
    const mockError = { message: 'Cet utilisateur existe déjà' };
    authService.register.and.returnValue(throwError(mockError));

    component.isLoginMode = false; // Mode inscription
    component.email = 'existing@test.com';
    component.password = 'Password123!';
    component.firstName = 'John';
    component.name = 'Doe';
    component.confirmPassword = 'Password123!';
    component.onSubmit({ preventDefault: () => {} });

    expect(component.errorMessage).toBe(mockError.message);
    expect(component.successMessage).toBe('');
  });

  // Test pour la connexion réussie
  it('should handle login successfully', fakeAsync(() => {
    const mockLoginResponse = { token: 'mockToken' };
    const mockUserProfile = { Rle: 'U' }; // Rôle utilisateur standard
    
    authService.login.and.returnValue(Promise.resolve(mockLoginResponse));
    authService.getUserProfile.and.returnValue(of(mockUserProfile));
  
    spyOn(router, 'navigate');
  
    component.isLoginMode = true; // Mode connexion
    component.email = 'test@test.com';
    component.password = 'Password123!';
    component.onSubmit({ preventDefault: () => {} });
  
    tick(1000); // Simule le délai de connexion
    
    expect(router.navigate).toHaveBeenCalledWith(['/user-history']); // Doit rediriger l'utilisateur
  }));

  // Test pour la gestion de l'échec de connexion (mauvais mot de passe, par exemple)
  it('should handle login failure', (done: DoneFn) => {
    authService.login.and.returnValue(Promise.reject({ response: { status: 401 } }));

    component.isLoginMode = true; // Mode connexion
    component.email = 'test@test.com';
    component.password = 'wrongpassword';
    component.onSubmit({ preventDefault: () => {} });

    setTimeout(() => {
      expect(component.errorMessage).toBe('Échec de la connexion. Les informations fournies sont incorrectes.');
      done();
    }, 1000);
  });
});
