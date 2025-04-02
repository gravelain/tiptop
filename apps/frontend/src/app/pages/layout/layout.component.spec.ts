import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Importer CUSTOM_ELEMENTS_SCHEMA

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Ajouter CUSTOM_ELEMENTS_SCHEMA ici
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
