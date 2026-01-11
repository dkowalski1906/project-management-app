import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  DragDropModule, 
  CdkDragDrop, 
  moveItemInArray, 
  transferArrayItem 
} from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { ProjectService } from '../../service/project.service';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent {
  project;

  constructor(
    private router: Router,
    private projectService: ProjectService // Injecte le service
  ) {
    this.project = this.projectService.project; // Lie les données du service
  }

  updateProgress() {
    let totalTasks = 0;
    let doneTasks = 0;

    this.project.columns.forEach(col => {
      totalTasks += col.tasks.length;
      if (col.id === 'done') { // On considère 'done' comme la colonne finale
        doneTasks = col.tasks.length;
      }
    });

    this.project.progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  }

  selectedTask: any = null;

  openTask(task: any) {
    this.router.navigate(['/task', task.id]);
  }

  addNewColumn() {
    const columnName = prompt('Nom de la nouvelle colonne :');
    if (columnName && columnName.trim().length > 0) {
      this.projectService.addColumn(columnName);
    }
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