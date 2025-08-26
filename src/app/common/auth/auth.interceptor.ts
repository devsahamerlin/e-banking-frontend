import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { SnackBarService } from '../../services/snack-bar.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService,
    private snackBar: SnackBarService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // try  to refresh token each 9 minutes for anly aunthenticated user
    if (this.authService.isAuthenticated) {
      setTimeout(() => {
        this.authService.refreshToken().subscribe({
          next: (res: any) => {
            const newAccessToken = res?.accessToken || res;
            if (newAccessToken) {
              this.authService.laodUserProfile({ access_token: newAccessToken });
              this.authService.accessToken = newAccessToken;
            }
          },
          error: (err) => {
            this.authService.logout();
            this.snackBar.openSnackBar("Your session has expired. Please log in again.");
            window.location.reload();
            console.log(err);
          }
        });
      }, 9 * 60 * 1000); // 9 minutes
    }
    if (!request.url.includes('auth/login') && !request.url.includes('auth/signup')) {
      const newRequest = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authService.accessToken}`
        }
      });
      return next.handle(newRequest)
      .pipe(
        catchError((error) => {
            if (error.status === 401 || error.status === 403) {
              // Tokens are proactively refreshed every 9 minutes; avoid attempting another refresh here
              this.authService.logout();
              this.snackBar.openSnackBar("Your session has expired. Please log in again.");
              window.location.reload();
              return throwError(() => error);
            }

            this.snackBar.openSnackBar("An error occurred: " + (error.message || 'Server error'));
            return throwError(() => error);
        })
      );
    } else return next.handle(request);
    
  }
}
