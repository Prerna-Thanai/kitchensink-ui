import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false, 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'kitchensink-ui';

  constructor(private authService: AuthService) {}

ngOnInit() {
  this.authService.initAuthState();
}
}
