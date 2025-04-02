import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutadminComponent } from './layoutadmin.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Ajouté pour gérer <app-sidebar> et <router-outlet>

describe('LayoutadminComponent', () => {
  let component: LayoutadminComponent;
  let fixture: ComponentFixture<LayoutadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutadminComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Ajouté pour éviter les erreurs sur <app-sidebar> et <router-outlet>
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a sidebar component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-sidebar')).not.toBeNull();
  });

  it('should have a router-outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });
});
