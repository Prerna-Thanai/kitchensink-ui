import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  user: any;
  isAdmin: boolean = false;

constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      this.user = user;
      this.isAdmin = user?.roles?.[0] === 'ADMIN';
    });
  }

  logout(){
    
  }
}
