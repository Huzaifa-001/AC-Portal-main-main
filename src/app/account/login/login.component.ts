import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage';

import { AccountService } from '../../core/services/account.service';
import { Subscription } from 'rxjs';
import { LoginDto, RegisterDto, UserDTO } from 'src/app/core/interfaces';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'src/app/core/app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  rememberMe: boolean = false
  userLoginForm!: FormGroup;
  showPassword: boolean = false;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private authService: AccountService,
    private router: Router,
  ) { }
  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['./dashboard']);
    }

    this.userLoginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  // Declare a subscription property
  private subscription: Subscription;

  login() {
    const data: LoginDto = {
      userName: this.userLoginForm.value.userName,
      password: this.userLoginForm.value.password,
    };
    this.subscription = this.authService.login(data).subscribe({
      next: (response) => {
        var user = response.payload as UserDTO;
        this.authService.setUser(user,this.rememberMe)
        this.toastr.success('Success!', 'Logged in successfully!');
        this.router.navigate(['./dashboard']);
      },
      error: (error) => {
        this.toastr.error('Error!', 'Invalid UserName Or Password!');
      },
    });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  // Unsubscribe from the subscription when the component is destroyed
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
