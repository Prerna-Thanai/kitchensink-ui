import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { RegisterMemberDto } from '../models/member.model';
import { AuthService } from '../services/auth.service';
import { catchError, map, Observable, of, timer } from 'rxjs';
import { Router } from '@angular/router';
import { PhoneNumberUtil } from 'google-libphonenumber';

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

  private phoneUtil = PhoneNumberUtil.getInstance();

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  this.registerForm = this.fb.group(
    {
      name: ['', [Validators.required, this.fullNameValidator]],
      email: ['', [Validators.required, this.stringEmailValidator]],
      phone: ['', 
  [Validators.required, 
  this.validPhoneWithLib.bind(this)]
],
      password: ['', [Validators.required, Validators.minLength(6), this.strongPasswordValidator]],
      confirmPassword: ['', Validators.required]
    },
    {
      validators: this.passwordMatchValidator
    }
  );
}

  fullNameValidator(control: AbstractControl): ValidationErrors | null {
  const name = control.value;
  if (!name) return null;

  // Match only letters (a-z, A-Z) and spaces
  const nameRegex = /^[A-Za-z\s]+$/;

  return nameRegex.test(name) ? null : { invalidFullName: true };
}

    validPhoneWithLib(control: AbstractControl): ValidationErrors | null {
    const phone = control.value;
    if (!phone) return null;

    try {
      const parsed = this.phoneUtil.parse(phone, 'IN');
      const isValid = this.phoneUtil.isValidNumberForRegion(parsed, 'IN');
      return isValid ? null : { invalidPhone: true };
    } catch (e) {
      return { invalidPhone: true };
    }
  }
  
  validatePhoneAsync(): AsyncValidatorFn {
    return (_control: AbstractControl): Observable<ValidationErrors | null> => {
    return of(null); // always valid
  };

  //Note disabled currently, but it is working
  // return (control: AbstractControl): Observable<ValidationErrors | null> => {
  //   if (!control.value) {
  //     return of(null); // skip validation if empty
  //   }

  //   return this.authService.validatePhone(control.value).pipe(
  //     map((response: any) => {
  //       return response.valid ? null : { invalidPhone: true };
  //     }),
  //     catchError(() => of({ invalidPhone: true })) // API/network failure = invalid
  //   );
  // };
}

  strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/;

  return pattern.test(value)
    ? null
    : { weakPassword: true };
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

  stringEmailValidator(control: AbstractControl): ValidationErrors | null {
  const email = control.value;
  if (!email) return null;

  // Robust regex for RFC 5322-compliant email addresses
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(email) ? null : { invalidEmailFormat: true };
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
