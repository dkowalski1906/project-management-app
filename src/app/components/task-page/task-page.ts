import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { CommentaryComponent, Comment } from './commentary/commentary';
import tasksData from '../../database/tasks.json'; 
import commentariesData from '../../database/commentaries.json'; 

export interface Task {
  title: string;
  number: number;
  description: string;
  status: string;
  deadline: string;
  assignedTo: string;
  createdBy: string;
}

@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatIconModule, 
    CommentaryComponent
  ],
  templateUrl: './task-page.html',
  styleUrl: './task-page.css',
})
export class TaskPage {
  @Input() task: Task = tasksData[Math.floor(Math.random() * tasksData.length)];

  newCommentText: string = '';

  comments: Comment[] = commentariesData;

  sendComment(): void {
    if (this.newCommentText.trim()) {
      const newComment: Comment = {
        author: 'Alex',
        text: this.newCommentText,
        date: new Date().toISOString()
      };

      this.comments.unshift(newComment);
      
      this.newCommentText = '';
    }
  }

  cancelButton(): void {
    console.log('Retour à la page précédente');
  }
}