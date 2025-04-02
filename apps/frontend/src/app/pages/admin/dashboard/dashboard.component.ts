import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../../services/ticket.service';
import { LotService } from '../../../services/lot.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  ticketsCount: number = 0;
  lotsCount: number = 0;
  usersCount: number = 0;

  constructor(
    private ticketService: TicketService,
    private lotService: LotService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchTotalTicketsCount();
    this.fetchTotalLotsCount();
    this.fetchTotalUsersCount();
  }

  fetchTotalTicketsCount(): void {
    this.ticketService.getTotalTicketsCount().subscribe(
      (totalTickets: number) => {
        this.ticketsCount = totalTickets;
      },
      error => {
        console.error('Error fetching total tickets count:', error);
      }
    );
  }

  fetchTotalLotsCount(): void {
    this.lotService.getTotalLotsCount().subscribe(
      (totalLots: number) => {
        this.lotsCount = totalLots;
      },
      error => {
        console.error('Error fetching total lots count:', error);
      }
    );
  }

  fetchTotalUsersCount(): void {
    this.userService.getTotalUsersCount().subscribe(
      (totalUsers: number) => {
        this.usersCount = totalUsers;
      },
      error => {
        console.error('Error fetching total users count:', error);
      }
    );
  }
}
