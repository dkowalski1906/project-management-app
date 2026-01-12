import { Routes } from '@angular/router';
import { ProjectPageComponent } from './components/ProjectPage/project-page.component';
import { TaskDetailComponent } from './components/TaskDetail/task-detail.component';
import {ProjectsDashboardPageComponent} from './components/ProjectsDashboardPage/projects-dashboard-page.component';

export const routes: Routes = [
  { path: '', component: ProjectsDashboardPageComponent },
    { path: 'project', component: ProjectPageComponent },
    { path: 'task/:id', component: TaskDetailComponent },
];
