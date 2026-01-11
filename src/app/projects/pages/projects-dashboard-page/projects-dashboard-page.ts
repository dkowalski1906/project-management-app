import { Component, inject } from '@angular/core';
import { ProjectsStore, ProjectMemberId } from '../../state/projects.store';
import { ProjectCardComponent } from '../../ui/project-card/project-card';
import { ProjectFilterModalComponent } from '../../ui/project-filter-modal/project-filter-modal';

@Component({
  selector: 'app-projects-dashboard-page',
  standalone: true,
  imports: [ProjectCardComponent, ProjectFilterModalComponent],
  templateUrl: './projects-dashboard-page.html',
})
export class ProjectsDashboardPageComponent {
  readonly store = inject(ProjectsStore);

  readonly users: { id: ProjectMemberId; label: string }[] = [
    { id: 'u1', label: 'Alex' },
    { id: 'u2', label: 'Sarah' },
    { id: 'u3', label: 'Mike' },
    { id: 'u4', label: 'Emma' },
  ];

  isFilterOpen = false;

  openFilters() { this.isFilterOpen = true; }
  closeFilters() { this.isFilterOpen = false; }

  applyFilters(f: any) {
    this.store.setFilters(f);
  }

  openProject(id: number) {
    // dashboard only for now: just prove click works
    console.log('open project', id);
  }
}
