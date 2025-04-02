import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilComponent } from './profil.component';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProfilComponent', () => {
  let component: ProfilComponent;
  let fixture: ComponentFixture<ProfilComponent>;
  let mockAuthService: any;
  let mockUserService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      getUserProfile: jasmine.createSpy('getUserProfile').and.returnValue(of({
        firstName: 'John',
        name: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        id: 1
      }))
    };

    mockUserService = {
      updateUser: jasmine.createSpy('updateUser').and.returnValue(of({}))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [ProfilComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA] // To avoid the "unknown element" errors
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load user profile on init', () => {
    expect(mockAuthService.getUserProfile).toHaveBeenCalled();
    expect(component.firstName).toBe('John');
    expect(component.name).toBe('Doe');
    expect(component.email).toBe('john.doe@example.com');
    expect(component.phone).toBe('123456789');
    expect(component.userId).toBe(1);
    expect(component.isLoading).toBe(false);
  });

  it('should redirect to login if no user is returned', () => {
    mockAuthService.getUserProfile.and.returnValue(of(null));
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should update user profile and emit profileUpdated event', () => {
    spyOn(component.profileUpdated, 'emit');
    
    component.firstName = 'Jane';
    component.name = 'Doe';
    component.email = 'jane.doe@example.com';
    component.phone = '987654321';

    component.onUpdate();

    expect(mockUserService.updateUser).toHaveBeenCalledWith({
      firstName: 'Jane',
      name: 'Doe',
      email: 'jane.doe@example.com',
      phone: '987654321'
    });
    expect(component.updateSuccessMessage).toBe(true);
    expect(component.profileUpdated.emit).toHaveBeenCalledWith({
      firstName: 'Jane',
      name: 'Doe',
      email: 'jane.doe@example.com',
      phone: '987654321'
    });

    // Simulate timeout for success message
    jasmine.clock().install();
    component.onUpdate();
    jasmine.clock().tick(3000);
    expect(component.updateSuccessMessage).toBe(false);
    jasmine.clock().uninstall();
  });

  it('should handle error when updating user profile', () => {
    mockUserService.updateUser.and.returnValue(throwError('Error occurred'));
    spyOn(console, 'error');
    
    component.onUpdate();
    
    expect(console.error).toHaveBeenCalledWith('Une erreur est survenue lors de la mise à jour du profil', 'Error occurred');
  });
});
