import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SnackBarService } from '../../services/snack-bar.service';

export const authorizationGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const snackBar = inject(SnackBarService);
  const router = inject(Router);

  if (authService.roles.includes("ADMIN")) {
    return true;
  } else {
    snackBar.openSnackBar("You do not have permission to access this resource.");
    router.navigateByUrl("/not-authorized");
    return false;
  }
};
