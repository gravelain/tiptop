import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProfiladminComponent } from './profiladmin.component';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ProfiladminComponent', () => {
  let component: ProfiladminComponent;
  let fixture: ComponentFixture<ProfiladminComponent>;
  let userServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', ['getUserProfile', 'updateUser']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ProfiladminComponent],
      imports: [FormsModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfiladminComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user data on init when logged in', fakeAsync(() => {
    const mockUser = {
      firstName: 'John',
      name: 'Doe',
      email: 'john@example.com',
      phone: '123456789',
      Rle: 'A'
    };
    userServiceMock.getUserProfile.and.returnValue(of(mockUser));

    fixture.detectChanges(); // Initial change detection
    tick(); // Simuler le délai d'attente pour l'initialisation

    expect(component.user).toEqual(mockUser);
    expect(component.user.Rle).toBe('Admin');
  }));

  it('should render user profile form with correct values', fakeAsync(() => {
    const mockUser = {
      firstName: 'John',
      name: 'Doe',
      email: 'john@example.com',
      phone: '123456789',
      Rle: 'A'
    };
    userServiceMock.getUserProfile.and.returnValue(of(mockUser));

    fixture.detectChanges(); // Initial change detection
    tick(); // Simuler l'attente

    // Re-déclencher la détection des changements
    fixture.detectChanges();

    // Get input elements by name and verify their values
    const firstNameInput = fixture.debugElement.query(By.css('input[name="firstName"]')).nativeElement;
    const nameInput = fixture.debugElement.query(By.css('input[name="name"]')).nativeElement;
    const emailInput = fixture.debugElement.query(By.css('input[name="email"]')).nativeElement;
    const phoneInput = fixture.debugElement.query(By.css('input[name="phone"]')).nativeElement;
    const roleInput = fixture.debugElement.query(By.css('input[name="Rle"]')).nativeElement;

    expect(firstNameInput.value).toBe('John');
    expect(nameInput.value).toBe('Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(phoneInput.value).toBe('123456789');
    expect(roleInput.value).toBe('Admin');
  }));
});
