import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RegisterMemberDto } from '../models/member.model';
import { AuthService } from '../services/auth.service';
import { timer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  emailTaken = false;
  registerSuccess = false;
  serverError = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, this.validIndianPhone]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  validIndianPhone(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!value) return null;
    return phoneRegex.test(value) ? null : { invalidPhone: true };
  }

  passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onRegister(): void {
  this.emailTaken = false;
  this.serverError = '';
  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }

  const formData = this.registerForm.value;
  const registerRequest: RegisterMemberDto = {
    name: formData.name.trim(),
    email: formData.email.trim(),
    phoneNumber: formData.phone.trim(),
    password: formData.password,
    roles: ["USER"]
  };

  this.authService.register(registerRequest).subscribe({
    next: () => {
      this.registerSuccess = true;
      this.emailTaken = false;
      this.serverError = '';
      this.registerForm.reset();
      // Redirect after 2 seconds
      timer(2000).subscribe(() => this.router.navigate(['/login']));
    },
    error: (err) => {
      this.registerSuccess = false;
      if (err.error?.email) {
        this.emailTaken = true;
      } else {
        this.serverError = err.error?.message || 'Something went wrong';
      }
      console.error('Registration failed:', err.error);
    }
  });
}
}
