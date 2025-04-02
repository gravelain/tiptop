import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TombolatComponent } from './tombolat.component';

describe('TombolatComponent', () => {
  let component: TombolatComponent;
  let fixture: ComponentFixture<TombolatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TombolatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TombolatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
