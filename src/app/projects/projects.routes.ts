import { Routes } from '@angular/router';
import { ProjectsShellComponent } from './projects-shell/projects-shell';
import { ProjectsDashboardPageComponent } from './pages/projects-dashboard-page/projects-dashboard-page';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    component: ProjectsShellComponent,
    children: [{ path: '', component: ProjectsDashboardPageComponent }],
  },
];
