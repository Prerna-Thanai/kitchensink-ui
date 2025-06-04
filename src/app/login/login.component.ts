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


ngOnInit(): void {
  history.replaceState({}, document.title);
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

        this.router.navigate(['/dashboard']); 
      },
      error: (err) => {
        console.error('Login failed', err);
        this.loginError = err.error?.message || 'Invalid credentials';
      }
    });
  }
}