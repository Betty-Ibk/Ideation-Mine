import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar *ngIf="!isLoginPage"></app-navbar>
    <main [class.with-navbar]="!isLoginPage">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    
    .with-navbar {
      padding-top: 64px;
      padding-left: 0;
    }
    
    @media (min-width: 993px) {
      .with-navbar {
        padding-left: 240px;
      }
    }
  `]
})
export class AppComponent {
  isLoginPage = true; // Default to true to hide navbar initially

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginPage = event.urlAfterRedirects === '/login' || event.url === '/login';
    });
  }
}

