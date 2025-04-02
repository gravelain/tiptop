import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LotComponent } from './lot.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // Ajout de 'of' pour simuler les observables

describe('LotComponent', () => {
  let component: LotComponent;
  let fixture: ComponentFixture<LotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LotComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ id: 'gourmand' }) // Simulation des queryParams
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expand the correct lot based on queryParams', () => {
    const expandedLot = component.lots.find(lot => lot.id === 'gourmand');
    expect(expandedLot?.isExpanded).toBeTrue();
  });

  it('should toggle details when toggleDetails is called', () => {
    const lot = component.lots[0];
    expect(lot.isExpanded).toBeFalse(); // Initialement fermé
    component.toggleDetails(lot);
    expect(lot.isExpanded).toBeTrue(); // Doit être ouvert après appel
    component.toggleDetails(lot);
    expect(lot.isExpanded).toBeFalse(); // Doit être fermé après deuxième appel
  });
});
