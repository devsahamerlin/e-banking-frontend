import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';
import { NewAccountComponent } from './new-account/new-account.component';
import { authenticationGuard } from '../common/guard/authentication.guard';

const routes: Routes = [
  { path: '', component: TransactionsComponent },
  { path: ':id/operations', component: TransactionsComponent, data: { roles: ['ADMIN', 'USER'] } },
  { path: 'new', component: NewAccountComponent, data: { roles: ['ADMIN'] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
