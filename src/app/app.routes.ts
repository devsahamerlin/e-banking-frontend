import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { authenticationGuard } from './common/guard/authentication.guard';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';

export const routes: Routes = [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    {
      path: '',
      pathMatch: 'full',
      redirectTo: '/',
    },
    { path: 'home', component: HomeComponent, canActivate: [authenticationGuard] },
    {
      path: 'dashboard', canActivate: [authenticationGuard],
      loadChildren: () =>
        import('./dashboard/dashboard-routing.module').then((module) => module.DashboardRoutingModule),
    },
    {
      path: 'accounts', canActivate: [authenticationGuard],
      loadChildren: () =>
        import('./accounts/accounts-routing.module').then((module) => module.AccountsRoutingModule),
    },
    {
      path: 'customers', canActivate: [authenticationGuard],
      loadChildren: () =>
        import('./customers/customers-routing.module').then((module) => module.CustomersRoutingModule),
    },
    {
      path: 'auth',
      loadChildren: () =>
        import('./auth/auth-routing.module').then((module) => module.AuthRoutingModule),
    },
    {
      path: 'not-authorized', component: NotAuthorizedComponent
    }

];
