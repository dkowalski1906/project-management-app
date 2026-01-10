import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { CommentaryComponent, Comment } from './commentary/commentary';

// Import du JSON
import tasksData from '../../database/tasks.json'; 
import commentariesData from '../../database/commentaries.json'; 

export interface Task {
  title: string;
  number: number;
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
  
  taskList: Task[] = []; 
  @Input() task!: Task;

  comments: Comment[] = commentariesData;
  newCommentText: string = '';

  isEditing: boolean = false;
  showDeleteConfirm: boolean = false;
  editedTask: Task = {} as Task;

  private readonly STORAGE_KEY = 'app_tasks_v1';

  ngOnInit() {
    // --- CHANGEMENT ICI ---
    // À chaque chargement de la page, on force la remise à zéro avec le JSON
    console.log('♻️ Reset des données depuis le fichier JSON');
    this.taskList = [...tasksData]; 
    
    // On écrase immédiatement le LocalStorage avec ces données "fraîches"
    this.saveToStorage();

    // Sélection de la tâche par défaut
    if (!this.task && this.taskList.length > 0) {
      this.task = this.taskList[0];
    }
  }

  // --- Helpers ---

  private saveToStorage() {
    // Met à jour le stockage du navigateur
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.taskList));
  }

  // --- Actions ---

  editButton() {
    this.editedTask = { ...this.task }; 
    this.isEditing = true;
  }

  saveEdit() {
    const index = this.taskList.findIndex(t => t.number === this.task.number);
    if (index !== -1) {
      this.taskList[index] = { ...this.editedTask };
      this.task = this.taskList[index];
      
      // On met à jour le storage pour voir les changements en direct dans l'inspecteur
      this.saveToStorage();
    }
    this.isEditing = false;
  }

  deleteButton() {
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    const index = this.taskList.findIndex(t => t.number === this.task.number);
    if (index !== -1) {
      this.taskList.splice(index, 1);
      this.saveToStorage(); // Mise à jour du storage après suppression
    }
    
    this.showDeleteConfirm = false;
    
    // Redirection
    if (this.taskList.length > 0) {
        const newIndex = index < this.taskList.length ? index : index - 1;
        this.task = this.taskList[newIndex];
    } else {
        this.cancelButton();
    }
  }

  // --- Autres ---

  cancelEdit() { this.isEditing = false; }
  cancelDelete() { this.showDeleteConfirm = false; }
  cancelButton() { console.log('Retour arrière'); }

  sendComment(): void {
    if (this.newCommentText.trim()) {
      this.comments.unshift({
        author: 'Moi',
        text: this.newCommentText,
        date: new Date().toISOString()
      });
      this.newCommentText = '';
    }
  }
}