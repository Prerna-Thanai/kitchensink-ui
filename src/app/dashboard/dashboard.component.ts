import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Member } from '../models/member.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isOpen = true;
userData: Member | null = null;
loading:boolean = false;

  constructor(private userService: UserService) {}

ngOnInit(): void {

  this.loading = true;
    this.userService.getUser().subscribe({
      next: (res: Member) => {
        this.loading = false;
        this.userData = res;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching user data:', err);
        this.userData = null;
      }
    });
  }
}