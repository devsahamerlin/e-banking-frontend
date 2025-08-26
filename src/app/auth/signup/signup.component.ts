import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { last } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  showPassword = false;
  isLoading: boolean = false;
  signupFormGroup! : FormGroup;
  constructor(private fb : FormBuilder, private authService:AuthService, private router:Router,
    private snackBar: SnackBarService
  ) { }

  ngOnInit(): void {
    this.signupFormGroup=this.fb.group({
      email : this.fb.control(null, [Validators.required, Validators.email]),
      username : this.fb.control(null, [Validators.required, Validators.minLength(3)]),
      firstName : this.fb.control(null, [Validators.required, Validators.minLength(3)]),
      lastName : this.fb.control(null, [Validators.required, Validators.minLength(3)]),
      password : this.fb.control(null,[Validators.required, Validators.minLength(8)])
    });
  }

  handleSignup() {
    if (this.signupFormGroup.invalid) {
      this.snackBar.openSnackBar("Please fill in all required fields correctly.");
      return;
    }
    const userDetails = {
      email: this.signupFormGroup.value.email,
      username: this.signupFormGroup.value.username,
      firstName: this.signupFormGroup.value.firstName,
      lastName: this.signupFormGroup.value.lastName,
      password: this.signupFormGroup.value.password
    };
    this.authService.signup(userDetails).subscribe({
      next : data=>{
        this.snackBar.openSnackBar("Registered successful!");
        this.authService.login(userDetails.username, userDetails.password).subscribe({
          next : data=>{
            this.snackBar.openSnackBar("Login successful!");
            this.authService.laodUserProfile(data);
            this.signupFormGroup.reset();
            this.router.navigateByUrl("/accounts");
          },
          error : err => {
            this.snackBar.openSnackBar("Login failed: " + err.message);
            console.log(err);
          }
        });
        
      },
      error : err => {
        this.snackBar.openSnackBar("Login failed: " + err.message);
        console.log(err);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }


  navigateToSignin(): void {
    this.router.navigateByUrl('/auth/login');
  }
}
