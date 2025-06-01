import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeUtilsService } from '../../services/theme-utils.service';
import { AuthService } from '../../services/auth.service';

interface Comment {
  text: string;
  authorId: string;
  authorName: string;
  timestamp: string;
}

interface Idea {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'implemented';
  upvotes: number;
  downvotes: number;
  timestamp: string;
  userVote: 'up' | 'down' | null;
  authorId: string;
  authorName: string;
  commentsList: Comment[];
}

@Component({
  selector: 'app-my-ideas',
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="main-content">
      <div class="container">
        <h2 class="page-title" style="color: #FF7A00">My Ideas</h2>
        <div class="ideas-list">
          @for (idea of myIdeas; track idea.id) {
            <div class="idea-card">
              <div class="idea-content">
                <div class="idea-header">
                  <h3 class="idea-title">{{idea.title}}</h3>
                  <span class="idea-status" [class]="idea.status">{{idea.status}}</span>
                </div>
                <p class="idea-description">{{idea.description}}</p>
                <div class="idea-meta">
                  <span class="timestamp">{{idea.timestamp}} by {{getDisplayName(idea.authorId, idea.authorName)}}</span>
                  <span class="stats">
                    <span class="votes">👍 {{idea.upvotes}} 👎 {{idea.downvotes}}</span>
                    <span class="comments">💬 {{idea.commentsList.length}} comments</span>
                  </span>
                </div>
              </div>
              <div class="idea-actions">
                <button class="btn btn-primary">Edit</button>
                <div class="vote-actions">
                  <button 
                    class="vote-btn upvote" 
                    [class.voted]="idea.userVote === 'up'"
                    (click)="vote(idea, 'up')"
                  >
                    👍 {{idea.upvotes}}
                  </button>
                  <button 
                    class="vote-btn downvote" 
                    [class.voted]="idea.userVote === 'down'"
                    (click)="vote(idea, 'down')"
                  >
                    👎 {{idea.downvotes}}
                  </button>
                </div>
                <button class="btn btn-outline" (click)="viewComments(idea)">Comments</button>
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
            } @else {
              @for (comment of getVisibleComments(); track comment.timestamp) {
                <div class="comment-item">
                  <div class="comment-header">
                    <span class="comment-author">{{getDisplayName(comment.authorId, comment.authorName)}}</span>
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
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      text-transform: uppercase;
    }
    
    .idea-status.pending {
      background-color: var(--neutral-100);
      color: var(--neutral-600);
    }
    
    .idea-status.approved {
      background-color: #dcfce7;
      color: #15803d;
    }
    
    .idea-status.implemented {
      background-color: var(--primary-100);
      color: var(--primary-700);
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
    
    .idea-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    
    .btn {
      padding: 6px 12px;
      border-radius: 4px;
      font-weight: 500;
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
      background-color: white;
      color: var(--neutral-700);
      border: 1px solid var(--neutral-300);
    }
    
    .btn-outline:hover {
      background-color: var(--neutral-50);
    }
    
    .vote-actions {
      display: flex;
      gap: var(--space-2);
      margin-top: var(--space-2);
    }
    
    .vote-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid var(--neutral-200);
      background-color: white;
      color: var(--neutral-600);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .vote-btn:hover {
      background-color: var(--neutral-50);
    }
    
    .vote-btn.voted.upvote {
      background-color: var(--primary-50);
      color: var(--primary-600);
      border-color: var(--primary-200);
    }
    
    .vote-btn.voted.downvote {
      background-color: #fee2e2;
      color: #dc2626;
      border-color: #fecaca;
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

    .pagination-controls {
      display: flex;
      justify-content: center;
      margin-top: var(--space-3);
    }
    
    .pagination-controls .btn {
      margin: 0 var(--space-2);
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
    
    /* Status badges in dark mode - deeper colors with white text */
    :host-context([data-theme="dark"]) .idea-status.pending {
      background-color: #4B5563; /* Deeper neutral */
      color: white;
    }
    
    :host-context([data-theme="dark"]) .idea-status.approved {
      background-color: #15803D; /* Deeper green */
      color: white;
    }
    
    :host-context([data-theme="dark"]) .idea-status.implemented {
      background-color: var(--primary-700); /* Deeper orange */
      color: white;
    }
    
    /* Button styling in dark mode */
    :host-context([data-theme="dark"]) .btn-primary {
      background-color: var(--primary-500);
      color: white;
      border: none;
    }
    
    :host-context([data-theme="dark"]) .btn-primary:hover {
      background-color: var(--primary-600);
    }
    
    :host-context([data-theme="dark"]) .btn-outline {
      background-color: #3a3a3a;
      color: white;
      border: 1px solid #4a4a4a;
    }
    
    :host-context([data-theme="dark"]) .btn-outline:hover {
      background-color: #4a4a4a;
    }
    
    /* Vote buttons in dark mode */
    :host-context([data-theme="dark"]) .vote-btn {
      background-color: #3a3a3a;
      color: white;
      border: 1px solid #4a4a4a;
    }
    
    :host-context([data-theme="dark"]) .vote-btn:hover {
      background-color: #4a4a4a;
    }
    
    /* Upvote button - light orange */
    :host-context([data-theme="dark"]) .vote-btn.upvote {
      background-color: #FF9E44;
      color: #1a1a1a;
      border-color: #FF8A20;
    }
    
    :host-context([data-theme="dark"]) .vote-btn.upvote:hover {
      background-color: #FF8A20;
    }
    
    /* Downvote button - light grey */
    :host-context([data-theme="dark"]) .vote-btn.downvote {
      background-color: #4a4a4a;
      color: white;
      border-color: #5a5a5a;
    }
    
    :host-context([data-theme="dark"]) .vote-btn.downvote:hover {
      background-color: #5a5a5a;
    }
    
    /* Voted state styling */
    :host-context([data-theme="dark"]) .vote-btn.voted.upvote {
      background-color: #FF7A00;
      color: white;
      border-color: #E66D00;
    }
    
    :host-context([data-theme="dark"]) .vote-btn.voted.downvote {
      background-color: #3a3a3a;
      color: white;
      border-color: #4a4a4a;
    }
    
    /* Modal styling */
    :host-context([data-theme="dark"]) .comments-modal {
      background-color: var(--card-bg);
      color: var(--card-text);
    }
    
    :host-context([data-theme="dark"]) .modal-header {
      border-color: #3a3a3a;
    }
    
    :host-context([data-theme="dark"]) .comment-input {
      background-color: #3a3a3a;
      color: white;
      border-color: #4a4a4a;
    }
    
    :host-context([data-theme="dark"]) .comment-input:focus {
      border-color: var(--primary-500);
      box-shadow: 0 0 0 2px rgba(255, 122, 0, 0.2);
    }
    
    :host-context([data-theme="dark"]) .comment-item {
      border-color: #3a3a3a;
    }
  `]
})
export class MyIdeasComponent implements OnInit {
  myIdeas: Idea[] = [
    {
      id: 1,
      title: "Mobile Branch Banking App",
      description: "A mobile app that brings all branch services to customers' phones, reducing wait times and improving service delivery.",
      status: 'implemented',
      upvotes: 89,
      downvotes: 0,
      timestamp: "Created 2 months ago",
      userVote: null,
      authorId: "EMP1001",
      authorName: "Temitayo",
      commentsList: [
        {text: "Great idea! This will really help our customers.", authorId: "EMP1002", authorName: "Jane Smith", timestamp: "1 month ago"},
        {text: "We should prioritize this for Q3.", authorId: "EMP1003", authorName: "John Doe", timestamp: "3 weeks ago"},
        {text: "The tech team is already working on this.", authorId: "EMP1004", authorName: "Tech Lead", timestamp: "2 weeks ago"}
      ]
    },
    {
      id: 2,
      title: "Smart Queue Management System",
      description: "Using IoT sensors and mobile app integration to manage branch queues efficiently and reduce wait times.",
      status: 'approved',
      upvotes: 45,
      downvotes: 0,
      timestamp: "Created 1 month ago",
      userVote: null,
      authorId: "EMP1001",
      authorName: "Temitayo Awolowo",
      commentsList: [
        {text: "This is a great solution! I've seen similar systems in other banks.", authorId: "EMP1005", authorName: "Alice Johnson", timestamp: "2 months ago"},
        {text: "I'm excited to see this in action! Let's get it started.", authorId: "EMP1006", authorName: "Bob Brown", timestamp: "1 month ago"}
      ]
    },
    {
      id: 3,
      title: "Branch Energy Optimization",
      description: "Implement smart lighting and climate control systems to reduce energy consumption in branches.",
      status: 'pending',
      upvotes: 12,
      downvotes: 0,
      timestamp: "Created 2 weeks ago",
      userVote: null,
      authorId: "EMP1001",
      authorName: "Temitayo",
      commentsList: [
        {text: "This is a great idea! Energy savings are important.", authorId: "EMP1007", authorName: "Charlie Davis", timestamp: "1 week ago"},
        {text: "I'm concerned about the initial cost. Can you provide more details?", authorId: "EMP1008", authorName: "Diana White", timestamp: "2 days ago"}
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
  
  vote(idea: Idea, voteType: 'up' | 'down'): void {
    // If user already voted the same way, remove the vote
    if (idea.userVote === voteType) {
      if (voteType === 'up') {
        idea.upvotes--;
      } else {
        idea.downvotes--;
      }
      idea.userVote = null;
    } 
    // If user voted the opposite way, switch the vote
    else if (idea.userVote) {
      if (voteType === 'up') {
        idea.downvotes--;
        idea.upvotes++;
      } else {
        idea.upvotes--;
        idea.downvotes++;
      }
      idea.userVote = voteType;
    } 
    // If user hasn't voted yet, add a new vote
    else {
      if (voteType === 'up') {
        idea.upvotes++;
      } else {
        idea.downvotes++;
      }
      idea.userVote = voteType;
    }
  }
  
  viewComments(idea: Idea): void {
    this.selectedIdea = idea;
    this.currentPage = 0;
    this.calculateTotalPages();
    this.newComment = '';
  }
  
  closeCommentsModal(): void {
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
      authorId: this.currentUser.id || 'EMP1001',
      authorName: this.currentUser.name || 'Anonymous',
      timestamp: 'Just now'
    };
    
    // Add to the beginning of the comments list
    this.selectedIdea.commentsList.unshift(newComment);
    
    // Reset form and recalculate pages
    this.newComment = '';
    this.calculateTotalPages();
    this.currentPage = 0; // Go to first page to see the new comment
  }
}






























