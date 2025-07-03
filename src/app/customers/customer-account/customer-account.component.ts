import { Component } from '@angular/core';
import { Customer, CustomerAccount } from '../../common/models/customer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormatDatePipe } from "../../common/pipe/date-array.pipe";
import { catchError, Observable, throwError } from 'rxjs';
import { CustomersService } from '../../services/customers.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-account',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormatDatePipe],
  templateUrl: './customer-account.component.html',
  styleUrl: './customer-account.component.css'
})
export class CustomerAccountComponent {

  customerId! : string ;
  customer! : Customer;
  isLoading: boolean = false;
  accountsObservable! : Observable<CustomerAccount[]>

  constructor(private route : ActivatedRoute, private router :Router,
    private customerService : CustomersService,
    private snackBar: SnackBarService
  ) {
    this.customer=this.router.getCurrentNavigation()?.extras.state as Customer;
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'];
    this.handleCustomerAccounts();
  }

  manageAccount(arg0: string) {
    this.snackBar.openSnackBar('Method yet not implemented.');
  }

  accountOperations(accountId: string) {
    this.snackBar.openSnackBar('Navigating to account operations...'+accountId);
    this.router.navigateByUrl("accounts/"+accountId+"/operations");
  }

  calculateMonthlyInterest(balance: number, interestRate: number): number {
    return (balance * interestRate) / 100 / 12;
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'CREATED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ACTIVATED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'BLOCKED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }

  customerAccountDetails(accountId: string) {
    this.router.navigateByUrl("/customers/"+this.customerId+"/accounts/"+accountId, {state: this.customer}); 
  }

    handleCustomerAccounts(): void {
      this.accountsObservable=this.customerService.getCustomerAccounts(this.customerId).pipe(
        catchError(err => {
          this.snackBar.openSnackBar(err.message);
          return throwError(err);
        })
      );
    }
}
