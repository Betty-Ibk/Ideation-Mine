import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface IdeaPost {
  status?: string;
  id: number;
  title: string;
  content: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  tags: string[];
  authorHash: string;
  attachments?: {
    name: string;
    size: number;
    type: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class IdeaService {
  private ideasSubject = new BehaviorSubject<IdeaPost[]>([
    {
      id: 1,
      title: "Organize relevant Staff Training",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      timestamp: "2 hr ago",
      upvotes: 24,
      downvotes: 3,
      userVote: null,
      tags: ["Staff Training", "HR"],
      authorHash: "user#4442",
      status: "pending"
    },
    {
      id: 2,
      title: "Give us better food",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      timestamp: "3 hr ago",
      upvotes: 42,
      downvotes: 5,
      userVote: null,
      tags: ["Staff Well-being", "Cafeteria"],
      authorHash: "user#4442",
      status: "approved"
    },
    {
      id: 3,
      title: "Create a marketplace app for staff",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      timestamp: "5 hr ago",
      upvotes: 31,
      downvotes: 2,
      userVote: null,
      tags: ["Staff Marketplace", "App Development"],
      authorHash: "user#4442",
      status: "pending"
    },
    {
      id: 4,
      title: "Buy Favour's Cake!",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      timestamp: "6 hr ago",
      upvotes: 18,
      downvotes: 1,
      userVote: null,
      tags: ["Staff Celebration", "Birthday"],
      authorHash: "user#4442",
      status: "rejected"
    }
  ]);

  ideas$ = this.ideasSubject.asObservable();

  constructor() {}

  getIdeas() {
    return this.ideas$;
  }

  addIdea(idea: IdeaPost) {
    // Ensure idea has a status if not provided
    if (!idea.status) {
      idea.status = 'pending';
    }
    
    const currentIdeas = this.ideasSubject.value;
    this.ideasSubject.next([idea, ...currentIdeas]);
  }

  updateIdea(updatedIdea: IdeaPost) {
    const currentIdeas = this.ideasSubject.value;
    const index = currentIdeas.findIndex(idea => idea.id === updatedIdea.id);
    
    if (index !== -1) {
      const newIdeas = [...currentIdeas];
      newIdeas[index] = updatedIdea;
      this.ideasSubject.next(newIdeas);
    }
  }

  voteIdea(ideaId: number, voteType: 'up' | 'down') {
    const currentIdeas = this.ideasSubject.value;
    const index = currentIdeas.findIndex(idea => idea.id === ideaId);
    
    if (index !== -1) {
      const idea = {...currentIdeas[index]};
      
      // If already voted the same way, remove vote
      if (idea.userVote === voteType) {
        if (voteType === 'up') {
          idea.upvotes--;
        } else {
          idea.downvotes--;
        }
        idea.userVote = null;
      } 
      // If voted the opposite way, switch vote
      else if (idea.userVote !== null) {
        if (voteType === 'up') {
          idea.upvotes++;
          idea.downvotes--;
        } else {
          idea.downvotes++;
          idea.upvotes--;
        }
        idea.userVote = voteType;
      } 
      // If not voted yet, add new vote
      else {
        if (voteType === 'up') {
          idea.upvotes++;
        } else {
          idea.downvotes++;
        }
        idea.userVote = voteType;
      }
      
      const newIdeas = [...currentIdeas];
      newIdeas[index] = idea;
      this.ideasSubject.next(newIdeas);
    }
  }

  getIdeaById(id: number): IdeaPost | undefined {
    return this.ideasSubject.value.find(idea => idea.id === id);
  }

  deleteIdea(id: number): boolean {
    const currentIdeas = this.ideasSubject.value;
    const index = currentIdeas.findIndex(idea => idea.id === id);
    
    if (index !== -1) {
      const newIdeas = [...currentIdeas];
      newIdeas.splice(index, 1);
      this.ideasSubject.next(newIdeas);
      return true;
    }
    return false;
  }
}

