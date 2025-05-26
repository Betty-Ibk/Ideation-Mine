import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private refreshKey = 'lastRefresh';
  
  constructor(private router: Router) {
    // Try to restore user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
        
        // Check if this is a new session after refresh
        const lastRefresh = localStorage.getItem(this.refreshKey);
        const now = new Date().getTime();
        
        // If there's no refresh timestamp or it's been more than 2 seconds,
        // consider it a page refresh and clear the user
        if (!lastRefresh || (now - parseInt(lastRefresh)) > 2000) {
          this.logout();
        }
        
        // Update the refresh timestamp
        localStorage.setItem(this.refreshKey, now.toString());
      } catch (e) {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
      }
    }
  }
  
  login(employeeId: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // Debug log
      console.log('Auth service login attempt with:', employeeId, this.maskPassword(password));
      
      // Simulate API call
      setTimeout(() => {
        try {
          // Case-insensitive comparison for better user experience
          const empIdUpper = employeeId.toUpperCase();
          
          if (empIdUpper === 'ADMIN007' && password === 'adminpass') {
            console.log('Admin login successful');
            const user = {
              id: '2',
              name: 'Admin User',
              email: 'admin@example.com',
              role: 'admin'
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            resolve(user);
          } else if (empIdUpper === 'EMP1001' && password === 'userpass') {
            console.log('Employee login successful');
            const user = {
              id: '1',
              name: 'John Doe',
              email: 'user@example.com',
              role: 'user'
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            resolve(user);
          } else {
            console.log('Login failed: Invalid credentials');
            reject(new Error('Invalid credentials'));
          }
        } catch (error) {
          console.error('Login error in service:', error);
          reject(error);
        }
      }, 1000);
    });
  }
  
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem(this.refreshKey);
    // Navigate to login page after logout
    this.router.navigate(['/login']);
  }
  
  isLoggedIn(): boolean {
    const user = localStorage.getItem('currentUser');
    return !!user;
  }
  
  isAdmin(): boolean {
    const user = localStorage.getItem('currentUser');
    if (!user) return false;
    
    try {
      const userData = JSON.parse(user);
      return userData.role === 'admin';
    } catch (e) {
      return false;
    }
  }
  
  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    if (!user) return null;
    
    try {
      return JSON.parse(user);
    } catch (e) {
      return null;
    }
  }

  // Helper method to mask password in logs
  private maskPassword(password: string): string {
    return password ? '*'.repeat(password.length) : '';
  }
}




