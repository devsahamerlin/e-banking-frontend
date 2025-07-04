import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfile } from '../../common/models/user-profile.model';
import { AuthService } from '../../services/auth.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isLoading: boolean = false;
  loginFormGroup! : FormGroup;
  constructor(private fb : FormBuilder, private authService:AuthService, private router:Router,
    private snackBar: SnackBarService
  ) { }

  ngOnInit(): void {
    this.loginFormGroup=this.fb.group({
      username : this.fb.control(null, [Validators.required, Validators.email]),
      password : this.fb.control(null,[Validators.required, Validators.minLength(8)])
    });
  }

  handleLogin() {
    if (this.loginFormGroup.invalid) {
      this.snackBar.openSnackBar("Please fill in all required fields correctly.");
      return;
    }
    let username = this.loginFormGroup.value.username;
    let password = this.loginFormGroup.value.password;
    this.authService.login(username, password).subscribe({
      next : data=>{
        this.snackBar.openSnackBar("Login successful!");
        this.loginFormGroup.reset();
        this.authService.laodUserProfile(data);
        this.router.navigateByUrl("/accounts");
      },
      error : err => {
        this.snackBar.openSnackBar("Login failed: " + err.message);
        console.log(err);
      }
    });
  }

}
