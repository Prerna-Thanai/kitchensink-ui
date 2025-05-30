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

  constructor(private userService: UserService) {}

ngOnInit(): void {

    this.userService.getUser().subscribe({
      next: (res: Member) => {
        this.userData = res;
      },
      error: (err) => {
      }
    });
  }
}