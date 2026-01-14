import { Routes } from '@angular/router';
import { ProjectPageComponent } from './components/ProjectPage/project-page.component';
import {ProjectsDashboardPageComponent} from './components/ProjectsDashboardPage/projects-dashboard-page.component';
import { TaskPage } from './components/task-page/task-page';

export const routes: Routes = [
  { path: '', component: ProjectsDashboardPageComponent },
    { path: 'project/:id', component: ProjectPageComponent },
    { path: 'task/:id', component: TaskPage }
];
