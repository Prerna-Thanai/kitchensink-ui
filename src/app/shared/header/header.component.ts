import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  user: any;
  isAdmin: boolean = false;
  

constructor(private userService: UserService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      this.user = user;
      this.isAdmin = user?.roles?.[0] === 'ADMIN';
    });
  }

  logout(){
    this.authService.logout().subscribe({
    next: () => {
    },
    error: (err) => {
      console.error('Logout failed', err);
    }
  }); 
    
  }
}
