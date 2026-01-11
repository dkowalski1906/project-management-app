import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { Project } from '../../state/projects.store';

type DeadlineInfo = { isOverdue: boolean; isUrgent: boolean; dateStr: string };

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './project-card.html',
})
export class ProjectCardComponent {
  private _project!: Project;

  @Input({ required: true })
  set project(value: Project) {
    this._project = value;
    this.deadline = this.computeDeadlineInfo(value.deadline);
    this.deadlineBadgeClass = this.computeBadgeClass(this.deadline);
  }
  get project(): Project {
    return this._project;
  }

  @Output() open = new EventEmitter<number>();

  deadline!: DeadlineInfo;
  deadlineBadgeClass = '';

  onClick() {
    this.open.emit(this.project.id);
  }

  private computeDeadlineInfo(isoDate: string): DeadlineInfo {
    const deadline = new Date(`${isoDate}T00:00:00`);
    const today = new Date();

    deadline.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const isOverdue = deadline.getTime() < today.getTime();
    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    const isUrgent = !isOverdue && diffDays >= 0 && diffDays <= 7;

    const dateStr = new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(deadline);

    return { isOverdue, isUrgent, dateStr };
  }

  private computeBadgeClass(info: DeadlineInfo): string {
    if (info.isOverdue) {
      return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400';
    }
    if (info.isUrgent) {
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
    }
    return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
  }
}
