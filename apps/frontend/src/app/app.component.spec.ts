import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let mockRouter: Router;
  let mockActivatedRoute: ActivatedRoute;
  let mockTitleService: Title;
  let mockMetaService: Meta;

  beforeEach(async () => {
    // Mock du Router avec des événements NavigationEnd
    mockRouter = {
      events: of(new NavigationEnd(0, '/test', '/test'))
    } as any;

    // Mock de l'ActivatedRoute avec des données de test
    mockActivatedRoute = {
      firstChild: {
        snapshot: {
          data: {
            title: 'Test Page',
            description: 'Test Description'
          }
        },
        firstChild: null
      }
    } as any;

    // Mock des services Title et Meta
    mockTitleService = jasmine.createSpyObj('Title', ['setTitle']);
    mockMetaService = jasmine.createSpyObj('Meta', ['updateTag']);

    await TestBed.configureTestingModule({
      imports: [AppComponent], // Utilisation de `imports` au lieu de `declarations`
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Title, useValue: mockTitleService },
        { provide: Meta, useValue: mockMetaService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });  
  

  it('should update the page title and meta tags on navigation', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    tick(); // Simuler le passage du temps pour déclencher la souscription au router events

    // Vérifier que le titre de la page a été mis à jour
    expect(mockTitleService.setTitle).toHaveBeenCalledWith('Test Page');

    // Vérifier que la balise meta description a été mise à jour
    expect(mockMetaService.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: 'Test Description'
    });
  }));

});
