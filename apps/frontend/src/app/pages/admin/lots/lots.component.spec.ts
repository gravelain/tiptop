import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LotsComponent } from './lots.component';
import { LotService } from '../../../services/lot.service';
import { of, throwError } from 'rxjs';

describe('LotsComponent', () => {
  let component: LotsComponent;
  let fixture: ComponentFixture<LotsComponent>;
  let mockLotService: jasmine.SpyObj<LotService>;

  const mockLots = [
    { name: 'Lot 1', value: 100, Pourcentage: 50 },
    { name: 'Lot 2', value: 200, Pourcentage: 30 },
    { name: 'Lot 3', value: 300, Pourcentage: 20 }
  ];

  beforeEach(async () => {
    // Création d'un LotService simulé
    const lotServiceSpy = jasmine.createSpyObj('LotService', ['getLots']);

    await TestBed.configureTestingModule({
      declarations: [LotsComponent],
      providers: [
        { provide: LotService, useValue: lotServiceSpy } // Utilisation du service simulé
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LotsComponent);
    component = fixture.componentInstance;
    mockLotService = TestBed.inject(LotService) as jasmine.SpyObj<LotService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load lots on init', () => {
    mockLotService.getLots.and.returnValue(of(mockLots)); // Simulation d'une réponse réussie

    component.ngOnInit();

    expect(component.lots.length).toBe(3);
    expect(component.lots).toEqual(mockLots);
    expect(mockLotService.getLots).toHaveBeenCalled();
  });

  it('should handle error when loading lots', () => {
    const consoleSpy = spyOn(console, 'error'); // Espionner console.error
    mockLotService.getLots.and.returnValue(throwError('Erreur de chargement')); // Simulation d'une erreur

    component.ngOnInit();

    expect(consoleSpy).toHaveBeenCalledWith('Erreur lors du chargement des lots :', 'Erreur de chargement');
  });

  it('should filter lots based on search term', () => {
    component.lots = mockLots;
    component.searchTerm = 'Lot 2';

    const filtered = component.filteredLots();

    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Lot 2');
  });

  it('should calculate pagination correctly', () => {
    component.lots = Array.from({ length: 25 }, (_, i) => ({ name: `Lot ${i + 1}`, value: i * 10, Pourcentage: i }));
    component.itemsPerPage = 10;
    component.currentPage = 1;

    component.calculatePagination();

    expect(component.pages.length).toBeGreaterThan(0); // Il devrait y avoir des pages calculées
  });

  it('should go to a specific page', () => {
    component.goToPage(2);
    expect(component.currentPage).toBe(2);
  });

  it('should print lot details', () => {
    const lot = { name: 'Lot 1', value: 100, Pourcentage: 50 };
  
    const printWindowMock = {
      document: {
        write: jasmine.createSpy('write'),
        close: jasmine.createSpy('close')
      },
      print: jasmine.createSpy('print')
    };
  
    const openSpy = spyOn(window, 'open').and.returnValue(printWindowMock as any);
  
    component.printLot(lot);
  
    expect(openSpy).toHaveBeenCalled();
    expect(printWindowMock.document.write).toHaveBeenCalled();
    expect(printWindowMock.print).toHaveBeenCalled();
  });
  
  
});
