import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { catchError, Observable, throwError } from 'rxjs';
import { SnackBarService } from '../../services/snack-bar.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService,
    private snackBar: SnackBarService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

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
            this.authService.logout();
            this.snackBar.openSnackBar("Your session has expired. Please log in again.");
            window.location.reload();
          }
          this.snackBar.openSnackBar("An error occurred: " + error.message);
          throw throwError(error.message || 'Server error');
        })
      );
    } else return next.handle(request);
    
  }
}
