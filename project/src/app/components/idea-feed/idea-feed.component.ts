import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IdeaService, IdeaPost } from '../../services/idea.service';
import { ThemeUtilsService } from '../../services/theme-utils.service';
import { Subscription } from 'rxjs';

// Define Comment interface locally if not imported from service
interface Comment {
  text: string;
  author: string;
  authorHash: string;
  timestamp: string;
}

@Component({
  selector: 'app-idea-feed',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <main class="main-content">
      <div class="container">
        <h1 class="page-title" style="color: #FF7A00">Idea Feed</h1>
        
        <div class="filters">
          <div class="category-filters">
            <button 
              *ngFor="let category of categories" 
              class="category-pill"
              [class.active]="selectedCategory === category"
              (click)="filterByCategory(category)"
            >
              {{ category }}
            </button>
          </div>
          
          <div class="search-container">
            <input 
              type="text" 
              placeholder="Search ideas..." 
              class="search-input"
              [(ngModel)]="searchQuery"
              (input)="searchIdeas()"
            >
          </div>
        </div>
        
        <div class="idea-feed">
          <div *ngFor="let idea of filteredIdeas" class="idea-card">
            <div class="idea-header">
              <h3 class="idea-title">{{ idea.title }}</h3>
              <span class="idea-time">{{ idea.timestamp }}</span>
            </div>
            
            <div class="idea-tags" *ngIf="idea.tags && idea.tags.length > 0">
              <span *ngFor="let tag of idea.tags" class="idea-tag">
                #{{ tag }}
              </span>
            </div>
            
            <p class="idea-content">{{ idea.content }}</p>
            
            <!-- Attachments section -->
            <div *ngIf="idea.attachments && idea.attachments.length > 0" class="idea-attachments">
              <h4 class="attachments-title">Attachments ({{ idea.attachments.length }})</h4>
              <div class="attachments-list">
                <div *ngFor="let attachment of idea.attachments" class="attachment-item">
                  <span class="attachment-icon">📎</span>
                  <span class="attachment-name">{{ attachment.name }}</span>
                  <span class="attachment-size">({{ formatFileSize(attachment.size) }})</span>
                </div>
              </div>
            </div>
            
            <div class="idea-footer">
              <div class="vote-actions">
                <button 
                  class="vote-btn upvote" 
                  [class.voted]="idea.userVote === 'up'"
                  (click)="vote(idea, 'up')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M12 4l8 8h-6v8h-4v-8H4z"/>
                  </svg>
                  {{ idea.upvotes }}
                </button>
                
                <button 
                  class="vote-btn downvote" 
                  [class.voted]="idea.userVote === 'down'"
                  (click)="vote(idea, 'down')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M12 20l-8-8h6V4h4v8h6z"/>
                  </svg>
                  {{ idea.downvotes }}
                </button>
              </div>
              
              <div class="idea-actions">
                <button class="comment-btn" (click)="viewComments(idea)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                  </svg>
                  Comments {{ idea.comments?.length || 0 }}
                </button>
              </div>
              
              <div class="idea-author">
                <span>Anonymous ({{ idea.authorHash }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Comments Modal -->
      <div *ngIf="selectedIdea" class="comments-modal-overlay">
        <div class="comments-modal">
          <div class="comments-header">
            <h2 class="comments-title">Comments for "{{ selectedIdea.title }}"</h2>
            <button class="close-btn" (click)="closeCommentsModal()">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"/>
              </svg>
            </button>
          </div>
          <div class="comments-list">
            <div *ngIf="!selectedIdea.comments || selectedIdea.comments.length === 0" class="no-comments">
              No comments yet. Be the first to comment!
            </div>
            <div *ngFor="let comment of selectedIdea.comments" class="comment">
              <div class="comment-header">
                <span class="comment-author">{{ comment.author || 'Anonymous' }} ({{ comment.authorHash }})</span>
                <span class="comment-time">{{ comment.timestamp }}</span>
              </div>
              <div class="comment-content">{{ comment.text }}</div>
            </div>
          </div>
          <div class="comments-form">
            <textarea 
              class="comment-input" 
              [(ngModel)]="newComment" 
              placeholder="Add a comment..."
             
            ></textarea>
            <button class="comment-submit-btn" (click)="addComment()">Add Comment</button>
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
      max-width: 800px;
      margin: 0 auto;
      padding: 0 var(--space-4);
    }
    
    .page-title {
      margin-bottom: var(--space-4);
      color: var(--neutral-800);
      font-size: 1.75rem;
    }
    
    .filters {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
      flex-wrap: wrap;
      gap: var(--space-2);
    }
    
    .category-filters {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }
    
    .category-pill {
      padding: var(--space-1) var(--space-2);
      border-radius: 20px;
      background-color: var(--neutral-100);
      border: 1px solid var(--neutral-200);
      color: var(--neutral-700);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .category-pill.active {
      background-color: var(--primary-100);
      border-color: var(--primary-300);
      color: var(--primary-700);
    }
    
    .search-container {
      flex: 1;
      max-width: 300px;
    }
    
    .search-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--neutral-300);
      border-radius: 4px;
      font-size: 0.875rem;
    }
    
    .idea-feed {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    
    .idea-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      padding: var(--space-3);
      border-left: 4px solid var(--primary-400);
      margin-bottom: var(--space-3);
      overflow: hidden;
    }
    
    .idea-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-2);
    }
    
    .idea-title {
      margin: 0;
      font-size: 1.125rem;
      color: var(--neutral-800);
    }
    
    .idea-time {
      font-size: 0.75rem;
      color: var(--neutral-500);
    }
    
    .idea-tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-1);
      margin-bottom: var(--space-2);
    }
    
    .idea-tag {
      font-size: 0.75rem;
      color: var(--primary-600);
      background-color: var(--primary-50);
      padding: 2px 8px;
      border-radius: 12px;
      display: inline-block;
      margin-bottom: 4px;
    }
    
    .idea-content {
      color: var(--neutral-700);
      font-size: 0.875rem;
      line-height: 1.5;
      margin-bottom: var(--space-3);
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-word;
    }
    
    .idea-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .vote-actions {
      display: flex;
      gap: var(--space-2);
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
    
    .idea-author {
      font-size: 0.75rem;
      color: var(--neutral-500);
    }
    
    .idea-attachments {
      margin: var(--space-2) 0;
      padding: var(--space-2);
      background-color: var(--neutral-50);
      border-radius: 6px;
    }
    
    .attachments-title {
      font-size: 0.875rem;
      color: var(--neutral-700);
      margin-bottom: var(--space-1);
    }
    
    .attachments-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .attachment-item {
      display: flex;
      align-items: center;
      font-size: 0.75rem;
      color: var(--neutral-600);
    }
    
    .attachment-icon {
      margin-right: 4px;
    }
    
    .attachment-name {
      margin-right: 4px;
      font-weight: 500;
    }
    
    .attachment-size {
      color: var(--neutral-500);
    }
    
    .comment-btn {
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
    
    .comment-btn:hover {
      background-color: var(--neutral-50);
      color: var(--primary-600);
    }
    
    .idea-actions {
      display: flex;
      gap: var(--space-2);
      margin-left: var(--space-2);
    }
    
    /* Comments Modal Styles */
    .comments-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
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
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .comments-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-3);
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .comments-title {
      margin: 0;
      font-size: 1.25rem;
      color: var(--neutral-800);
    }
    
    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--neutral-500);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .comments-list {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-3);
      max-height: 50vh;
    }
    
    .no-comments {
      text-align: center;
      color: var(--neutral-500);
      padding: var(--space-4);
    }
    
    .comment {
      margin-bottom: var(--space-3);
      padding-bottom: var(--space-3);
      border-bottom: 1px solid var(--neutral-100);
    }
    
    .comment:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    
    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-1);
    }
    
    .comment-author {
      font-weight: 500;
      color: var(--neutral-800);
    }
    
    .comment-time {
      font-size: 0.75rem;
      color: var(--neutral-500);
    }
    
    .comment-content {
      color: var(--neutral-700);
      font-size: 0.875rem;
      line-height: 1.5;
    }
    
    .comments-form {
      display: flex;
      gap: var(--space-2);
      padding: var(--space-3);
      border-top: 1px solid var(--neutral-200);
    }
    
    .comment-input {
      flex: 1;
      padding: var(--space-2);
      border: 1px solid var(--neutral-300);
      border-radius: 4px;
      font-size: 0.875rem;
      resize: vertical;
      min-height: 60px;
    }
    
    .comment-submit-btn {
      padding: var(--space-2) var(--space-3);
      border: none;
      border-radius: 4px;
      background-color: var(--primary-500);
      color: white;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .comment-submit-btn:hover {
      background-color: var(--primary-600);
    }
    
    /* Enhanced Dark theme support */
    :host-context([data-theme="dark"]) .idea-card {
      background-color: var(--card-bg);
      color: var(--card-text);
    }
    
    :host-context([data-theme="dark"]) .idea-title,
    :host-context([data-theme="dark"]) .idea-content,
    :host-context([data-theme="dark"]) .idea-meta,
    :host-context([data-theme="dark"]) .idea-author {
      color: var(--card-text);
    }
    
    /* Orange buttons in dark mode */
    :host-context([data-theme="dark"]) .vote-btn,
    :host-context([data-theme="dark"]) .comment-btn {
      background-color: var(--primary-500);
      color: white;
      border-color: var(--primary-600);
    }
    
    :host-context([data-theme="dark"]) .vote-btn:hover,
    :host-context([data-theme="dark"]) .comment-btn:hover {
      background-color: var(--primary-600);
      color: white;
    }
    
    /* Ensure voted buttons have distinct styling */
    :host-context([data-theme="dark"]) .vote-btn.voted.upvote,
    :host-context([data-theme="dark"]) .vote-btn.voted.downvote {
      background-color: var(--primary-700);
      color: white;
      border-color: var(--primary-800);
    }
    
    :host-context([data-theme="dark"]) .comments-modal {
      background-color: var(--bg-secondary);
      color: var(--text-primary);
    }
    
    :host-context([data-theme="dark"]) .comments-title {
      color: var(--text-primary);
    }
    
    :host-context([data-theme="dark"]) .comment-content {
      color: var(--text-secondary);
    }
    
    :host-context([data-theme="dark"]) .category-pill {
      background-color: var(--bg-tertiary);
      color: var(--text-secondary);
      border-color: var(--border-color);
    }
    
    :host-context([data-theme="dark"]) .category-pill.active {
      background-color: var(--primary-600);
      color: white;
      border-color: var(--primary-700);
    }
    
    :host-context([data-theme="dark"]) .search-input {
      background-color: var(--bg-tertiary);
      color: var(--text-primary);
      border-color: var(--border-color);
    }
    
    :host-context([data-theme="dark"]) .idea-attachments {
      background-color: var(--bg-tertiary);
    }
    
    :host-context([data-theme="dark"]) .attachments-title {
      color: var(--text-primary);
    }
    
    :host-context([data-theme="dark"]) .attachment-item {
      color: var(--text-secondary);
    }
    
    :host-context([data-theme="dark"]) .idea-author,
    :host-context([data-theme="dark"]) .idea-time,
    :host-context([data-theme="dark"]) .comment-time {
      color: var(--text-tertiary);
    }
    
    @media (max-width: 640px) {
      .filters {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-container {
        max-width: 100%;
      }
      
      .comments-modal {
        width: 95%;
        height: 80vh;
      }
    }
  `]
})
export class IdeaFeedComponent implements OnInit, OnDestroy {
  filteredIdeas: IdeaPost[] = [];
  ideas: IdeaPost[] = [];
  categories: string[] = ['All', 'Welfare', 'Training', 'Technology', 'HR', 'Other'];
  selectedCategory: string = 'All';
  searchQuery: string = '';
  private subscription: Subscription = new Subscription();
  
  // New properties for comments functionality
  selectedIdea: IdeaPost | null = null;
  newComment: string = '';
  
  constructor(
    private ideaService: IdeaService,
    private themeUtils: ThemeUtilsService
  ) {}
  
  ngOnInit(): void {
    this.subscription = this.ideaService.getIdeas().subscribe(ideas => {
      this.ideas = ideas;
      
      // Debug: Log all ideas and their tags
      console.log('All ideas:', ideas);
      ideas.forEach(idea => {
        console.log(`Idea "${idea.title}" tags:`, idea.tags);
        
        // Check if tags exist and are properly formatted
        if (!idea.tags) {
          console.error(`Idea "${idea.title}" has no tags property`);
        } else if (!Array.isArray(idea.tags)) {
          console.error(`Idea "${idea.title}" tags is not an array:`, idea.tags);
        } else if (idea.tags.length === 0) {
          console.warn(`Idea "${idea.title}" has empty tags array`);
        }
      });
      
      this.applyFilters();
      
      // Apply dark mode styling
      this.themeUtils.applyDarkModeStyles('.idea-card');
    });
    
    // Listen for theme changes
    this.themeUtils.setupThemeChangeListener('.idea-card');
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }
  
  searchIdeas(): void {
    this.applyFilters();
  }
  
  applyFilters(): void {
    this.filteredIdeas = this.ideas.filter(idea => {
      // Apply category filter
      if (this.selectedCategory !== 'All') {
        // Ensure tags exist before filtering
        const ideaTags = idea.tags || [];
        const hasCategoryTag = ideaTags.some(tag => 
          tag.toLowerCase().includes(this.selectedCategory.toLowerCase())
        );
        if (!hasCategoryTag) return false;
      }
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        const ideaTags = idea.tags || [];
        return (
          idea.title.toLowerCase().includes(query) ||
          idea.content.toLowerCase().includes(query) ||
          ideaTags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  }
  
  vote(idea: IdeaPost, voteType: 'up' | 'down'): void {
    this.ideaService.voteIdea(idea.id, voteType);
  }
  
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  }
  
  viewComments(idea: IdeaPost): void {
    this.selectedIdea = idea;
    this.newComment = '';
    
    // Initialize comments array if it doesn't exist
    if (!this.selectedIdea.comments) {
      this.selectedIdea.comments = [];
    }
  }
  
  closeCommentsModal(): void {
    this.selectedIdea = null;
    this.newComment = '';
  }
  
  addComment(): void {
    if (!this.selectedIdea || !this.newComment.trim()) return;
    
    // Create new comment
    const comment: Comment = {
      text: this.newComment.trim(),
      author: 'You',
      authorHash: this.generateRandomHash(),
      timestamp: 'Just now'
    };
    
    // Initialize comments array if it doesn't exist
    if (!this.selectedIdea.comments) {
      this.selectedIdea.comments = [];
    }
    
    // Add to the beginning of the comments list
    this.selectedIdea.comments.unshift(comment);
    
    // Reset form
    this.newComment = '';
  }
  
  generateRandomHash(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  handleEnterKey(event: KeyboardEvent): void {
    if (!event.shiftKey) {
      event.preventDefault(); // Prevent default behavior (new line)
      this.addComment();
    }
  }
}







