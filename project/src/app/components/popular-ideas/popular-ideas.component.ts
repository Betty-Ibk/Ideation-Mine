import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface Comment {
  author: string;
  authorId: string;
  text: string;
  timestamp: string;
}

interface Idea {
  id: number;
  title: string;
  description: string;
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
  selector: 'app-popular-ideas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="main-content">
      <div class="container">
        <h2 class="page-title">Popular Ideas</h2>
        <div class="ideas-list">
          @for (idea of popularIdeas; track idea.id) {
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
                  ⬆ {{idea.upvotes}}
                </button>
                <button 
                  class="vote-button downvote" 
                  [class.voted]="idea.userVote === 'down'"
                  (click)="vote(idea, 'down')">
                  ⬇ {{idea.downvotes}}
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
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 var(--space-4);
    }
    
    .page-title {
      margin-bottom: var(--space-4);
      color: var(--neutral-800);
      font-size: 1.75rem;
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
      flex-direction: column;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
    }
    
    .idea-content {
      flex: 1;
    }
    
    .idea-title {
      font-size: 1.125rem;
      margin: 0 0 var(--space-2) 0;
      color: var(--neutral-800);
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
      gap: var(--space-2);
      margin-top: var(--space-2);
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

    .vote-button.upvote.voted {
      background-color: var(--primary-50);
      color: var(--primary-700);
      border-color: var(--primary-200);
    }
    
    .vote-button.downvote.voted {
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
    
    .pagination-controls {
      display: flex;
      justify-content: center;
      margin-top: var(--space-3);
    }
    
    .add-comment-form {
      padding: var(--space-3);
      border-top: 1px solid var(--neutral-200);
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
      box-shadow: 0 0 0 2px rgba(255, 122, 0, 0.1);
    }
    
    /* Dark theme support */
    :host-context([data-theme="dark"]) .idea-card {
      background-color: var(--card-bg);
      color: var(--text-primary);
    }
    
    :host-context([data-theme="dark"]) .comments-modal {
      background-color: var(--bg-secondary);
      color: var(--text-primary);
    }
    
    :host-context([data-theme="dark"]) .vote-button,
    :host-context([data-theme="dark"]) .comment-button {
      background-color: var(--bg-tertiary);
      color: var(--text-secondary);
      border-color: var(--border-color);
    }
    
    :host-context([data-theme="dark"]) .comment-input {
      background-color: var(--bg-tertiary);
      color: var(--text-primary);
      border-color: var(--border-color);
    }
    
    @media (max-width: 640px) {
      .idea-actions {
        flex-wrap: wrap;
      }
    }
  `]
})export class PopularIdeasComponent implements OnInit {
  popularIdeas: Idea[] = [
    {
      id: 1,
      title: "AI-Powered Customer Service Chatbot",
      description: "Implement an advanced AI chatbot to handle routine customer inquiries and provide 24/7 support.",
      upvotes: 156,
      downvotes: 10,
      comments: 2,
      author: "Tech Innovation Team",
      authorId: "EMP2001",
      timestamp: "2 days ago",
      userVote: null,
      commentsList: [
        { author: "User1", authorId: "EMP2002", text: "Great idea! I love AI chatbots.", timestamp: "2 days ago" },
        { author: "User2", authorId: "EMP2003", text: "This could be really helpful for customer support.", timestamp: "1 day ago" }
      ]
    },
    {
      id: 2,
      title: "Biometric Authentication System",
      description: "Enhance security with multi-factor biometric authentication including fingerprint and facial recognition.",
      upvotes: 142,
      downvotes: 5,
      comments: 2,
      author: "Security Department",
      authorId: "EMP2004",
      timestamp: "3 days ago",
      userVote: null,
      commentsList: [
        { author: "User3", authorId: "EMP2005", text: "This is a great security enhancement.", timestamp: "3 days ago" },
        { author: "User4", authorId: "EMP2006", text: "I'm concerned about privacy with biometric data.", timestamp: "2 days ago" }
      ]
    },
    {
      id: 3,
      title: "Virtual Reality Banking Experience",
      description: "Create immersive VR banking environments for remote customer consultations and financial planning.",
      upvotes: 128,
      downvotes: 8,
      comments: 2,
      author: "Digital Experience Team",
      authorId: "EMP2007",
      timestamp: "4 days ago",
      userVote: null,
      commentsList: [
        { author: "User5", authorId: "EMP2008", text: "VR could revolutionize banking! Exciting!", timestamp: "4 days ago" },
        { author: "User6", authorId: "EMP2009", text: "I'm not sure about VR for banking. It seems a bit futuristic.", timestamp: "3 days ago" }
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

  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
    
    // Update comments count to match commentsList length
    this.popularIdeas.forEach(idea => {
      idea.comments = idea.commentsList.length;
    });
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
      authorId: this.currentUser.id || 'EMP2010',
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


















