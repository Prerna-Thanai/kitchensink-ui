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
  this.userData =  {
    "name": 'Prerna',
    "id": '2e23',
    "email": 'prern@gmail.com',
    "phoneNumber": '9992233111',
    "roles": ['ADMIN'],
    createdAt: ""
  };
    // this.userService.getUser().subscribe({
    //   next: (res: Member) => {
        // this.userData = { ...res, name: 'Prerna' }; // overwrite name safely
    //   },
    //   error: (err) => {
    //     console.error('Failed to load user data:', err);
    //   }
    // });
  }
}