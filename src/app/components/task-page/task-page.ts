import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { CommentaryComponent, Comment } from './commentary/commentary';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

// Import du JSON
import tasksData from '../../database/tasks.json'; 
import commentariesData from '../../database/commentaries.json'; 

export interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  createdBy: string;
  status: string;
  deadline: string;
}

@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, CommentaryComponent],
  templateUrl: './task-page.html',
  styleUrl: './task-page.css',
})
export class TaskPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  taskList: Task[] = []; 
  task!: Task;
  comments: Comment[] = commentariesData;

  newCommentText = '';
  isEditing = false;
  showDeleteConfirm = false;
  editedTask: Task = {} as Task;

ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      // On cherche la tâche directement dans le JSON importé
      const foundTask = (tasksData as Task[]).find(t => t.id === id);
      
      if (foundTask) {
        this.task = { ...foundTask };
      } else {
        this.router.navigate(['/tasks']); 
      }
    });
  }

  // --- Actions ---

editButton() {
    this.editedTask = { ...this.task };
    this.isEditing = true;
  }

  saveEdit() {
    this.task = { ...this.editedTask };
    this.isEditing = false;
    // Note: Sans API ou Service, le changement est uniquement local au composant
  }

  confirmDelete() {
    this.showDeleteConfirm = false;
    this.router.navigate(['/tasks']);
  }

  sendComment() {
    if (this.newCommentText.trim()) {
      this.comments.unshift({
        author: 'Moi',
        text: this.newCommentText,
        date: new Date().toISOString()
      });
      this.newCommentText = '';
    }
  }

  cancelButton() {
    this.isEditing = false;
    this.location.back();
  }

  deleteButton() { this.showDeleteConfirm = true; }

  cancelEdit() { this.isEditing = false; }
  cancelDelete() { this.showDeleteConfirm = false; }
}