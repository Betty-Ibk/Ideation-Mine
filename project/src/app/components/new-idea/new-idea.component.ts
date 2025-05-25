import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { IdeaService } from '../../services/idea.service';

@Component({
  selector: 'app-new-idea',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <main class="main-content">
      <div class="container">
        <div class="new-idea-container">
          <h2 class="page-title">Submit New Idea</h2>
          
          <form [formGroup]="ideaForm" (ngSubmit)="onSubmit()" class="idea-form">
            <div class="form-group">
              <label for="title">Title</label>
              <input 
                type="text" 
                id="title" 
                formControlName="title"
                placeholder="Enter a clear, concise title for your idea"
              >
              <div *ngIf="title.invalid && (title.dirty || title.touched)" class="error-message">
                Title is required
              </div>
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea 
                id="description" 
                formControlName="description"
                rows="6"
                placeholder="Describe your idea in detail. What problem does it solve? How can it be implemented?"
              ></textarea>
              <div *ngIf="description.invalid && (description.dirty || description.touched)" class="error-message">
                Description is required (minimum 50 characters)
              </div>
            </div>

            <div class="form-group">
              <label for="category">Category</label>
              <select id="category" formControlName="category">
                <option value="">Select a category</option>
                <option value="technology">Technology & Innovation</option>
                <option value="customer-service">Customer Service</option>
                <option value="operations">Operations & Efficiency</option>
                <option value="security">Security & Compliance</option>
                <option value="sustainability">Sustainability</option>
                <option value="other">Other</option>
              </select>
              <div *ngIf="category.invalid && (category.dirty || category.touched)" class="error-message">
                Please select a category
              </div>
            </div>

            <div class="form-group">
              <label for="impact">Expected Impact</label>
              <select id="impact" formControlName="impact">
                <option value="">Select impact level</option>
                <option value="high">High - Transformative change</option>
                <option value="medium">Medium - Significant improvement</option>
                <option value="low">Low - Incremental improvement</option>
              </select>
              <div *ngIf="impact.invalid && (impact.dirty || impact.touched)" class="error-message">
                Please select expected impact
              </div>
            </div>

            <!-- Custom Hashtags -->
            <div class="form-group">
              <label>Hashtags</label>
              <div class="hashtags-container">
                <div class="hashtags-input-container">
                  <input 
                    type="text" 
                    placeholder="Add a hashtag and press Enter" 
                    [formControl]="hashtagInput"
                    (keydown.enter)="addHashtag($event)"
                    class="hashtag-input"
                  >
                </div>
                <div class="hashtags-list" *ngIf="hashtags.length > 0">
                  <span *ngFor="let tag of hashtags.controls; let i = index" class="hashtag-pill">
                    #{{ tag.value }}
                    <button type="button" class="remove-hashtag" (click)="removeHashtag(i)">×</button>
                  </span>
                </div>
              </div>
            </div>

            <!-- File Attachments -->
            <div class="form-group">
              <label>Attachments</label>
              <div class="file-upload-container">
                <label class="file-upload-label">
                  <input 
                    type="file" 
                    multiple 
                    (change)="onFileSelected($event)"
                    class="file-input"
                  >
                  <span class="file-upload-button">Choose Files</span>
                </label>
                <span class="file-upload-info">Max 5 files, 5MB each</span>
              </div>
              <div class="attachments-list" *ngIf="selectedFiles.length > 0">
                <div *ngFor="let file of selectedFiles; let i = index" class="attachment-item">
                  <span class="attachment-name">{{ file.name }}</span>
                  <span class="attachment-size">({{ formatFileSize(file.size) }})</span>
                  <button type="button" class="remove-attachment" (click)="removeFile(i)">×</button>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="resources">Required Resources</label>
              <textarea 
                id="resources" 
                formControlName="resources"
                rows="4"
                placeholder="What resources would be needed to implement this idea? (Optional)"
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="ideaForm.invalid || isSubmitting">
                {{ isSubmitting ? 'Submitting...' : 'Submit Idea' }}
              </button>
            </div>

            <div *ngIf="submitted" class="success-message">
              Your idea has been submitted successfully!
            </div>
          </form>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .main-content {
      padding: var(--space-4) 0;
    }

    .new-idea-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .page-title {
      margin-bottom: var(--space-4);
      color: var(--neutral-800);
      font-size: 1.5rem;
    }

    .idea-form {
      background-color: white;
      border-radius: 12px;
      padding: var(--space-4);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .form-group {
      margin-bottom: var(--space-3);
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--neutral-700);
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--neutral-300);
      border-radius: 6px;
      font-size: 0.875rem;
      color: var(--neutral-800);
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 2px rgba(255, 122, 0, 0.1);
    }

    .error-message {
      color: #dc2626;
      font-size: 0.75rem;
      margin-top: 4px;
    }

    .form-actions {
      display: flex;
      gap: var(--space-2);
      margin-top: var(--space-4);
    }

    .btn {
      padding: 10px 20px;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background-color: var(--primary-500);
      color: white;
      border: none;
      flex: 1;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--primary-600);
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-outline {
      background-color: transparent;
      border: 1px solid var(--neutral-300);
      color: var(--neutral-700);
    }

    .btn-outline:hover {
      background-color: var(--neutral-50);
    }

    .success-message {
      margin-top: var(--space-3);
      padding: var(--space-2);
      background-color: #dcfce7;
      color: #15803d;
      border-radius: 6px;
      text-align: center;
    }

    /* Hashtags styles */
    .hashtags-container {
      margin-top: 8px;
    }

    .hashtag-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--neutral-300);
      border-radius: 6px;
      font-size: 0.875rem;
    }

    .hashtags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }

    .hashtag-pill {
      display: inline-flex;
      align-items: center;
      background-color: var(--primary-50);
      color: var(--primary-700);
      padding: 4px 10px;
      border-radius: 16px;
      font-size: 0.75rem;
    }

    .remove-hashtag {
      background: none;
      border: none;
      color: var(--primary-700);
      margin-left: 4px;
      cursor: pointer;
      font-size: 1rem;
      line-height: 1;
      padding: 0 2px;
    }

    /* File upload styles */
    .file-upload-container {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .file-input {
      display: none;
    }

    .file-upload-button {
      display: inline-block;
      padding: 8px 16px;
      background-color: var(--neutral-100);
      border: 1px solid var(--neutral-300);
      border-radius: 4px;
      color: var(--neutral-700);
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .file-upload-button:hover {
      background-color: var(--neutral-200);
    }

    .file-upload-info {
      font-size: 0.75rem;
      color: var(--neutral-500);
    }

    .attachments-list {
      margin-top: 8px;
    }

    .attachment-item {
      display: flex;
      align-items: center;
      padding: 6px 10px;
      background-color: var(--neutral-50);
      border-radius: 4px;
      margin-bottom: 4px;
    }

    .attachment-name {
      font-size: 0.875rem;
      color: var(--neutral-700);
      flex: 1;
    }

    .attachment-size {
      font-size: 0.75rem;
      color: var(--neutral-500);
      margin-right: 8px;
    }

    .remove-attachment {
      background: none;
      border: none;
      color: var(--neutral-500);
      cursor: pointer;
      font-size: 1rem;
      line-height: 1;
      padding: 0 2px;
    }

    @media (max-width: 640px) {
      .form-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class NewIdeaComponent {
  ideaForm: FormGroup;
  isSubmitting = false;
  submitted = false;
  hashtagInput = this.fb.control('');
  selectedFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ideaService: IdeaService
  ) {
    this.ideaForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(50)]],
      category: ['', Validators.required],
      impact: ['', Validators.required],
      resources: [''],
      hashtags: this.fb.array([])
    });
  }

  get title() { return this.ideaForm.get('title')!; }
  get description() { return this.ideaForm.get('description')!; }
  get category() { return this.ideaForm.get('category')!; }
  get impact() { return this.ideaForm.get('impact')!; }
  get hashtags() { return this.ideaForm.get('hashtags') as FormArray; }

  addHashtag(event: Event) {
    event.preventDefault();
    const value = this.hashtagInput.value?.trim() || '';
    
    if (value && !this.hashtags.value.includes(value)) {
      this.hashtags.push(this.fb.control(value));
    }
    
    this.hashtagInput.setValue('');
  }

  removeHashtag(index: number) {
    this.hashtags.removeAt(index);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      
      // Limit to 5 files total
      const remainingSlots = 5 - this.selectedFiles.length;
      const filesToAdd = files.slice(0, remainingSlots);
      
      // Filter files larger than 5MB
      const validFiles = filesToAdd.filter(file => file.size <= 5 * 1024 * 1024);
      
      this.selectedFiles = [...this.selectedFiles, ...validFiles];
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  }

  onSubmit() {
    if (this.ideaForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    // Create a new idea object
    const newIdea = {
      id: Date.now(), // Use timestamp as temporary ID
      title: this.title.value,
      content: this.description.value,
      timestamp: 'Just now',
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      tags: this.hashtags.value,
      authorHash: 'user#' + Math.floor(1000 + Math.random() * 9000),
      attachments: this.selectedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }))
    };

    // Simulate API call
    setTimeout(() => {
      // Add the idea to the service
      this.ideaService.addIdea(newIdea);
      
      this.isSubmitting = false;
      this.submitted = true;
      
      // Reset form after submission
      setTimeout(() => {
        this.router.navigate(['/idea-feed']);
      }, 1500);
    }, 1500);
  }

  saveDraft() {
    // Implement draft saving logic
    const draft = {
      ...this.ideaForm.value,
      hashtags: this.hashtags.value,
      attachments: this.selectedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }))
    };
    
    console.log('Saving draft:', draft);
    // In a real app, you would save to localStorage or a service
  }
}

