import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  DragDropModule, 
  moveItemInArray, 
  transferArrayItem, 
  CdkDragDrop 
} from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import projectsData from '../../database/projects.json';
import tasksData from '../../database/tasks.json';

export interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  status: string;
  deadline: string;
  category?: string;
  priority?: string;
}

export interface Column {
  id: string;
  name: string;
  color: string;
  isLastOne: boolean;
  tasks: Task[];
}

export interface Project {
  id: number;
  name: string;
  members: string[];
  description: string;
  deadline: string;
  columns: Column[];
  progress?: number;
}

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [CommonModule, DragDropModule, LucideAngularModule, FormsModule],
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  project!: Project;
  
  showColumnModal = false;
  newColName = '';
  newColIsLast = false;
  newColColor = '#4f46e5';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const projectId = Number(params.get('id'));
      const rawProject = (projectsData as any[]).find(p => p.id === projectId);
      
      if (rawProject) {
        this.project = JSON.parse(JSON.stringify(rawProject));
        this.project.columns.forEach(column => {
          column.tasks = (column.tasks || []).map(taskId => 
            (tasksData as Task[]).find(t => t.id === Number(taskId))
          ).filter((t): t is Task => !!t);
        });
        this.updateProgress();
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  // Drag & Drop des COLONNES
  dropColumn(event: CdkDragDrop<Column[]>) {
    moveItemInArray(this.project.columns, event.previousIndex, event.currentIndex);
  }

  // Drag & Drop des TÂCHES
  dropTask(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.updateProgress();
  }

  getConnectedLists(): string[] {
    return this.project.columns.map(col => col.id);
  }

  openAddColumnModal() {
    this.showColumnModal = true;
  }

  confirmAddColumn() {
    if (!this.newColName.trim()) return;

    if (this.newColIsLast) {
      this.project.columns.forEach(c => c.isLastOne = false);
    }

    const newCol: Column = {
      id: 'col-' + Date.now(),
      name: this.newColName,
      color: this.newColColor,
      isLastOne: this.newColIsLast,
      tasks: []
    };

    this.project.columns.push(newCol);
    this.updateProgress();
    this.closeModal();
  }

  closeModal() {
    this.showColumnModal = false;
    this.newColName = '';
    this.newColIsLast = false;
  }

  updateProgress() {
    if (!this.project) return;
    const total = this.project.columns.reduce((acc, col) => acc + (col.tasks?.length || 0), 0);
    const lastCol = this.project.columns.find(c => c.isLastOne === true);
    const done = lastCol ? lastCol.tasks.length : 0;
    this.project.progress = total > 0 ? Math.round((done / total) * 100) : 0;
  }

  navigateBack() { this.location.back(); }
  openTask(task: Task) { this.router.navigate(['/task', task.id]); }
}