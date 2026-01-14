import { Injectable } from '@angular/core';
import { describe } from 'node:test';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  project = {
    title: 'Projet Spring Boot',
    description: "Développement d'un backend robuste...",
    deadline: '30 juin 2026',
    progress: 35,
    members: ['Mike', 'Sarah', 'Jean'],
    // On passe à une structure en tableau pour les colonnes
    columns: [
      { 
        id: 'todo', 
        name: 'À FAIRE', 
        color: '#ef4444', 
        tasks: [
          { id: 1, title: 'Configuration BDD', category: 'BACKEND', priority: 'HIGH', assignee: 'Mike', date: '2026-06-30', description: 'Configurer la base de données PostgreSQL pour le projet.' },
            { id: 2, title: 'Création API REST', category: 'BACKEND', priority: 'MEDIUM', assignee: 'Sarah', date: '2026-07-05', description: 'Développer les endpoints pour la gestion des utilisateurs.' }
        ] 
      },
      { id: 'inProgress', name: 'EN COURS', color: '#f59e0b', tasks: [
            { id: 3, title: 'Modélisation données', category: 'BACKEND', priority: 'HIGH', assignee: 'Jean', date: '2026-06-28', description: 'Créer le schéma de la base de données en fonction des besoins.' }
      ] },
      { id: 'done', name: 'TERMINÉ', color: '#10b981', tasks: [
            { id: 4, title: 'Analyse des besoins', category: 'BACKEND', priority: 'LOW', assignee: 'Mike', date: '2026-06-20', description: 'Recueillir et documenter les exigences du projet.' }
      ] }
    ]
  };

  addColumn(name: string) {
    const newId = name.toLowerCase().replace(/\s+/g, '-');
    this.project.columns.push({
      id: newId,
      name: name.toUpperCase(),
      color: '#64748b', // Couleur grise par défaut
      tasks: []
    });
  }

  getTaskById(id: number) {
    for (const col of this.project.columns) {
      const task = col.tasks.find(t => t.id === id);
      if (task) return task;
    }
    return null;
  }
}