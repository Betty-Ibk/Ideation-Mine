import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Idea {
  id: number;
  title: string;
  description: string;
  votes: number;
  comments: number;
  author: string;
  timestamp: string;
  hasVoted: boolean;
}

@Component({
  selector: 'app-idea-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="main-content">
      <div class="container">
        <div class="content">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">10</div>
              <div class="stat-label">Ideas Submitted</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">45</div>
              <div class="stat-label">Total Votes</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">23</div>
              <div class="stat-label">Comments Made</div>
            </div>
          </div>

          <div class="ideas-section">
            <div class="section-header">
              <h2>Recent Ideas</h2>
              <button class="btn btn-text">View All</button>
            </div>

            <div class="ideas-list">
              <div *ngFor="let idea of ideas" class="idea-card">
                <div class="idea-content">
                  <h3 class="idea-title">{{idea.title}}</h3>
                  <p class="idea-description">{{idea.description}}</p>
                  <div class="idea-meta">
                    <span class="author">{{idea.author}}</span>
                    <span class="timestamp">{{idea.timestamp}}</span>
                  </div>
                </div>
                <div class="idea-actions">
                  <button 
                    class="vote-button" 
                    [class.voted]="idea.hasVoted"
                    (click)="toggleVote(idea)">
                    ⬆ {{idea.votes}}
                  </button>
                  <button class="comment-button">
                    💬 {{idea.comments}}
                  </button>
                </div>
              </div>
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

    .container {
      display: block;
    }

    .content {
      width: 100%;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-4);
      margin-bottom: var(--space-4);
    }

    .stat-card {
      background-color: white;
      padding: var(--space-3);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-500);
    }

    .stat-label {
      color: var(--neutral-600);
      font-size: 0.875rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-3);
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

    .idea-title {
      font-size: 1.125rem;
      margin-bottom: var(--space-1);
    }

    .idea-description {
      color: var(--neutral-600);
      font-size: 0.875rem;
      margin-bottom: var(--space-2);
    }

    .idea-meta {
      display: flex;
      gap: var(--space-2);
      font-size: 0.75rem;
      color: var(--neutral-500);
    }

    .idea-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .vote-button,
    .comment-button {
      padding: var(--space-1) var(--space-2);
      border: 1px solid var(--neutral-200);
      border-radius: 4px;
      background-color: white;
      color: var(--neutral-700);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .vote-button:hover,
    .comment-button:hover {
      background-color: var(--neutral-50);
    }

    .vote-button.voted {
      background-color: var(--primary-50);
      color: var(--primary-700);
      border-color: var(--primary-200);
    }

    @media (max-width: 992px) {
      /* Remove the grid-template-columns style */
    }

    @media (max-width: 768px) {
      /* Remove the grid-template-columns style */
      
      /* Remove the sidebar display: none style */
    }
  `]
})
export class IdeaListComponent {
  ideas: Idea[] = [
    {
      id: 1,
      title: "Smart Queue Management System",
      description: "Implement AI-powered queue management to predict peak hours and optimize staff allocation in branches.",
      votes: 42,
      comments: 12,
      author: "Sarah Johnson",
      timestamp: "2 hours ago",
      hasVoted: false
    },
    {
      id: 2,
      title: "Digital Document Verification",
      description: "Use blockchain for secure and instant document verification, reducing processing time by 80%.",
      votes: 38,
      comments: 8,
      author: "Michael Chen",
      timestamp: "4 hours ago",
      hasVoted: true
    },
    {
      id: 3,
      title: "Interactive Banking Kiosks",
      description: "Install interactive kiosks with video banking capabilities for remote expert consultations.",
      votes: 27,
      comments: 15,
      author: "Alex Thompson",
      timestamp: "6 hours ago",
      hasVoted: false
    }
  ];

  toggleVote(idea: Idea) {
    idea.hasVoted = !idea.hasVoted;
    idea.votes += idea.hasVoted ? 1 : -1;
  }
}

