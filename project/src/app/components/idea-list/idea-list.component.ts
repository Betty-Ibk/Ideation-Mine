import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ThemeUtilsService } from '../../services/theme-utils.service';

interface Comment {
  text: string;
  author: string;
  authorId: string;
  timestamp: string;
}

interface Idea {
  id: number;
  title: string;
  description: string;
  votes: number;
  upvotes: number;
  downvotes: number;
  comments: number;
  author: string;
  authorId: string;
  timestamp: string;
  userVote: 'up' | 'down' | null;
  commentsList: Comment[];
}

@Component({
  selector: 'app-idea-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="main-content">
      <div class="container">
        <h2 class="page-title" style="color: #FF7A00">Recent Ideas</h2>
        <div class="ideas-list">
          @for (idea of ideas; track idea.id) {
            <div class="idea-card">
              <div class="idea-content">
                <h3 class="idea-title">{{idea.title}}</h3>
                <p class="idea-description">{{idea.description}}</p>
                <div class="idea-meta">
                  <span class="author">{{getDisplayName(idea.authorId, idea.author)}}</span>
                  <span class="timestamp">{{idea.timestamp}}</span>
                </div>
              </div>
              <div class="idea-actions">
                <button 
                  class="vote-button upvote" 
                  [class.voted]="idea.userVote === 'up'"
                  (click)="vote(idea, 'up')">
                  👍 {{idea.upvotes}}
                </button>
                <button 
                  class="vote-button downvote" 
                  [class.voted]="idea.userVote === 'down'"
                  (click)="vote(idea, 'down')">
                  👎 {{idea.downvotes}}
                </button>
                <button class="comment-button" (click)="viewComments(idea)">
                  💬 {{idea.commentsList.length}}
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </main>
    
    <!-- Comments Modal -->
    @if (selectedIdea) {
      <div class="modal-overlay">
        <div class="comments-modal">
          <div class="modal-header">
            <h3>Comments for "{{selectedIdea.title}}"</h3>
            <button class="close-btn" (click)="closeCommentsModal()">×</button>
          </div>
          <div class="comments-list">
            @if (selectedIdea.commentsList.length === 0) {
              <div class="no-comments">
                No comments yet.
              </div>
            }
            @for (comment of getVisibleComments(); track comment.timestamp) {
              <div class="comment-item">
                <div class="comment-header">
                  <span class="comment-author">{{getDisplayName(comment.authorId, comment.author)}}</span>
                  <span class="comment-time">{{comment.timestamp}}</span>
                </div>
                <div class="comment-content">
                  <p>{{comment.text}}</p>
                </div>
              </div>
            }
            @if (currentPage < totalPages - 1) {
              <div class="pagination-controls">
                <button class="btn btn-outline" (click)="nextPage()">Next</button>
              </div>
            }
            @if (currentPage > 0) {
              <div class="pagination-controls">
                <button class="btn btn-outline" (click)="prevPage()">Previous</button>
              </div>
            }
          </div>
          
          <!-- Add Comment Form -->
          <div class="add-comment-form">
            <h4>Add a Comment</h4>
            <textarea 
              [(ngModel)]="newComment" 
              placeholder="Write your comment here..." 
              rows="3"
              class="comment-input"
            ></textarea>
            <button 
              class="btn btn-primary" 
              [disabled]="!newComment.trim()" 
              (click)="addComment()"
            >
              Submit Comment
            </button>
          </div>
        </div>
      </div>
    }
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
      border: 1px solid var(--primary-200);
      border-radius: 4px;
      background-color: var(--primary-500);
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .vote-button:hover,
    .comment-button:hover {
      background-color: var(--primary-600);
    }

    .vote-button.upvote.voted {
      background-color: var(--primary-600);
      color: white;
      border-color: var(--primary-700);
    }
    
    .vote-button.downvote.voted {
      background-color: var(--neutral-600);
      color: white;
      border-color: var(--neutral-700);
    }
    
    /* Modal styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .comments-modal {
      background-color: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-3);
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--neutral-500);
    }
    
    .comments-list {
      padding: var(--space-3);
    }
    
    .comment-item {
      margin-bottom: var(--space-3);
      padding-bottom: var(--space-3);
      border-bottom: 1px solid var(--neutral-100);
    }
    
    .comment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--space-1);
    }
    
    .comment-author {
      font-weight: 500;
      color: var(--neutral-700);
    }
    
    .comment-time {
      font-size: 0.75rem;
      color: var(--neutral-500);
    }
    
    .comment-content p {
      margin: 0;
      color: var(--neutral-600);
    }
    
    .no-comments {
      text-align: center;
      color: var(--neutral-500);
      padding: var(--space-4);
    }
    
    .pagination-controls {
      display: flex;
      justify-content: center;
      margin-top: var(--space-3);
    }
    
    .pagination-controls .btn {
      margin: 0 var(--space-2);
      padding: 6px 12px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      background-color: white;
      color: var(--neutral-700);
      border: 1px solid var(--neutral-300);
    }
    
    .pagination-controls .btn:hover {
      background-color: var(--neutral-50);
    }
    
    .btn-primary {
      background-color: var(--primary-500);
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .btn-primary:hover {
      background-color: var(--primary-600);
    }
    
    .btn-outline {
      background-color: white;
      color: var(--neutral-700);
      border: 1px solid var(--neutral-300);
    }
    
    .add-comment-form {
      padding: var(--space-3);
      border-top: 1px solid var(--neutral-200);
      margin-top: var(--space-3);
    }
    
    .add-comment-form h4 {
      margin-top: 0;
      margin-bottom: var(--space-2);
      color: var(--neutral-700);
    }
    
    .comment-input {
      width: 100%;
      padding: var(--space-2);
      border: 1px solid var(--neutral-300);
      border-radius: 4px;
      margin-bottom: var(--space-2);
      font-family: inherit;
      resize: vertical;
    }
    
    .comment-input:focus {
      outline: none;
      border-color: var(--primary-400);
      box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
    }

    /* Dark theme support */
    :host-context([data-theme="dark"]) .idea-card {
      background-color: var(--card-bg);
      color: var(--card-text);
    }
    
    :host-context([data-theme="dark"]) .idea-title,
    :host-context([data-theme="dark"]) .idea-description,
    :host-context([data-theme="dark"]) .idea-meta {
      color: var(--card-text);
    }
    
    /* Orange buttons in dark mode */
    :host-context([data-theme="dark"]) .vote-button,
    :host-context([data-theme="dark"]) .comment-button {
      background-color: var(--primary-500);
      color: white;
      border-color: var(--primary-600);
    }
    
    :host-context([data-theme="dark"]) .vote-button:hover,
    :host-context([data-theme="dark"]) .comment-button:hover {
      background-color: var(--primary-600);
      color: white;
    }
    
    /* Ensure voted buttons have distinct styling */
    :host-context([data-theme="dark"]) .vote-button.upvote.voted,
    :host-context([data-theme="dark"]) .vote-button.downvote.voted {
      background-color: var(--primary-700);
      color: white;
      border-color: var(--primary-800);
    }
    
    /* Modal styling in dark mode */
    :host-context([data-theme="dark"]) .modal-overlay {
      background-color: rgba(0, 0, 0, 0.7);
    }
    
    :host-context([data-theme="dark"]) .modal-content {
      background-color: var(--card-bg);
      color: var(--card-text);
    }
    
    :host-context([data-theme="dark"]) .btn-primary {
      background-color: var(--primary-500);
      color: white;
    }
    
    :host-context([data-theme="dark"]) .btn-primary:hover {
      background-color: var(--primary-600);
    }
    
    :host-context([data-theme="dark"]) .comment-input {
      background-color: var(--bg-tertiary);
      color: var(--card-text);
      border-color: var(--border-color);
    }
  `]
})
export class IdeaListComponent implements OnInit {
  ideas: Idea[] = [
    {
      id: 1,
      title: "Digital Branch Transformation",
      description: "Redesign branch layout with digital-first approach, including self-service kiosks and video banking stations.",
      votes: 45,
      upvotes: 45,
      downvotes: 0,
      comments: 3,
      author: "Branch Innovation Team",
      authorId: "EMP3001",
      timestamp: "Posted 3 days ago",
      userVote: null,
      commentsList: [
        { text: "This would greatly improve customer experience!", author: "Branch Manager", authorId: "EMP3002", timestamp: "2 days ago" },
        { text: "We should pilot this in our downtown location first.", author: "Regional Director", authorId: "EMP3003", timestamp: "1 day ago" },
        { text: "I've seen similar implementations at competitor banks.", author: "Market Analyst", authorId: "EMP3004", timestamp: "12 hours ago" }
      ]
    },
    {
      id: 2,
      title: "Branch Staff Mobile App",
      description: "Create a mobile app for branch staff to access customer information, process transactions, and provide service anywhere in the branch.",
      votes: 38,
      upvotes: 38,
      downvotes: 0,
      comments: 2,
      author: "Digital Solutions Team",
      authorId: "EMP3005",
      timestamp: "Posted 5 days ago",
      userVote: null,
      commentsList: [
        { text: "This would eliminate the need for fixed teller stations!", author: "Operations Manager", authorId: "EMP3006", timestamp: "4 days ago" },
        { text: "We need to ensure strong security measures for this.", author: "IT Security", authorId: "EMP3007", timestamp: "3 days ago" }
      ]
    },
    {
      id: 3,
      title: "Community Hub Branches",
      description: "Transform branches into community hubs with co-working spaces, financial education centers, and event areas.",
      votes: 32,
      upvotes: 32,
      downvotes: 0,
      comments: 2,
      author: "Community Relations",
      authorId: "EMP3008",
      timestamp: "Posted 1 week ago",
      userVote: null,
      commentsList: [
        { text: "This could really differentiate us from online-only banks.", author: "Marketing Director", authorId: "EMP3009", timestamp: "6 days ago" },
        { text: "We should partner with local businesses for this initiative.", author: "Partnership Manager", authorId: "EMP3010", timestamp: "5 days ago" }
      ]
    }
  ];

  selectedIdea: Idea | null = null;
  commentsPerPage = 2; // Show 2 comments per page
  currentPage = 0;
  totalPages = 0;
  newComment: string = '';
  isAdmin: boolean = false;
  currentUser: any;

  constructor(
    private authService: AuthService,
    private themeUtils: ThemeUtilsService
  ) {}
  
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
    
    // Update comments count to match commentsList length
    this.ideas.forEach(idea => {
      idea.comments = idea.commentsList.length;
    });

    // Apply dark mode styling
    this.themeUtils.applyDarkModeStyles('.idea-card');
    
    // Listen for theme changes
    this.themeUtils.setupThemeChangeListener('.idea-card');
  }
  
  getDisplayName(authorId: string, authorName: string): string {
    // If user is admin, show employee ID
    if (this.isAdmin) {
      return `Employee ${authorId}`;
    }
    // For regular users, show anonymous identifier
    return `Anonymous User ${authorId.substring(authorId.length - 4)}`;
  }

  vote(idea: Idea, voteType: 'up' | 'down') {
    if (idea.userVote === voteType) {
      // If clicking the same vote type, remove the vote
      if (voteType === 'up') {
        idea.upvotes--;
      } else {
        idea.downvotes--;
      }
      idea.userVote = null;
    } else if (idea.userVote === (voteType === 'up' ? 'down' : 'up')) {
      // If changing vote from opposite type
      if (voteType === 'up') {
        idea.upvotes++;
        idea.downvotes--;
      } else {
        idea.downvotes++;
        idea.upvotes--;
      }
      idea.userVote = voteType;
    } else {
      // If voting for the first time
      if (voteType === 'up') {
        idea.upvotes++;
      } else {
        idea.downvotes++;
      }
      idea.userVote = voteType;
    }
    
    // Update total votes
    idea.votes = idea.upvotes - idea.downvotes;
  }

  viewComments(idea: Idea) {
    this.selectedIdea = idea;
    this.currentPage = 0;
    this.calculateTotalPages();
    this.newComment = '';
  }

  closeCommentsModal() {
    this.selectedIdea = null;
    this.currentPage = 0;
    this.newComment = '';
  }
  
  calculateTotalPages(): void {
    if (!this.selectedIdea) return;
    
    this.totalPages = Math.ceil(this.selectedIdea.commentsList.length / this.commentsPerPage);
  }
  
  getVisibleComments(): Comment[] {
    if (!this.selectedIdea) return [];
    
    const start = this.currentPage * this.commentsPerPage;
    const end = start + this.commentsPerPage;
    
    return this.selectedIdea.commentsList.slice(start, end);
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }
  
  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }
  
  addComment(): void {
    if (!this.selectedIdea || !this.newComment.trim() || !this.currentUser) return;
    
    // Create new comment
    const newComment: Comment = {
      text: this.newComment.trim(),
      authorId: this.currentUser.id || 'EMP3011',
      author: this.currentUser.name || 'Anonymous',
      timestamp: 'Just now'
    };
    
    // Add to the beginning of the comments list
    this.selectedIdea.commentsList.unshift(newComment);
    
    // Update the comments count
    this.selectedIdea.comments = this.selectedIdea.commentsList.length;
    
    // Reset form and recalculate pages
    this.newComment = '';
    this.calculateTotalPages();
    this.currentPage = 0; // Go to first page to see the new comment
  }
}








