import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SnackBarService } from '../../services/snack-bar.service';

export const authenticationGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const snackBar = inject(SnackBarService);
  const router = inject(Router);

  if (authService.isAuthenticated === true) {
    return true;
  } else {
    snackBar.openSnackBar("You are not authenticated. Please log in.");
    router.navigateByUrl("/auth/login");
    return false;
  }
};
