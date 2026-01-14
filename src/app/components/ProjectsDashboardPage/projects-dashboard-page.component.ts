import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Menu,
  Search,
  Filter,
  PlusCircle,
  User,
  Moon,
  Sun,
  X,
  Clock,
  ArrowLeft,
} from 'lucide-angular';

interface ProjectStats {
  todo: number;
  doing: number;
  done: number;
}

interface Project {
  id: number;
  title: string;
  description: string;
  progress: number; // 0–100
  teamCount: number;
  stats: ProjectStats;
  deadline: string; // ISO string: 'YYYY-MM-DD'
  members: string[];
}

type View = 'dashboard' | 'create_project' | 'project_detail';

interface Filters {
  progressMin: number;
  progressMax: number;
}

@Component({
  selector: 'app-projects-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './projects-dashboard-page.component.html',
  styleUrl: './projects-dashboard-page.component.css',
})
export class ProjectsDashboardPageComponent {
  // Icons (used with [img] to avoid provider issues)
  readonly icons = {
    menu: Menu,
    search: Search,
    filter: Filter,
    plusCircle: PlusCircle,
    user: User,
    moon: Moon,
    sun: Sun,
    x: X,
    clock: Clock,
    arrowLeft: ArrowLeft,
  };

  // UI state
  isDarkMode = false;
  isSidebarOpen = false;
  isFilterOpen = false;

  view: View = 'dashboard';

  searchTerm = '';

  filters: Filters = {
    progressMin: 0,
    progressMax: 100,
  };

  selectedProject: Project | null = null;

  // Demo data
  usersList = [
    { id: 'u1', label: 'Alex' },
    { id: 'u2', label: 'Sarah' },
    { id: 'u3', label: 'Mike' },
    { id: 'u4', label: 'Emma' },
  ];

  projects: Project[] = [
    {
      id: 101,
      title: 'Projet Spring Boot',
      description:
        "Développement d'un backend robuste avec Spring Boot et Hibernate pour la gestion des stocks.",
      progress: 0,
      teamCount: 1,
      stats: { todo: 1, doing: 0, done: 0 },
      deadline: '2026-06-30',
      members: ['u3'],
    },
    {
      id: 102,
      title: 'Projet Site web',
      description:
        "Refonte de l\'interface utilisateur pour maximiser les conversions et moderniser l\'image de marque.",
      progress: 40,
      teamCount: 1,
      stats: { todo: 2, doing: 1, done: 2 },
      deadline: '2026-01-09',
      members: ['u2'],
    },
    {
      id: 5,
      title: 'Migration Cloud 2026',
      description:
        "Transfert sécurisé de l'infrastructure vers un cloud hybride scalable.",
      progress: 5,
      teamCount: 1,
      stats: { todo: 5, doing: 0, done: 0 },
      deadline: '2026-06-15',
      members: ['u4'],
    },
    {
      id: 103,
      title: 'App Mobile Fitness',
      description:
        'Tracking de calories et exercices personnalisés via React Native.',
      progress: 15,
      teamCount: 2,
      stats: { todo: 8, doing: 2, done: 1 },
      deadline: '2026-04-12',
      members: ['u1', 'u2'],
    },
    {
      id: 104,
      title: 'Analyse Big Data',
      description:
        'Traitement de flux de données massifs avec Apache Spark et Hadoop.',
      progress: 75,
      teamCount: 3,
      stats: { todo: 2, doing: 3, done: 15 },
      deadline: '2026-02-28',
      members: ['u3', 'u4', 'u1'],
    },
    {
      id: 105,
      title: 'Sécurité Réseau',
      description:
        'Audit de vulnérabilité et mise en place de pare-feux avancés.',
      progress: 50,
      teamCount: 1,
      stats: { todo: 5, doing: 5, done: 10 },
      deadline: '2026-03-15',
      members: ['u2'],
    },
    {
      id: 106,
      title: 'Plateforme LMS',
      description:
        "Système de gestion de l'apprentissage pour les écoles primaires.",
      progress: 90,
      teamCount: 2,
      stats: { todo: 1, doing: 2, done: 25 },
      deadline: '2026-01-20',
      members: ['u1', 'u4'],
    },
    {
      id: 107,
      title: 'Automatisation CI/CD',
      description:
        'Pipeline de déploiement continu avec Jenkins, GitHub Actions et Kubernetes.',
      progress: 20,
      teamCount: 1,
      stats: { todo: 12, doing: 3, done: 2 },
      deadline: '2026-05-10',
      members: ['u3'],
    },
    {
      id: 108,
      title: 'Refonte CRM',
      description:
        'Amélioration de la gestion de la relation client pour une PME locale.',
      progress: 35,
      teamCount: 2,
      stats: { todo: 7, doing: 4, done: 6 },
      deadline: '2026-07-22',
      members: ['u2', 'u3'],
    },
    {
      id: 109,
      title: 'API de Paiement',
      description:
        'Passerelle de paiement sécurisée conforme aux normes PCI-DSS.',
      progress: 60,
      teamCount: 1,
      stats: { todo: 4, doing: 4, done: 12 },
      deadline: '2026-03-30',
      members: ['u4'],
    },
    {
      id: 110,
      title: 'Dashboard Logistique',
      description:
        'Visualisation en temps réel de la flotte de camions et livraisons.',
      progress: 45,
      teamCount: 3,
      stats: { todo: 10, doing: 5, done: 15 },
      deadline: '2026-08-05',
      members: ['u1', 'u2', 'u4'],
    },
    {
      id: 111,
      title: 'Outil SEO Interne',
      description:
        'Analyseur de mots-clés et suivi de positionnement Google.',
      progress: 80,
      teamCount: 1,
      stats: { todo: 2, doing: 1, done: 12 },
      deadline: '2026-02-14',
      members: ['u1'],
    },
    {
      id: 112,
      title: 'Chatbot Support',
      description:
        'IA conversationnelle basée sur LLM pour le support client de premier niveau.',
      progress: 10,
      teamCount: 2,
      stats: { todo: 20, doing: 2, done: 1 },
      deadline: '2026-09-30',
      members: ['u3', 'u4'],
    },
  ];

