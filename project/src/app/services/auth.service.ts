import { Injectable } from '@angular/core';

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
  
  constructor() {
    // Try to restore user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }
  
  login(employeeId: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (employeeId === 'ADMIN007' && password === 'adminpass') {
          this.currentUser = {
            id: '2',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin'
          };
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          resolve(this.currentUser);
        } else if (employeeId === 'EMP1001' && password === 'userpass') {
          this.currentUser = {
            id: '1',
            name: 'John Doe',
            email: 'user@example.com',
            role: 'user'
          };
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          resolve(this.currentUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }
  
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }
  
  isLoggedIn(): boolean {
    return !!this.currentUser;
  }
  
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
  
  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

