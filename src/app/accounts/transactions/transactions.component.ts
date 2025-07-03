import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, Observable, throwError } from 'rxjs';
import { AccountDetails } from '../../common/models/account.model';
import { AccountsService } from '../../services/accounts.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { FormatDatePipe } from "../../common/pipe/date-array.pipe";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormatDatePipe],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  accountFormGroup! : FormGroup;
  currentPage : number =0;
  pageSize : number =5;
  accountObservable! : Observable<AccountDetails>
  operationFormGroup! : FormGroup;
  errorMessage! :string ;
  isLoading: boolean = false;
  searchAccountId: string = '';
  

  constructor(private fb : FormBuilder, private accountService : AccountsService,
    private snackBar: SnackBarService,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.searchAccountId = this.route.snapshot.params['id'];

    if (this.searchAccountId !== undefined && this.searchAccountId !== '') {
      this.accountFormGroup = this.fb.group({
        accountId: [this.searchAccountId, [Validators.required]]
      });
      this.handleSearchAccount();
    }

    this.accountFormGroup.get('accountId')?.valueChanges.subscribe(accountId => {
      this.operationFormGroup.patchValue({ accountId });
      this.searchAccountId = accountId || '';
    });
  }

  getPaginationArray(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  private initializeForm(): void {

    this.accountFormGroup = this.fb.group({
      accountId: ['', [Validators.required]]
    });

    this.operationFormGroup = this.fb.group({
      accountId: [''],
      operationType: ['DEBIT', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      description: [''],
      destinationAccountId: ['']
    });

    this.operationFormGroup.get('operationType')?.valueChanges.subscribe(operationType => {
      const destinationAccountIdControl = this.operationFormGroup.get('destinationAccountId');
      
      if (operationType === 'TRANSFER') {
        destinationAccountIdControl?.setValidators([Validators.required]);
      } else {
        destinationAccountIdControl?.clearValidators();
      }
      destinationAccountIdControl?.updateValueAndValidity();
    });
  }

  handleSearchAccount(): void {
    this.accountObservable=this.accountService.getAccount(this.accountFormGroup.value.accountId,this.currentPage, this.pageSize).pipe(
      catchError(err => {
        this.errorMessage=err.message;
        this.snackBar.openSnackBar(err.message);
        return throwError(err);
      })
    );
  }

  goToPage(page: number): void {
    if (page >= 0 && page) {
      this.currentPage = page;
      this.handleSearchAccount();
    }
  }

  setOperationType(type: 'DEBIT' | 'CREDIT' | 'TRANSFER'): void {
    this.operationFormGroup.patchValue({ operationType: type });
  }

  handleAccountOperation() {

    if (this.operationFormGroup.valid && !this.isLoading) {
      this.isLoading = true;
    }

    let accountId :string = this.accountFormGroup.value.accountId;
    let operationType=this.operationFormGroup.value.operationType;
    let amount :number =this.operationFormGroup.value.amount;
    let description :string =this.operationFormGroup.value.description;
    let destinationAccountId :string =this.operationFormGroup.value.destinationAccountId;

    if(operationType=='DEBIT'){
      this.accountService.debit(accountId, amount,description).subscribe({
        next : (data)=>{
          this.snackBar.openSnackBar("Success Debit");
          this.operationFormGroup.reset();
          this.handleSearchAccount();
          this.isLoading = false;
        },
        error : (err)=>{
          this.snackBar.openSnackBar("Debit failed: " + err.message);
          this.isLoading = false;
          console.log(err);
        }
      });
    } else if(operationType=='CREDIT'){
      this.accountService.credit(accountId, amount,description).subscribe({
        next : (data)=>{
          this.snackBar.openSnackBar("Success Credit");
          this.operationFormGroup.reset();
          this.handleSearchAccount();
          this.isLoading = false;
        },
        error : (err)=>{
          this.snackBar.openSnackBar("Credit failed: " + err.message);
          console.log(err);
          this.isLoading = false;
        }
      });
    }
    else if(operationType=='TRANSFER'){
      this.accountService.transfer(accountId,destinationAccountId, amount,description).subscribe({
        next : (data)=>{
          this.snackBar.openSnackBar("Success Transfer");
          this.operationFormGroup.reset();
          this.handleSearchAccount();
          this.isLoading = false;
        },
        error : (err)=>{
          this.snackBar.openSnackBar("Transfer failed: " + err.error.message);
          console.log(err.error.error);
          this.isLoading = false;
        }
      });

    }
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }

  getTransactionTypeColor(type: string): string {
    return type === 'DEBIT' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400';
  }

  getOperationButtonClass(type: 'DEBIT' | 'CREDIT' | 'TRANSFER'): string {
    const baseClass = 'px-6 py-2 rounded-lg font-medium transition-all duration-200 ';
    if (this.operationFormGroup.get('operationType')?.value === type) {
      const activeClasses = {
        'DEBIT': 'bg-red-500 text-white shadow-md',
        'CREDIT': 'bg-green-500 text-white shadow-md', 
        'TRANSFER': 'bg-blue-500 text-white shadow-md'
      };
      return baseClass + activeClasses[type];
    }
    return baseClass + 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600';
  }
}