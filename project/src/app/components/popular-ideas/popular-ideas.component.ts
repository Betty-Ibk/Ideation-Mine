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
  selector: 'app-popular-ideas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="main-content">
      <div class="container">
        <h2 class="page-title">Popular Ideas</h2>
        <div class="ideas-list">
          <div *ngFor="let idea of popularIdeas" class="idea-card">
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
  `]
})
export class PopularIdeasComponent {
  popularIdeas: Idea[] = [
    {
      id: 1,
      title: "AI-Powered Customer Service Chatbot",
      description: "Implement an advanced AI chatbot to handle routine customer inquiries and provide 24/7 support.",
      votes: 156,
      comments: 45,
      author: "Tech Innovation Team",
      timestamp: "2 days ago",
      hasVoted: false
    },
    {
      id: 2,
      title: "Biometric Authentication System",
      description: "Enhance security with multi-factor biometric authentication including fingerprint and facial recognition.",
      votes: 142,
      comments: 38,
      author: "Security Department",
      timestamp: "3 days ago",
      hasVoted: true
    },
    {
      id: 3,
      title: "Virtual Reality Banking Experience",
      description: "Create immersive VR banking environments for remote customer consultations and financial planning.",
      votes: 128,
      comments: 52,
      author: "Digital Experience Team",
      timestamp: "4 days ago",
      hasVoted: false
    }
  ];

  toggleVote(idea: Idea) {
    idea.hasVoted = !idea.hasVoted;
    idea.votes += idea.hasVoted ? 1 : -1;
  }
}