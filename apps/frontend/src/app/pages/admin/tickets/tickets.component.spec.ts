import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketsComponent } from './tickets.component';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { of } from 'rxjs';
import { TicketService } from '../../../services/ticket.service'; // Mock service
import { AuthService } from '../../../services/auth.service'; // Mock service

describe('TicketsComponent', () => {
  let component: TicketsComponent;
  let fixture: ComponentFixture<TicketsComponent>;
  let ticketServiceMock: any;
  let authServiceMock: any;

  beforeEach(async () => {
    // Mock de TicketService
    ticketServiceMock = {
      getTickets: jasmine.createSpy('getTickets').and.returnValue(of({
        tickets: [
          { code: 'T123', lot: { id: 1, name: 'Lot 1', value: 100, percentage: 10 }, is_claimed: false, user: { firstName: 'John', phone: '123456789' } }
        ],
        totalItems: 1
      })),
      validateTicket: jasmine.createSpy('validateTicket').and.returnValue(of({}))
    };

    // Mock de AuthService
    authServiceMock = {
      getUserProfile: jasmine.createSpy('getUserProfile').and.returnValue(of({ Rle: 'C' }))
    };

    // Configuration du module de test
    await TestBed.configureTestingModule({
      declarations: [TicketsComponent],
      imports: [FormsModule],  // Ajout de FormsModule
      providers: [
        { provide: TicketService, useValue: ticketServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    // Création du composant et initialisation
    fixture = TestBed.createComponent(TicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tickets on init', () => {
    expect(ticketServiceMock.getTickets).toHaveBeenCalledWith(component.currentPage, component.itemsPerPage, '');
    expect(component.tickets.length).toBe(1);
  });

  it('should apply search and load tickets', () => {
    component.searchTerm = 'T123';
    component.applySearch();
    expect(ticketServiceMock.getTickets).toHaveBeenCalledWith(component.currentPage, component.itemsPerPage, 'T123');
  });

  it('should paginate tickets', () => {
    component.totalItems = 100;
    component.itemsPerPage = 10;
    component.calculatePagination();
    expect(component.pages.length).toBeGreaterThan(0);
  });

  it('should handle ticket validation', () => {
    const ticket = component.tickets[0];
    ticket.selected = true;
    component.validateSelectedTickets();
    expect(ticketServiceMock.validateTicket).toHaveBeenCalledWith('T123');
    expect(ticket.is_claimed).toBeTrue();
  });


  it('should print ticket', () => {
    const ticket = component.tickets[0];
    
    const mockWindow = {
      document: {
        write: jasmine.createSpy('write'),
        close: jasmine.createSpy('close')
      },
      print: jasmine.createSpy('print')
    } as unknown as Window;
  
    // Simulation de l'appel à window.open
    spyOn(window, 'open').and.returnValue(mockWindow);
  
    // Appel de la fonction à tester
    component.printTicket(ticket);
  
    // Vérification que window.open a bien été appelé
    expect(window.open).toHaveBeenCalled();
    
    // Vérification que window.open() n'est pas null avant de vérifier document.write
    if (mockWindow && mockWindow.document) {
      expect(mockWindow.document.write).toHaveBeenCalled();
    }
  });
  

  
});
