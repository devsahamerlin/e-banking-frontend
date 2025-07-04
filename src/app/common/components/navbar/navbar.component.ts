import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../models/user-profile.model';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SnackBarService } from '../../../services/snack-bar.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isDarkMode = false;
  showNotifications = false;
  showUserMenu = false;
  currentTime = new Date();
  isCollapsed = false;
  isAuthenticated = false;
  
  userProfile: UserProfile = {
    lastName: 'Merlin',
    username: 'admin@ebanking.com',
    password: '12345',
    avatar: 'SM',
    role: 'Admin',
    id: '',
    firstName: 'S'
  };

  quickActions = [
    {
      id: 'new-account',
      label: 'New Account',
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      route: '/accounts/new',
      color: 'bg-blue-500',
      requiredRole: 'ADMIN'
    },
    {
      id: 'new-customer',
      label: 'New Customer',
      icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
      route: '/customers/new',
      color: 'bg-green-500',
      requiredRole: 'ADMIN'
    },
    {
      id: 'accounts',
      label: 'Operations',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      route: '/accounts',
      color: 'bg-purple-500'
    }
  ];

  constructor(public authService: AuthService,
    private snackBar: SnackBarService,
    private router: Router
   ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated;
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 1000);
    
    this.loadTheme();
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  updateTime(): void {
    this.currentTime = new Date();
  }

  loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  applyTheme(): void {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }


  handleLogout(): void {
    this.authService.logout();
    this.snackBar.openSnackBar("You have been logged out successfully.");
    this.router.navigateByUrl("/auth/login");
  }
}