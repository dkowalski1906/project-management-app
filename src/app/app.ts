import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CreateProjectPage } from './components/create-project-page/create-project-page';
import { TaskPage } from './components/task-page/task-page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSlideToggleModule, TaskPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('project-management-app');
}
