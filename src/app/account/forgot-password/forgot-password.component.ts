import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/core/services/account.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  isError: boolean = false;

  constructor(private authService: AccountService, private toastr: ToastrService) { }

  sendForgotPasswordEmail() {
    const forgotPasswordDto = { email: this.email };
    this.authService.forgotPassword(forgotPasswordDto).subscribe(
      (response: any) => {
        this.toastr.success("An email has been sent with the instructions. \n Kindly check your inbox.", 'Success');
      },
      error => {
        this.message = 'An error occurred. Please try again later.';
        this.toastr.error('An error occurred. Please try again later.','error');

      }
    );
  }
}
