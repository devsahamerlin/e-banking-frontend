import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { SnackBarService } from '../../services/snack-bar.service';
import { AccountsService } from '../../services/accounts.service';
import { Account } from '../../common/models/account.model';
import { catchError, throwError, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Customer } from '../../common/models/customer.model';

@Component({
  selector: 'app-accounts-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './accounts-list.component.html',
  styleUrl: './accounts-list.component.css'
})
export class AccountsListComponent {
  accounts! : Observable<Array<Account>>;
  errorMessage!: string;
  searchFormGroup : FormGroup | undefined;
  
  constructor(private accountsService: AccountsService, 
    private fb : FormBuilder, 
    private router : Router,
    private snackBar: SnackBarService) { }

  ngOnInit(): void {
    this.searchFormGroup=this.fb.group({
      keyword : this.fb.control("")
    });
    this.allAccounts();
  }

   allAccounts() {
    this.accounts=this.accountsService.getAccounts().pipe(
      catchError(err => {
        this.errorMessage=err.message;
        this.snackBar.openSnackBar("Error fetching accounts: " + this.errorMessage);
        return throwError(err);
      })
    );
  }

   handleSearchAccounts() {
    let kw=this.searchFormGroup?.value.keyword;

    this.accounts=this.accountsService.searchAccounts(kw).pipe(
      catchError(err => {
        this.errorMessage=err.message;
        this.snackBar.openSnackBar("Error searching accounts: " + this.errorMessage);
        return throwError(err);
      })
    );
  }

  updateAccountStatus(account: Account, status: string) {
    let conf = confirm("Are you sure?");
    if(!conf) return;
    this.accountsService.updateAccountStatus(account.id, status).subscribe({
      next : (resp) => {
        this.accounts=this.accounts.pipe(
          map(data=>{
            let index=data.indexOf(account);
            data.slice(index,1)
            this.snackBar.openSnackBar("Account successfully "+status+"!");
            return data;
          })
        );
      },
      error : err => {
        this.snackBar.openSnackBar("Error "+status+" Account: " + err.message);
        console.log(err);
      }
    })
  }

  handleCustomerAccounts(customer: Customer) {
    this.router.navigateByUrl("customers/"+customer.id+"/accounts",{state :customer});
  }

  accountOperations(accountId: string) {
    this.snackBar.openSnackBar('Navigating to account operations...'+accountId);
    this.router.navigateByUrl("accounts/"+accountId+"/operations");
  }
  

  getStatusColor(status: string): string {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
      case 'SUSPENDED':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200';
      case 'CLOSED':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200';
      case 'BLOCKED':
        return 'bg-red-500 text-white dark:bg-red-500 dark:text-white';
      case 'CREATED':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
    }
  }
}
