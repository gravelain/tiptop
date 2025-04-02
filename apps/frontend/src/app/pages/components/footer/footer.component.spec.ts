import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { FormsModule } from '@angular/forms'; 
import { ViewportScroller } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import axios from 'axios';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let routerMock: any;
  let viewportScrollerMock: any;

  beforeEach(async () => {
    routerMock = {
      events: of(new NavigationEnd(0, '', '')) 
    };

    viewportScrollerMock = {
      scrollToAnchor: jasmine.createSpy('scrollToAnchor')
    };

    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: ViewportScroller, useValue: viewportScrollerMock },
        { provide: Router, useValue: routerMock },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should scroll to section', () => {
    component.scrollToSection('home');
    expect(viewportScrollerMock.scrollToAnchor).toHaveBeenCalledWith('home');
    expect(component.currentSection).toBe('home');
  });

  it('should validate email correctly', () => {
    expect(component.isValidEmail('test@example.com')).toBeTrue();
    expect(component.isValidEmail('invalid-email')).toBeFalse();
  });

  it('should not subscribe with invalid email', () => {
    component.email = 'invalid-email';
    spyOn(component, 'showNotificationMessage');
    component.subscribeToNewsletter();
    expect(component.showNotificationMessage).toHaveBeenCalledWith('Veuillez entrer une adresse e-mail valide.', 'error');
  });


  it('should hide notification after 5 seconds', fakeAsync(() => {
    component.showNotificationMessage('Test Message', 'success');
    expect(component.showNotification).toBeTrue();
  
    tick(5000); // Simule le passage de 5 secondes
  
    expect(component.showNotification).toBeFalse();
  }));
});
