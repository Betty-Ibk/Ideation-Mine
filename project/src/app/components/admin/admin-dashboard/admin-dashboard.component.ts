import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IdeaService, IdeaPost } from '../../../services/idea.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {{ currentUser?.name }}</p>
      </div>
      
      <div class="admin-content">
        <div class="admin-card">
          <h2>System Statistics</h2>
          <div class="admin-stats">
            <div class="stat-item">
              <span class="stat-value">{{ totalUsers }}</span>
              <span class="stat-label">Total Users</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ totalIdeas }}</span>
              <span class="stat-label">Ideas Submitted</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ totalVotes }}</span>
              <span class="stat-label">Votes Cast</span>
            </div>
          </div>
        </div>
        
        <div class="admin-card">
          <h2>Idea Engagement</h2>
          <div class="chart-container">
            <div class="chart">
              <div class="chart-header">
                <h3>Votes Distribution</h3>
              </div>
              <div class="bar-chart">
                <div *ngFor="let idea of topIdeas" class="chart-bar">
                  <div class="bar-label">{{ idea.title.substring(0, 20) }}...</div>
                  <div class="bar-container">
                    <div class="bar-positive" [style.width.%]="getUpvotePercentage(idea)">
                      {{ idea.upvotes }}
                    </div>
                    <div class="bar-negative" [style.width.%]="getDownvotePercentage(idea)">
                      {{ idea.downvotes }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="admin-card">
          <h2>Admin Actions</h2>
          <div class="admin-actions">
            <button class="btn btn-primary" routerLink="/admin/users">Manage Users</button>
            <button class="btn btn-primary" routerLink="/admin/ideas">Review Ideas</button>
            <button class="btn btn-primary" routerLink="/admin/settings">System Settings</button>
          </div>
        </div>
        
        <div class="admin-card">
          <h2>Recent Activity</h2>
          <div class="activity-list">
            <div *ngFor="let activity of recentActivities" class="activity-item">
              <div class="activity-icon" [ngClass]="activity.type">
                <span *ngIf="activity.type === 'new-idea'">💡</span>
                <span *ngIf="activity.type === 'vote'">👍</span>
                <span *ngIf="activity.type === 'comment'">💬</span>
              </div>
              <div class="activity-content">
                <div class="activity-text">{{ activity.text }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: var(--space-4);
      max-width: 1200px;
      margin: 0 auto;
      margin-top: 60px;
    }
    
    .admin-header {
      margin-bottom: var(--space-4);
      padding-bottom: var(--space-3);
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .admin-header h1 {
      color: var(--neutral-800);
      margin-bottom: var(--space-1);
    }
    
    .admin-header p {
      color: var(--neutral-600);
    }
    
    .admin-content {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }
    
    @media (min-width: 768px) {
      .admin-content {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    .admin-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: var(--space-3);
    }
    
    .admin-card h2 {
      margin-bottom: var(--space-3);
      color: var(--neutral-800);
      font-size: 1.25rem;
    }
    
    .admin-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-2);
    }
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--primary-600);
    }
    
    .stat-label {
      font-size: 0.875rem;
      color: var(--neutral-600);
    }
    
    .admin-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    
    @media (min-width: 768px) {
      .admin-actions {
        flex-direction: row;
      }
    }
    
    .chart-container {
      height: 300px;
    }
    
    .chart {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .chart-header {
      margin-bottom: var(--space-2);
    }
    
    .chart-header h3 {
      font-size: 1rem;
      color: var(--neutral-700);
    }
    
    .bar-chart {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .chart-bar {
      display: flex;
      align-items: center;
      margin-bottom: var(--space-2);
    }
    
    .bar-label {
      width: 150px;
      font-size: 0.875rem;
      color: var(--neutral-700);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .bar-container {
      flex-grow: 1;
      height: 24px;
      display: flex;
      background-color: var(--neutral-100);
      border-radius: 4px;
      overflow: hidden;
    }
    
    .bar-positive {
      height: 100%;
      background-color: var(--success-500);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: bold;
    }
    
    .bar-negative {
      height: 100%;
      background-color: var(--danger-500);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: bold;
    }
    
    .activity-list {
      max-height: 300px;
      overflow-y: auto;
    }
    
    .activity-item {
      display: flex;
      padding: var(--space-2) 0;
      border-bottom: 1px solid var(--neutral-100);
    }
    
    .activity-item:last-child {
      border-bottom: none;
    }
    
    .activity-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: var(--space-2);
    }
    
    .activity-icon.new-idea {
      background-color: var(--primary-100);
      color: var(--primary-600);
    }
    
    .activity-icon.vote {
      background-color: var(--success-100);
      color: var(--success-600);
    }
    
    .activity-icon.comment {
      background-color: var(--info-100);
      color: var(--info-600);
    }
    
    .activity-content {
      flex-grow: 1;
    }
    
    .activity-text {
      font-size: 0.875rem;
      color: var(--neutral-800);
    }
    
    .activity-time {
      font-size: 0.75rem;
      color: var(--neutral-500);
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  totalUsers = 124;
  totalIdeas = 0;
  totalVotes = 0;
  topIdeas: IdeaPost[] = [];
  
  recentActivities = [
    {
      type: 'new-idea',
      text: 'New idea submitted: "Implement AI-powered customer service"',
      time: '10 minutes ago'
    },
    {
      type: 'vote',
      text: 'John Doe upvoted "Smart Queue Management System"',
      time: '25 minutes ago'
    },
    {
      type: 'comment',
      text: 'Sarah Johnson commented on "Digital Document Verification"',
      time: '1 hour ago'
    },
    {
      type: 'new-idea',
      text: 'New idea submitted: "Employee wellness program"',
      time: '2 hours ago'
    },
    {
      type: 'vote',
      text: 'Michael Chen downvoted "Buy Favour\'s Cake!"',
      time: '3 hours ago'
    }
  ];
  
  get currentUser() {
    return this.authService.getCurrentUser();
  }
  
  constructor(
    private authService: AuthService,
    private ideaService: IdeaService
  ) {}
  
  ngOnInit() {
    this.ideaService.getIdeas().subscribe(ideas => {
      this.totalIdeas = ideas.length;
      this.totalVotes = ideas.reduce((sum, idea) => sum + idea.upvotes + idea.downvotes, 0);
      
      // Get top 5 ideas by total votes
      this.topIdeas = [...ideas]
        .sort((a, b) => (b.upvotes + b.downvotes) - (a.upvotes + a.downvotes))
        .slice(0, 5);
    });
  }
  
  getUpvotePercentage(idea: IdeaPost): number {
    const total = idea.upvotes + idea.downvotes;
    return total > 0 ? (idea.upvotes / total) * 100 : 0;
  }
  
  getDownvotePercentage(idea: IdeaPost): number {
    const total = idea.upvotes + idea.downvotes;
    return total > 0 ? (idea.downvotes / total) * 100 : 0;
  }
}
