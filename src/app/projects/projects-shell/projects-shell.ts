import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, signal, effect } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-projects-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './projects-shell.html',
  styleUrl: './projects-shell.css',
})
export class ProjectsShellComponent {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  isSidebarOpen = signal(false);
  isDarkMode = signal(false);

  // EXACTEMENT le pattern React: items avec icon
  items: Array<{ id: string; icon: string; label: string; route: string }> = [
    { id: 'dashboard', icon: 'folder', label: 'Projets', route: '/projects' },
    { id: 'create_project', icon: 'plus-circle', label: 'Nouveau projet', route: '/projects/new' },
  ];

  constructor() {
    if (this.isBrowser) this.isDarkMode.set(localStorage.getItem('theme') === 'dark');

    effect(() => {
      if (!this.isBrowser) return;
      document.documentElement.classList.toggle('dark', this.isDarkMode());
      localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
    });
  }

  openSidebar() { this.isSidebarOpen.set(true); }
  closeSidebar() { this.isSidebarOpen.set(false); }
  toggleTheme() { this.isDarkMode.update(v => !v); }
}
