import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/member.model';
import { TokenResponse } from '../models/token.model';

@Component({
  selector: 'app-login',
  standalone: false, 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    const navigation = this.router.getCurrentNavigation();
    this.loginError = navigation?.extras?.state?.['errorMessage'] || null;
  }

  // errorMessage: string | null = null;

ngOnInit(): void {
  history.replaceState({}, document.title);
  // const navigation = this.router.getCurrentNavigation();
  // console.log('Navigation state:', navigation?.extras?.state);
  // this.errorMessage = navigation?.extras?.state?.['errorMessage'] || null;
}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.loginError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

   const formData = this.loginForm.value;
  const loginRequest: LoginRequest = {
    email: formData.email.trim(),
    password: formData.password,
  };

    this.authService.login(loginRequest).subscribe({
    next: (res: TokenResponse) => {
      // Save expiry timestamps
      // const now = Date.now();
      // localStorage.setItem('access_token_expiry_at', (now + res.accessTokenExpiry).toString());
      // localStorage.setItem('refresh_token_expiry_at', (now + res.refreshTokenExpiry).toString());

      // Save token or user info if needed
      console.log('Login successful', res);
        this.router.navigate(['/dashboard']); // Replace with your actual route
      },
      error: (err) => {
        console.error('Login failed', err);
        this.loginError = err.error?.message || 'Invalid credentials';
      }
    });
  }
}