import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserProfile } from '../common/models/user-profile.model';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  
  isAuthenticated: boolean = false;
  roles: any;
  username: string = '';
  accessToken: string = '';
  userProfile: UserProfile = {};

  options = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };

  constructor(private httpClient: HttpClient, private router: Router) { }

  public login(username: string, password: string) {
    const payload = { username, password };

    return this.httpClient.post(environment.backendHost+'/auth/login', payload, this.options);
  }

  public refreshToken() {
    const token = this.accessToken
      || (this.userProfile && (this.userProfile as any).accessToken)
      || (() => {
        const stored = localStorage.getItem('user');
        if (!stored) return '';
        try { return JSON.parse(stored).accessToken || ''; } catch { return ''; }
      })();

    const headers = this.options.headers.set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(environment.backendHost + '/auth/refresh', {}, { headers });
  }

  

  public signup(userDetails: {email: string, username: string, firstName: string, lastName: string, password: string}) {

    return this.httpClient.post(environment.backendHost+'/auth/register', userDetails, this.options);
  }

  laodUserProfile(data: any) {
    this.isAuthenticated = true;

    this.accessToken = data['access_token'];
    let decodedToken:any = jwtDecode(this.accessToken);

    this.userProfile.username = decodedToken.sub;
    this.userProfile.scopes = decodedToken.scope;
    this.userProfile.accessToken = this.accessToken;
    this.roles = decodedToken.scope;
    localStorage.setItem('user', JSON.stringify(this.userProfile));
  }

   logout() {
    this.isAuthenticated = false;
    this.roles = null;
    this.username = '';
    this.accessToken = '';
    this.userProfile = {};
    localStorage.removeItem('user');
    this.router.navigateByUrl('/auth/login');
  }

  loadUserProfileFromLocalStorage() {
    this.userProfile = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.userProfile && this.userProfile.accessToken) {
      this.laodUserProfile({"access_token": this.userProfile.accessToken });
      this.router.navigateByUrl('/accounts');
    }
  }
}


