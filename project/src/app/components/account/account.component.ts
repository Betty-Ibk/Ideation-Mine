import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="main-content">
      <div class="container">
        <div class="account-container">
          <div class="profile-section">
            <div class="profile-header">
              <div class="profile-image">
                <img src="https://i.pravatar.cc/150" alt="Profile picture">
              </div>
              <div class="profile-info">
                <h2 class="profile-name">Temitayo Awodiran</h2>
                <p class="profile-role">Innovation Department</p>
                <p class="profile-stats">
                  <span>12 Ideas Submitted</span>
                  <span>•</span>
                  <span>156 Votes Received</span>
                </p>
              </div>
            </div>
          </div>

          <div class="account-sections">
            <div class="section">
              <h3 class="section-title">Profile Settings</h3>
              <div class="form-group">
                <label>Display Name</label>
                <input type="text" value="Temitayo Awodiran">
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" value="Temitayo.awodiran@gtcobank.com">
              </div>
              <div class="form-group">
                <label>Department</label>
                <input type="text" value="Innovation Department">
              </div>
              <button class="btn btn-primary">Save Changes</button>
            </div>

            <div class="section">
              <h3 class="section-title">Notification Preferences</h3>
              <div class="preference-item">
                <label class="checkbox-label">
                  <input type="checkbox" checked>
                  Email notifications for new comments
                </label>
              </div>
              <div class="preference-item">
                <label class="checkbox-label">
                  <input type="checkbox" checked>
                  Email notifications for idea status updates
                </label>
              </div>
              <div class="preference-item">
                <label class="checkbox-label">
                  <input type="checkbox">
                  Weekly digest of top ideas
                </label>
              </div>
            </div>

            <div class="section">
              <h3 class="section-title">Account Security</h3>
              <button class="btn btn-outline">Change Password</button>
              <button class="btn btn-outline">Enable Two-Factor Authentication</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .main-content {
      padding: var(--space-4) 0;
    }

    .account-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .profile-section {
      background-color: white;
      border-radius: 12px;
      padding: var(--space-4);
      margin-bottom: var(--space-4);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .profile-header {
      display: flex;
      gap: var(--space-4);
      align-items: center;
    }

    .profile-image {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
    }

    .profile-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profile-info {
      flex: 1;
    }

    .profile-name {
      font-size: 1.5rem;
      margin-bottom: 4px;
    }

    .profile-role {
      color: var(--neutral-600);
      margin-bottom: 8px;
    }

    .profile-stats {
      font-size: 0.875rem;
      color: var(--neutral-500);
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .account-sections {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .section {
      background-color: white;
      border-radius: 12px;
      padding: var(--space-4);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .section-title {
      font-size: 1.25rem;
      margin-bottom: var(--space-3);
      color: var(--neutral-800);
    }

    .form-group {
      margin-bottom: var(--space-3);
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-size: 0.875rem;
      color: var(--neutral-700);
    }

    .form-group input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--neutral-300);
      border-radius: 6px;
      font-size: 0.875rem;
    }

    .form-group input:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 2px rgba(255, 122, 0, 0.1);
    }

    .preference-item {
      margin-bottom: var(--space-2);
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 0.875rem;
      color: var(--neutral-700);
    }

    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background-color: var(--primary-500);
      color: white;
      border: none;
    }

    .btn-primary:hover {
      background-color: var(--primary-600);
    }

    .btn-outline {
      background-color: transparent;
      border: 1px solid var(--neutral-300);
      color: var(--neutral-700);
      display: block;
      width: 100%;
      margin-bottom: var(--space-2);
    }

    .btn-outline:hover {
      background-color: var(--neutral-50);
    }

    @media (max-width: 640px) {
      .profile-header {
        flex-direction: column;
        text-align: center;
      }

      .profile-image {
        margin: 0 auto;
      }

      .profile-stats {
        justify-content: center;
      }
    }
  `]
})
export class AccountComponent {}