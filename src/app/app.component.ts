import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./common/components/navbar/navbar.component";
import { SidebarComponent } from "./common/components/sidebar/sidebar.component";
import { HomeComponent } from "./home/home.component";
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent  implements OnInit {
  title = 'e-banking';
  sidebarOpen = true;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.loadUserProfileFromLocalStorage();
    initFlowbite();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
function initFlowbite() {
  throw new Error('Function not implemented.');
}

