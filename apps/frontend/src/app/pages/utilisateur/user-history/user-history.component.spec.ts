import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserHistoryComponent } from './user-history.component';
import { Router } from '@angular/router';
import axios from 'axios';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as XLSX from 'xlsx'; // Import de XLSX
import QRCode from 'qrcode'; // Import de QRCode
import { jsPDF } from 'jspdf'; // Import correct de jsPDF
import { saveAs } from 'file-saver'; // Import correct de file-saver

describe('UserHistoryComponent', () => {
  let component: UserHistoryComponent;
  let fixture: ComponentFixture<UserHistoryComponent>;
  let mockRouter: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [UserHistoryComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UserHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user lots on init', async () => {
    const mockResponse = { data: [{ code: '1234', prize_name: 'Lot A', prize_value: 100 }] };
    spyOn(axios, 'get').and.returnValue(Promise.resolve(mockResponse));
    spyOn(localStorage, 'getItem').and.returnValue('mock-token');

    await component.ngOnInit();

    expect(axios.get).toHaveBeenCalledWith(`${component['apiUrl']}/user/lot`, {
      headers: {
        Authorization: 'Bearer mock-token'
      }
    });
    expect(component.lots.length).toBe(1);
    expect(component.lots[0].code).toBe('1234');
  });

  it('should redirect to login if no token is found', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should filter tickets based on search term', () => {
    component.lots = [
      { code: '1234', prize_name: 'Lot A' },
      { code: '5678', prize_name: 'Lot B' }
    ];
    component.searchTerm = 'Lot A';

    const filtered = component.filteredTickets();

    expect(filtered.length).toBe(1);
    expect(filtered[0].prize_name).toBe('Lot A');
  });

  it('should download a ticket as a text file', () => {
    const mockTicket = { code: '1234', prize_name: 'Lot A', prize_value: 100 };
    const saveAsSpy = spyOn(saveAs, 'saveAs').and.callThrough();

    component.downloadTicket(mockTicket);

    expect(saveAsSpy).toHaveBeenCalled();
  });
      

  it('should download tickets as Excel file', () => {
    spyOn(XLSX.utils, 'json_to_sheet').and.callThrough();
    const saveAsSpy = spyOn<any>(component, 'saveAsExcelFile').and.callThrough(); // Correction du type ici

    component.lots = [{ code: '1234', prize_name: 'Lot A', prize_value: 100 }];
    component.downloadTicketsAsExcel();

    expect(saveAsSpy).toHaveBeenCalled();
  });
});
