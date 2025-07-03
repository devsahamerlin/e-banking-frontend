import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    {
      path: '',
      pathMatch: 'full',
      redirectTo: '/',
    },
    { path: 'dashboard', component: HomeComponent },
    {
      path: 'accounts',
      loadChildren: () =>
        import('./accounts/accounts-routing.module').then((module) => module.AccountsRoutingModule),
    },
    {
      path: 'customers',
      loadChildren: () =>
        import('./customers/customers-routing.module').then((module) => module.CustomersRoutingModule),
    },
];
