import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Customer } from '../../common/models/customer.model';
import { CustomersService } from '../../services/customers.service';
import { CommonModule } from '@angular/common';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-customer-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent {
  customers! : Observable<Array<Customer>>;
  errorMessage!: string;
  searchFormGroup : FormGroup | undefined;
  
  constructor(private customerService : CustomersService, 
    private fb : FormBuilder, 
    private router : Router,
   private snackBar: SnackBarService) { }

  ngOnInit(): void {
    this.searchFormGroup=this.fb.group({
      keyword : this.fb.control("")
    });
    this.allCustomers();
  }

   allCustomers() {
    let kw=this.searchFormGroup?.value.keyword;
    this.customers=this.customerService.getCustomers().pipe(
      catchError(err => {
        this.errorMessage=err.message;
        this.snackBar.openSnackBar("Error fetching customers: " + this.errorMessage);
        return throwError(err);
      })
    );
  }

  handleSearchCustomers() {
    let kw=this.searchFormGroup?.value.keyword;
    this.customers=this.customerService.searchCustomers(kw).pipe(
      catchError(err => {
        this.errorMessage=err.message;
        this.snackBar.openSnackBar("Error searching customers: " + this.errorMessage);
        return throwError(err);
      })
    );
  }

  handleDeleteCustomer(c: Customer) {
    let conf = confirm("Are you sure?");
    if(!conf) return;
    this.customerService.deleteCustomer(c.id).subscribe({
      next : (resp) => {
        this.customers=this.customers.pipe(
          map(data=>{
            let index=data.indexOf(c);
            data.slice(index,1)
            this.snackBar.openSnackBar("Customer deleted successfully!");
            return data;
          })
        );
      },
      error : err => {
        this.snackBar.openSnackBar("Error deleting customer: " + err.message);
        console.log(err);
      }
    })
  }

  handleCustomerAccounts(customer: Customer) {
    this.router.navigateByUrl("customers/"+customer.id+"/accounts",{state :customer});
  }
}
