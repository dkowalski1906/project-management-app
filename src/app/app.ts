import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from "@angular/router";
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Menu, X, PlusCircle, Moon, Sun } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LucideAngularModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);

  readonly icons = {
    menu: Menu,
    x: X,
    plusCircle: PlusCircle,
    moon: Moon,
    sun: Sun
  };

  isSidebarOpen = false;
  isDarkMode = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.isSidebarOpen = false;
  }
}