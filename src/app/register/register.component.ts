import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '../app.component';
console.log('AppComponent standalone:', (AppComponent as any).ɵcmp?.standalone);

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

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkEmailExists() {
    const existingEmails = ['test@example.com', 'admin@demo.com'];
    const email = this.registerForm.get('email')?.value;
    this.emailTaken = existingEmails.includes(email);
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    const { password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (this.emailTaken) {
      alert('Email already exists');
      return;
    }

    console.log('Registered user:', this.registerForm.value);
  }
}
