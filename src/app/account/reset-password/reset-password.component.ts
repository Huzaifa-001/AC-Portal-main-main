import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AccountService } from 'src/app/core/services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  token: string = '';
  resetPasswordForm: FormGroup;
  message: string = '';
  isError: boolean = false;
  showPassword: boolean = false;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  email: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private authService: AccountService
  ) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });

    this.initializeForm();
  }

  initializeForm() {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.resetPasswordForm.get('confirmPassword').setValidators([Validators.required, Validators.minLength(6), this.passwordsMatchValidator.bind(this)]);

  }

  toggleShowNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.get('newPassword').value;

      this.authService.resetPassword(this.email, this.token, newPassword).subscribe(
        (response: any) => {
          this.toastr.success(response.message, 'Success');
          this.router.navigate(['/login'])
        },
        error => {
          this.toastr.error('An error occurred. Please try again later.', 'Error');
        }
      );
    }
  }

  // Custom validator function
  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = this.resetPasswordForm.get('newPassword');
    const confirmPassword = this.resetPasswordForm.get('confirmPassword');
    console.log(confirmPassword)

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordsNotMatched: true };
  }

}
