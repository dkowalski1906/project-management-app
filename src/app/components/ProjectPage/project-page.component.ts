import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
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
}

export interface Column {
  id: string;
  name: string;
  color: string;
  tasks: any[];
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
  imports: [CommonModule, DragDropModule, LucideAngularModule],
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  project!: Project;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const projectId = Number(params.get('id'));
      const rawProject = (projectsData as Project[]).find(p => p.id === projectId);
      
      if (rawProject) {
        this.project = JSON.parse(JSON.stringify(rawProject));
        this.project.columns.forEach(column => {
          column.tasks = column.tasks.map(taskId => 
            (tasksData as Task[]).find(t => t.id === taskId)
          ).filter(t => !!t);
        });
        this.updateProgress();
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  addNewColumn() {
    const name = prompt('Nom de la nouvelle colonne :');
    if (name?.trim()) {
      const newCol: Column = {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        color: '#CBD5E1', // Couleur par défaut (gris)
        tasks: []
      };
      this.project.columns.push(newCol);
    }
  }

  createNewTask() {
    this.router.navigate(['/createTask', { projectId: this.project.id }]);
  }

  navigateBack() {
    this.location.back();
  }

  updateProgress() {
    if (!this.project) return;
    const total = this.project.columns.reduce((acc, col) => acc + col.tasks.length, 0);
    const done = this.project.columns.find(c => c.id === 'done')?.tasks.length || 0;
    this.project.progress = total > 0 ? Math.round((done / total) * 100) : 0;
  }

  openTask(task: Task) {
    this.router.navigate(['/task', task.id]);
  }

  drop(event: any) {
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


}