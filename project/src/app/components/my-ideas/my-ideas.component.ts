import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Idea {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'implemented';
  votes: number;
  comments: number;
  timestamp: string;
}

@Component({
  selector: 'app-my-ideas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="main-content">
      <div class="container">
        <h2 class="page-title">My Ideas</h2>
        <div class="ideas-list">
          <div *ngFor="let idea of myIdeas" class="idea-card">
            <div class="idea-content">
              <div class="idea-header">
                <h3 class="idea-title">{{idea.title}}</h3>
                <span class="idea-status" [class]="idea.status">{{idea.status}}</span>
              </div>
              <p class="idea-description">{{idea.description}}</p>
              <div class="idea-meta">
                <span class="timestamp">{{idea.timestamp}}</span>
                <span class="stats">
                  <span class="votes">⬆ {{idea.votes}} votes</span>
                  <span class="comments">💬 {{idea.comments}} comments</span>
                </span>
              </div>
            </div>
            <div class="idea-actions">
              <button class="btn btn-primary">Edit</button>
              <button class="btn btn-outline">Delete</button>
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

    .page-title {
      margin-bottom: var(--space-4);
      color: var(--neutral-800);
      font-size: 1.5rem;
    }

    .ideas-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .idea-card {
      background-color: white;
      border-radius: 8px;
      padding: var(--space-3);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      display: flex;
      gap: var(--space-3);
    }

    .idea-content {
      flex: 1;
    }

    .idea-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-2);
    }

    .idea-title {
      font-size: 1.125rem;
      margin: 0;
    }

    .idea-status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .idea-status.pending {
      background-color: var(--neutral-100);
      color: var(--neutral-700);
    }

    .idea-status.approved {
      background-color: #dcfce7;
      color: #15803d;
    }

    .idea-status.implemented {
      background-color: #dbeafe;
      color: #1d4ed8;
    }

    .idea-description {
      color: var(--neutral-600);
      font-size: 0.875rem;
      margin-bottom: var(--space-2);
    }

    .idea-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--neutral-500);
    }

    .stats {
      display: flex;
      gap: var(--space-2);
    }

    .idea-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .btn {
      padding: var(--space-1) var(--space-2);
      border-radius: 4px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-outline {
      background-color: transparent;
      border: 1px solid var(--neutral-300);
      color: var(--neutral-700);
    }

    .btn-outline:hover {
      background-color: var(--neutral-50);
    }

    @media (max-width: 640px) {
      .idea-card {
        flex-direction: column;
      }

      .idea-actions {
        flex-direction: row;
      }

      .btn {
        flex: 1;
      }
    }
  `]
})
export class MyIdeasComponent {
  myIdeas: Idea[] = [
    {
      id: 1,
      title: "Mobile Branch Banking App",
      description: "A mobile app that brings all branch services to customers' phones, reducing wait times and improving service delivery.",
      status: 'implemented',
      votes: 89,
      comments: 23,
      timestamp: "Created 2 months ago"
    },
    {
      id: 2,
      title: "Smart Queue Management System",
      description: "Using IoT sensors and mobile app integration to manage branch queues efficiently and reduce wait times.",
      status: 'approved',
      votes: 45,
      comments: 12,
      timestamp: "Created 1 month ago"
    },
    {
      id: 3,
      title: "Branch Energy Optimization",
      description: "Implement smart lighting and climate control systems to reduce energy consumption in branches.",
      status: 'pending',
      votes: 12,
      comments: 5,
      timestamp: "Created 2 weeks ago"
    }
  ];
}