import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';  // Importer RouterTestingModule

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule]  // Importer RouterTestingModule pour gérer routerLink
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize reviews and pagination', () => {
    expect(component.reviews.length).toBeGreaterThan(0);
    expect(component.pages.length).toBeGreaterThan(0);
    expect(component.visibleReviews.length).toBe(component.reviewsPerPage);
  });

  it('should correctly set the current page and display reviews', () => {
    component.setCurrentPage(2);
    expect(component.currentPage).toBe(2);
    const startIndex = (2 - 1) * component.reviewsPerPage;
    const expectedVisibleReviews = component.reviews.slice(startIndex, startIndex + component.reviewsPerPage);
    expect(component.visibleReviews).toEqual(expectedVisibleReviews);
  });

  it('should return true if running in a browser environment', () => {
    expect(component['isBrowser']()).toBeTrue();
  });



  it('should correctly handle window resize events', fakeAsync(() => {
    spyOn(component as any, 'checkScreenSize').and.callThrough();
    window.dispatchEvent(new Event('resize'));
    tick(100);
    expect((component as any).checkScreenSize).toHaveBeenCalled();
  }));

  it('should check if it is not mobile when the screen width is greater than or equal to 768', () => {
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(1024);
    (component as any).checkScreenSize();
    expect(component.isMobile).toBeFalse();
  });

  it('should check if it is mobile when the screen width is less than 768', () => {
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(600);
    (component as any).checkScreenSize();
    expect(component.isMobile).toBeTrue();
  });
});
