import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterDto } from '../AccountDto';
import { AccountService } from 'src/app/core/services/account.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registrationForm: FormGroup;
  private subscription: Subscription;
  showPassword: boolean = false
  constructor(
    private fb: FormBuilder,
    private authService: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword
  }

  initForm(): void {
    this.registrationForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      companyName: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  
    this.registrationForm.get('confirmPassword').setValidators([Validators.required, Validators.minLength(6), this.passwordsMatchValidator.bind(this)]);
  }

  register(): void {
    if (this.registrationForm.valid) {
      const register: RegisterDto = this.registrationForm.value;
      this.subscription = this.authService.register(register).subscribe({
        next: (res) => {
          this.toastr.success('Success!', 'Registered successfully!');
          this.router.navigate(['./login']);
        },
        error: (err) => {
          this.toastr.error('Error!', 'Error registering this user!');
        },
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  // Custom validator function
  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = this.registrationForm.get('password');
    const confirmPassword = this.registrationForm.get('confirmPassword');
    console.log(confirmPassword)
  
    if (!password || !confirmPassword) {
      return null;
    }
  
    return password.value === confirmPassword.value ? null : { passwordsNotMatched: true };
  }
  
}
