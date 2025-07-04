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

  constructor(private httpClient: HttpClient, private router: Router) { }

  public login(username: string, password: string) {

    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    const params = new HttpParams()
    .set('username', username).set('password', password);

    return this.httpClient.post(environment.backendHost+'/auth/login', params, options);
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