  // --- derived data ---

  get filteredProjects(): Project[] {
    const q = this.searchTerm.trim().toLowerCase();
    const { progressMin, progressMax } = this.filters;

    let list = this.projects;

    if (q) {
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }

    list = list.filter(
      (p) => p.progress >= progressMin && p.progress <= progressMax,
    );

    return list;
  }

  // --- UI actions ---

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;

    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (this.isDarkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }

  openSidebar(): void {
    this.isSidebarOpen = true;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  openFilters(): void {
    this.isFilterOpen = true;
  }

  closeFilters(): void {
    this.isFilterOpen = false;
  }

  openCreateProjectView(): void {
    this.view = 'create_project';
    this.selectedProject = null;
  }

  goToDashboard(): void {
    this.view = 'dashboard';
    this.selectedProject = null;
  }

  openProject(project: Project): void {
    this.selectedProject = project;
    this.view = 'project_detail';
  }

  // --- filters ---

  onProgressMinChange(value: number): void {
    const v = Number(value);
    this.filters.progressMin = Math.min(v, this.filters.progressMax - 1);
  }

  onProgressMaxChange(value: number): void {
    const v = Number(value);
    this.filters.progressMax = Math.max(v, this.filters.progressMin + 1);
  }

  // --- create project ---

  newProjectTitle = '';
  newProjectDescription = '';
  newProjectDeadline = this.todayISO();

  private todayISO(): string {
    return new Date().toISOString().split('T')[0]!;
  }

  createProject(): void {
    const title = this.newProjectTitle.trim();
    if (!title) return;

    const project: Project = {
      id: Date.now(),
      title,
      description: this.newProjectDescription.trim(),
      deadline: this.newProjectDeadline,
      progress: 0,
      teamCount: 1,
      stats: { todo: 0, doing: 0, done: 0 },
      members: ['u1'],
    };

    this.projects = [...this.projects, project];

    this.newProjectTitle = '';
    this.newProjectDescription = '';
    this.newProjectDeadline = this.todayISO();
    this.goToDashboard();
  }

  // --- date helpers (no "new" in templates) ---

  formatDeadline(dateStr: string, long = false): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;

    const opts: Intl.DateTimeFormatOptions = long
      ? { day: 'numeric', month: 'long', year: 'numeric' }
      : { day: 'numeric', month: 'short', year: 'numeric' };

    return d.toLocaleDateString('fr-FR', opts);
  }

  private getDeadlineState(project: Project): 'overdue' | 'urgent' | 'normal' {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const d = new Date(project.deadline);
    const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const isOverdue = target < today;
    const diffDays = Math.ceil(
      (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (isOverdue) return 'overdue';
    if (diffDays <= 7) return 'urgent';
    return 'normal';
  }

  deadlineBadgeClass(project: Project): string {
    const state = this.getDeadlineState(project);
    if (state === 'overdue') {
      return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400';
    }
    if (state === 'urgent') {
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
    }
    return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
  }

  deadlineLabel(project: Project): string {
    const state = this.getDeadlineState(project);
    if (state === 'overdue') {
      return 'En retard';
    }
    return this.formatDeadline(project.deadline, false);
  }
}
