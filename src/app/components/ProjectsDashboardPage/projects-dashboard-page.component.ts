import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  Menu, Search, Filter, PlusCircle, User,
  Moon, Sun, X, Clock, ArrowLeft,
} from 'lucide-angular';

// Import des données JSON
import projectsData from '../../database/projects.json';

// Définition des interfaces pour la sécurité du code
interface ProjectStats {
  todo: number;
  doing: number;
  done: number;
}

interface Project {
  id: number;
  name: string;
  description: string;
  progress: number;
  deadline: string;
  members: string[];
  teamCount: number;
  stats: ProjectStats;
}

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
export class ProjectsDashboardPageComponent implements OnInit {
  private router = inject(Router);

  // Configuration des icônes pour Lucide
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

  // État de l'UI
  projects: Project[] = [];
  isDarkMode = false;
  isSidebarOpen = false;
  isFilterOpen = false;
  searchTerm = '';

  filters: Filters = {
    progressMin: 0,
    progressMax: 100,
  };

  // Données pour le formulaire de création
  newProjectTitle = '';
  newProjectDescription = '';
  newProjectDeadline = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    const rawData = JSON.parse(JSON.stringify(projectsData));
    
    this.projects = rawData.map((p: any) => {
      const cols = p.columns || [];

      const totalTasks = cols.reduce((acc: number, col: any) => {
        return acc + (col.tasks ? col.tasks.length : 0);
      }, 0);

      const finalColumn = cols.find((c: any) => c.isLastOne === true);
      const doneCount = finalColumn?.tasks?.length || 0;

      const calculatedProgress = totalTasks > 0 
        ? Math.round((doneCount / totalTasks) * 100) 
        : 0;

      const todoCount = cols.find((c: any) => c.id === 'toDo' || c.id === 'todo')?.tasks?.length || 0;
      const doingCount = cols.find((c: any) => c.id === 'inProgress' || c.id === 'doing')?.tasks?.length || 0;

      return {
        ...p,
        name: p.name || 'Projet sans nom',
        progress: calculatedProgress, 
        teamCount: p.members?.length || 0,
        stats: {
          todo: todoCount,
          doing: doingCount,
          done: doneCount 
        }
      };
    });
  }

  // --- Données filtrées pour l'affichage ---
  get filteredProjects(): Project[] {
    const q = this.searchTerm.trim().toLowerCase();
    return this.projects.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(q);
      const matchesProgress = p.progress >= this.filters.progressMin && p.progress <= this.filters.progressMax;
      return matchesSearch && matchesProgress;
    });
  }

  // --- Actions de Navigation ---
  openProject(project: Project): void {
    // Redirection vers /project/1, /project/2, etc.
    this.router.navigate(['/project', project.id]);
  }

  // --- Actions UI ---
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }

  // --- Helpers de rendu (utilisés dans le HTML) ---
  deadlineLabel(project: Project): string {
    const state = this.getDeadlineState(project);
    return state === 'overdue' ? 'En retard' : this.formatDeadline(project.deadline);
  }

  deadlineBadgeClass(project: Project): string {
    const state = this.getDeadlineState(project);
    if (state === 'overdue') return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400';
    if (state === 'urgent') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
    return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
  }

  private parseFrDate(dateStr: string): Date {
    // Sépare le 14, le 01 et le 2026
    const [day, month, year] = dateStr.split('/').map(Number);
    // Attention : les mois en JS vont de 0 (janvier) à 11 (décembre)
    return new Date(year, month - 1, day);
  }

  formatDeadline(dateStr: string): string {
    if (!dateStr) return '';
    // Si c'est déjà au format JJ/MM/AAAA, on le renvoie tel quel ou on le reformate
    if (dateStr.includes('/')) {
      const d = this.parseFrDate(dateStr);
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return dateStr;
  }

  private getDeadlineState(project: Project): 'overdue' | 'urgent' | 'normal' {
    if (!project.deadline) return 'normal';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    // On utilise notre convertisseur ici
    const targetDate = project.deadline.includes('/') 
      ? this.parseFrDate(project.deadline) 
      : new Date(project.deadline);
      
    const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();

    if (target < today) return 'overdue';

    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 ? 'urgent' : 'normal';
  }

  // Gestion des filtres
  onProgressMinChange(v: number) { this.filters.progressMin = Math.min(v, this.filters.progressMax); }
  onProgressMaxChange(v: number) { this.filters.progressMax = Math.max(v, this.filters.progressMin); }
  
  openSidebar() { this.isSidebarOpen = true; }
  closeSidebar() { this.isSidebarOpen = false; }
  openFilters() { this.isFilterOpen = true; }
  closeFilters() { this.isFilterOpen = false; }
}