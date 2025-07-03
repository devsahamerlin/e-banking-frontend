import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';
import { NewAccountComponent } from './new-account/new-account.component';

const routes: Routes = [
  { path: '', component: TransactionsComponent },
  { path: ':id/operations', component: TransactionsComponent },
  { path: 'new', component: NewAccountComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
