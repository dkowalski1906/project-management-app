import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'projects',
    loadChildren: () =>
      import('./projects/projects.routes').then(m => m.PROJECTS_ROUTES),
  },
];
