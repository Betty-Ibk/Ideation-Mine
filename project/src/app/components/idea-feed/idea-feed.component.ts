import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IdeaService, IdeaPost } from '../../services/idea.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-idea-feed',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <main class="main-content">
      <div class="container">
        <h1 class="page-title">Idea Feed</h1>
        
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
            
            <div class="idea-tags">
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
              
              <div class="idea-author">
                <span>Anonymous ({{ idea.authorHash }})</span>
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
    }
    
    .idea-content {
      color: var(--neutral-700);
      font-size: 0.875rem;
      line-height: 1.5;
      margin-bottom: var(--space-3);
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
    
    .vote-btn.upvote svg,
    .vote-btn.downvote svg {
      transition: transform 0.3s ease;
    }
    
    .vote-btn.upvote:active svg {
      transform: translateY(-2px);
    }
    
    .vote-btn.downvote:active svg {
      transform: translateY(2px);
    }
    
    .idea-author {
      font-size: 0.75rem;
      color: var(--neutral-500);
    }
    
    @media (max-width: 640px) {
      .filters {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-container {
        max-width: 100%;
      }
    }
    
    /* Add styles for attachments */
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
  `]
})
export class IdeaFeedComponent implements OnInit, OnDestroy {
  filteredIdeas: IdeaPost[] = [];
  ideas: IdeaPost[] = [];
  categories: string[] = ['All', 'Staff Welfare', 'Training', 'Technology', 'HR', 'Other'];
  selectedCategory: string = 'All';
  searchQuery: string = '';
  private subscription: Subscription = new Subscription();
  
  constructor(private ideaService: IdeaService) {}
  
  ngOnInit(): void {
    this.subscription = this.ideaService.getIdeas().subscribe(ideas => {
      this.ideas = ideas;
      this.applyFilters();
    });
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
        const hasCategoryTag = idea.tags.some(tag => 
          tag.toLowerCase().includes(this.selectedCategory.toLowerCase())
        );
        if (!hasCategoryTag) return false;
      }
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        return (
          idea.title.toLowerCase().includes(query) ||
          idea.content.toLowerCase().includes(query) ||
          idea.tags.some(tag => tag.toLowerCase().includes(query))
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
}
