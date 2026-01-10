import { Routes } from '@angular/router';
import { ProjectPageComponent } from './components/ProjectPage/project-page.component';
import { TaskDetailComponent } from './components/TaskDetail/task-detail.component';

export const routes: Routes = [
    { path: 'project', component: ProjectPageComponent },
    { path: 'task/:id', component: TaskDetailComponent },
];
