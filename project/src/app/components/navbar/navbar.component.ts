import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="container">
        <div class="nav-content">
          <div class="nav-left">
            <button class="menu-toggle" (click)="toggleMenu()" [class.active]="isMenuOpen">
              <span class="menu-icon"></span>
            </button>
            <div class="logo">
              <img src="assets/images/gtco-logo.png" alt="GTCO Logo" class="logo-image">
              <div class="logo-text-container">
                <span class="logo-text">GTCO</span>
                <span class="logo-subtitle">Ideation Mine</span>
              </div>
            </div>
          </div>
          
          <div class="search-bar">
            <input type="text" placeholder="Search ideas..." class="search-input">
          </div>
          
          <div class="nav-actions">
            <a routerLink="/new-idea" class="btn btn-primary pulse-animation">+ New Idea</a>
            <div class="user-profile" (click)="toggleUserMenu()">
              <img src="https://i.pravatar.cc/32" alt="User" class="avatar">
              <span class="username">{{ currentUser?.name || 'User' }}</span>
              
              <div class="user-menu" *ngIf="isUserMenuOpen">
                <a routerLink="/account" class="user-menu-item">My Profile</a>
                <a *ngIf="isAdmin" routerLink="/admin" class="user-menu-item">Admin Dashboard</a>
                <a (click)="logout()" class="user-menu-item">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <aside class="sidebar" [class.active]="isMenuOpen || isLargeScreen">
      <div class="sidebar-header">
        <img src = "https://upload.wikimedia.org/wikipedia/commons/2/28/GTCO_logo.svg" alt="GTCO Logo" class="sidebar-logo">
        <h3 class="sidebar-title">Ideation Mine</h3>
      </div>
      <div class="sidebar-content">
        <nav class="nav-menu">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item" (click)="closeMenuIfSmallScreen()">
            <span class="nav-icon">📊</span>
            <span class="nav-label">Dashboard</span>
          </a>
          <a routerLink="/popular" routerLinkActive="active" class="nav-item" (click)="closeMenuIfSmallScreen()">
            <span class="nav-icon">🔥</span>
            <span class="nav-label">Popular</span>
          </a>
          <a routerLink="/my-ideas" routerLinkActive="active" class="nav-item" (click)="closeMenuIfSmallScreen()">
            <span class="nav-icon">💡</span>
            <span class="nav-label">My Ideas</span>
          </a>
          
          <a *ngIf="isAdmin" routerLink="/admin" routerLinkActive="active" class="nav-item" (click)="closeMenuIfSmallScreen()">
            <span class="nav-icon">⚙️</span>
            <span class="nav-label">Admin</span>
          </a>
          <a routerLink="/idea-feed" routerLinkActive="active" class="nav-item" (click)="closeMenuIfSmallScreen()">
            <span class="nav-icon">📰</span>
            <span class="nav-label">Idea Feed</span>
          </a>
          <a routerLink="/account" routerLinkActive="active" class="nav-item" (click)="closeMenuIfSmallScreen()">
            <span class="nav-icon">👤</span>
            <span class="nav-label">Account</span>
          </a>
        </nav>
      </div>
      <div class="sidebar-footer">
        <p>© 2025 GTCO</p>
      </div>
    </aside>
    
    <div class="sidebar-overlay" *ngIf="!isLargeScreen && isMenuOpen" (click)="closeMenu()"></div>
  `,
  styles: [`
    .navbar {
      background-color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: var(--space-2) 0;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      transition: all 0.3s ease;
    }

    .nav-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .menu-toggle {
      display: none;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .menu-toggle:hover {
      background-color: var(--primary-50);
    }

    .menu-toggle.active .menu-icon {
      background-color: transparent;
    }

    .menu-toggle.active .menu-icon::before {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .menu-toggle.active .menu-icon::after {
      transform: rotate(-45deg) translate(5px, -5px);
    }

    .menu-icon {
      display: block;
      width: 24px;
      height: 2px;
      background-color: var(--primary-600);
      position: relative;
      transition: background-color 0.3s;
    }

    .menu-icon::before,
    .menu-icon::after {
      content: '';
      position: absolute;
      width: 24px;
      height: 2px;
      background-color: var(--primary-600);
      transition: transform 0.3s;
    }

    .menu-icon::before {
      top: -6px;
    }

    .menu-icon::after {
      bottom: -6px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .logo-image {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      transition: transform 0.3s ease;
    }

    .logo:hover .logo-image {
      transform: scale(1.05);
    }

    .logo-text-container {
      display: flex;
      flex-direction: column;
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary-600);
      line-height: 1.2;
    }

    .logo-subtitle {
      font-size: 0.875rem;
      color: var(--primary-400);
    }

    .search-bar {
      flex: 1;
      max-width: 500px;
      position: relative;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--neutral-200);
      border-radius: 6px;
      font-size: 0.875rem;
      transition: all 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(255, 122, 0, 0.1);
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      position: relative;
      cursor: pointer;
      padding: 6px 10px;
      border-radius: 30px;
      transition: background-color 0.3s;
    }

    .user-profile:hover {
      background-color: var(--primary-50);
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid var(--primary-300);
      transition: transform 0.3s ease;
    }

    .user-profile:hover .avatar {
      transform: scale(1.05);
    }

    .username {
      font-size: 0.875rem;
      color: var(--neutral-700);
    }
    
    .user-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      width: 200px;
      margin-top: 8px;
      z-index: 10;
      overflow: hidden;
    }
    
    .user-menu-item {
      display: block;
      padding: 12px 16px;
      color: var(--neutral-700);
      text-decoration: none;
      transition: all 0.2s ease;
    }
    
    .user-menu-item:hover {
      background-color: var(--primary-50);
      color: var(--primary-700);
    }

    /* Sidebar Styles */
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: 240px;
      height: 100vh;
      background-color: white;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
      z-index: 99;
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
      display: flex;
      flex-direction: column;
    }

    .sidebar.active {
      transform: translateX(0);
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      padding: var(--space-3) var(--space-3);
      border-bottom: 1px solid var(--neutral-100);
      gap: var(--space-2);
    }

    .sidebar-logo {
      width: 32px;
      height: 32px;
      border-radius: 4px;
    }

    .sidebar-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--primary-600);
    }

    .sidebar-content {
      flex: 1;
      padding: var(--space-3) 0;
      overflow-y: auto;
    }

    .sidebar-footer {
      padding: var(--space-2) var(--space-3);
      border-top: 1px solid var(--neutral-100);
      font-size: 0.75rem;
      color: var(--neutral-500);
      text-align: center;
    }

    .nav-menu {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 10px var(--space-3);
      color: var(--neutral-700);
      text-decoration: none;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
    }

    .nav-item:hover {
      background-color: var(--primary-50);
      color: var(--primary-700);
      border-left-color: var(--primary-300);
    }

    .nav-item.active {
      background-color: var(--primary-50);
      color: var(--primary-700);
      border-left-color: var(--primary-500);
      font-weight: 500;
    }

    .nav-icon {
      margin-right: var(--space-2);
      font-size: 1.2rem;
    }

    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: -1;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .sidebar.active + .sidebar-overlay {
      opacity: 1;
      visibility: visible;
    }

    /* Animation */
    .pulse-animation {
      animation: pulse 2s infinite;
      box-shadow: 0 0 0 0 rgba(255, 122, 0, 0.7);
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(255, 122, 0, 0.7);
      }
      70% {
        transform: scale(1.05);
        box-shadow: 0 0 0 10px rgba(255, 122, 0, 0);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(255, 122, 0, 0);
      }
    }

    @media (max-width: 992px) {
      .menu-toggle {
        display: flex;
      }

      .search-bar {
        display: none;
      }
      
      .sidebar-overlay {
        display: block;
      }
    }

    @media (min-width: 993px) {
      .sidebar-overlay {
        display: none;
      }
    }

    @media (max-width: 576px) {
      .username {
        display: none;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  isUserMenuOpen = false;
  isLargeScreen = false;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit() {
    this.checkScreenSize();
  }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }
  
  checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 993;
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get isAdmin() {
    const isAdmin = this.authService.isAdmin();
    console.log('Is user admin?', isAdmin);
    return isAdmin;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isLargeScreen) {
      document.body.classList.toggle('sidebar-open', this.isMenuOpen);
    }
  }

  closeMenu() {
    if (!this.isLargeScreen) {
      this.isMenuOpen = false;
      document.body.classList.remove('sidebar-open');
    }
  }
  
  closeMenuIfSmallScreen() {
    if (!this.isLargeScreen) {
      this.closeMenu();
    }
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.isUserMenuOpen = false;
  }
}





