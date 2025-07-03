import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { CustomerAccountComponent } from './customer-account/customer-account.component';

const routes: Routes = [
  { path: '', component: CustomerListComponent },
  { path: 'new', component: NewCustomerComponent },
  { path: ':id/accounts', component: CustomerAccountComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
