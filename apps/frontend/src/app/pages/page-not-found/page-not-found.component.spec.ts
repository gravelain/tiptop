import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageNotFoundComponent } from './page-not-found.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Ajouté pour les composants personnalisés comme <app-header> et <app-footer>

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageNotFoundComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Ajouté pour éviter les erreurs avec <app-header> et <app-footer>
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 404 message in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('404');
  });

  it('should display "Oups! Page non trouvée" message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain('Oups! Page non trouvée');
  });

  it('should display the return link with correct href', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a');
    expect(link?.getAttribute('href')).toBe('/');
    expect(link?.textContent).toContain("Retour à l'accueil");
  });
});
