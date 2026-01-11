import { Injectable, computed, inject, signal } from '@angular/core';
import { LocalStorageService } from './local-storage';

export type ProjectMemberId = 'u1' | 'u2' | 'u3' | 'u4';

export interface ProjectStats {
  todo: number;
  doing: number;
  done: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  progress: number;
  teamCount: number;
  stats: ProjectStats;
  deadline: string; // YYYY-MM-DD
  members: ProjectMemberId[];
}

export type DateFilter = 'Proche' | 'Lointaine' | 'En retard';

export interface ProjectsFilters {
  progressMin: number;
  progressMax: number;
  selectedPeople: ProjectMemberId[];
  dateFilters: DateFilter[];
}

const LS_KEY = 'projects';

const DEFAULT_PROJECTS: Project[] = [
  { id: 101, title: "Projet Spring Boot", description: "Backend Spring Boot + Hibernate.", progress: 0, teamCount: 1, stats: { todo: 1, doing: 0, done: 0 }, deadline: '2026-06-30', members: ['u3'] },
  { id: 102, title: "Projet Site web", description: "Refonte UI.", progress: 40, teamCount: 1, stats: { todo: 2, doing: 1, done: 2 }, deadline: '2026-01-09', members: ['u2'] },
  { id: 5, title: "Migration Cloud 2026", description: "Infra vers cloud hybride.", progress: 5, teamCount: 1, stats: { todo: 5, doing: 0, done: 0 }, deadline: '2026-06-15', members: ['u4'] },
];

@Injectable({ providedIn: 'root' })
export class ProjectsStore {
  private ls = inject(LocalStorageService);

  readonly searchTerm = signal('');
  readonly filters = signal<ProjectsFilters>({
    progressMin: 0,
    progressMax: 100,
    selectedPeople: [],
    dateFilters: [],
  });

  readonly projects = signal<Project[]>(this.ls.getJson<Project[]>(LS_KEY, DEFAULT_PROJECTS));

  readonly filteredProjects = computed(() => {
    const q = this.searchTerm().trim().toLowerCase();
    const f = this.filters();

    let list = this.projects();

    // search
    if (q) list = list.filter(p => p.title.toLowerCase().includes(q));

    // progress
    list = list.filter(p => p.progress >= f.progressMin && p.progress <= f.progressMax);

    // deadline category
    if (f.dateFilters.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const msDay = 24 * 60 * 60 * 1000;

      list = list.filter(p => {
        const d = new Date(`${p.deadline}T00:00:00`);
        d.setHours(0, 0, 0, 0);

        const isOverdue = d.getTime() < today.getTime();
        const diffDays = Math.ceil((d.getTime() - today.getTime()) / msDay);

        if (f.dateFilters.includes('En retard') && isOverdue) return true;
        if (f.dateFilters.includes('Proche') && !isOverdue && diffDays >= 0 && diffDays <= 7) return true;
        if (f.dateFilters.includes('Lointaine') && !isOverdue && diffDays > 7) return true;

        return false;
      });
    }

    // people
    if (f.selectedPeople.length > 0) {
      list = list.filter(p => p.members.some(m => f.selectedPeople.includes(m)));
    }

    return list;
  });

  setSearchTerm(value: string) {
    this.searchTerm.set(value);
  }

  setProgressMin(v: number) {
    const value = clamp0_100(v);
    this.filters.update(f => ({ ...f, progressMin: Math.min(value, f.progressMax) }));
  }

  setProgressMax(v: number) {
    const value = clamp0_100(v);
    this.filters.update(f => ({ ...f, progressMax: Math.max(value, f.progressMin) }));
  }

  toggleDateFilter(filter: DateFilter) {
    this.filters.update(f => {
      const has = f.dateFilters.includes(filter);
      return {
        ...f,
        dateFilters: has ? f.dateFilters.filter(x => x !== filter) : [...f.dateFilters, filter],
      };
    });
  }

  togglePerson(id: ProjectMemberId) {
    this.filters.update(f => {
      const has = f.selectedPeople.includes(id);
      return {
        ...f,
        selectedPeople: has ? f.selectedPeople.filter(x => x !== id) : [...f.selectedPeople, id],
      };
    });
  }

  clearFilters() {
    this.filters.set({ progressMin: 0, progressMax: 100, selectedPeople: [], dateFilters: [] });
  }

  persistProjects() {
    this.ls.setJson(LS_KEY, this.projects());
  }

  setFilters(next: ProjectsFilters) {
    const min = clamp0_100(next.progressMin);
    const max = clamp0_100(next.progressMax);

    this.filters.set({
      progressMin: Math.min(min, max),
      progressMax: Math.max(min, max),
      selectedPeople: next.selectedPeople ?? [],
      dateFilters: next.dateFilters ?? [],
    });
  }

}

function clamp0_100(v: number): number {
  if (Number.isNaN(v)) return 0;
  return Math.max(0, Math.min(100, Math.trunc(v)));
}
