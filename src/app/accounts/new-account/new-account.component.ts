import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountsService } from '../../services/accounts.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-account',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-account.component.html',
  styleUrl: './new-account.component.css'
})
export class NewAccountComponent {
  newAccountFormGroup: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private accountService : AccountsService,
      private snackBar: SnackBarService) {

    this.newAccountFormGroup = this.fb.group({
      customerId: ['', Validators.required],
      type: ['CURRENT', Validators.required],
      balance: [0, [Validators.required, Validators.min(0)]],
      status: ['CREATED', Validators.required],
      overdraft: [0, [Validators.required, Validators.min(0)]],
      interestRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  setAccountType(type: 'CURRENT' | 'SAVING') {
    this.newAccountFormGroup.patchValue({ type });
    
    // Update validators based on account type
    if (type === 'CURRENT') {
      this.newAccountFormGroup.get('overdraft')?.setValidators([Validators.required, Validators.min(0)]);
      this.newAccountFormGroup.get('interestRate')?.clearValidators();
    } else {
      this.newAccountFormGroup.get('interestRate')?.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      this.newAccountFormGroup.get('overdraft')?.clearValidators();
    }
    
    this.newAccountFormGroup.get('overdraft')?.updateValueAndValidity();
    this.newAccountFormGroup.get('interestRate')?.updateValueAndValidity();
  }

  getAccountTypeButtonClass(type: string): string {
    const selectedType = this.newAccountFormGroup.get('type')?.value;
    return selectedType === type 
      ? 'bg-blue-500 text-white border-blue-500' 
      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600';
  }

  handleSaveAccount() {
    if (this.newAccountFormGroup.valid) {
      this.isLoading = true;
      const formData = this.newAccountFormGroup.value;
      
      if (formData.type === 'CURRENT') {
        delete formData.interestRate;
      } else {
        delete formData.overdraft;
      }
      
      this.accountService.createAccount(formData).subscribe({
        next : (data)=>{
          this.snackBar.openSnackBar("Account created successfully!");
          this.newAccountFormGroup.reset();
          this.isLoading = false;
        },
        error : (err)=>{
          this.snackBar.openSnackBar("Account creation failed: " + err.message);
          this.isLoading = false;
          console.log(err);
        }
      });
    }
  }
}
