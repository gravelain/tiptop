import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';  // Ajouter cet import
import { ContactComponent } from './contact.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import emailjs from '@emailjs/browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let authServiceMock: any;

  beforeEach(async () => {
    // Mock d'AuthService
    authServiceMock = {
      getUserProfile: jasmine.createSpy('getUserProfile').and.returnValue(of({
        firstName: 'John',
        name: 'Doe',
        email: 'john.doe@example.com'
      }))
    };

    await TestBed.configureTestingModule({
      declarations: [ContactComponent],
      imports: [FormsModule], // Ajouter FormsModule ici
      providers: [{ provide: AuthService, useValue: authServiceMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Utiliser CUSTOM_ELEMENTS_SCHEMA si des composants personnalisés sont utilisés
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set user info when logged in', () => {
    component.ngOnInit();
    expect(component.isLoggedIn).toBeTrue();
    expect(component.name).toBe('John Doe');
    expect(component.email).toBe('john.doe@example.com');
  });

  it('should send an email successfully', (done) => {
    spyOn(emailjs, 'sendForm').and.returnValue(Promise.resolve({ status: 200, text: 'OK' }));

    const fakeEvent = { preventDefault: jasmine.createSpy(), target: document.createElement('form') } as any;

    component.sendEmail(fakeEvent);

    setTimeout(() => {
      expect(component.confirmationMessage).toBe('Votre message a été envoyé avec succès !');
      expect(component.name).toBe('');
      expect(component.email).toBe('');
      expect(component.message).toBe('');
      done();
    }, 500);
  });

  it('should handle email sending failure', (done) => {
    spyOn(emailjs, 'sendForm').and.returnValue(Promise.reject('Error'));

    const fakeEvent = { preventDefault: jasmine.createSpy(), target: document.createElement('form') } as any;

    component.sendEmail(fakeEvent);

    setTimeout(() => {
      expect(component.confirmationMessage).toBe("Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer plus tard.");
      done();
    }, 500);
  });
});
