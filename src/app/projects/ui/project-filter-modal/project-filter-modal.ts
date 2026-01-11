import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { DateFilter, ProjectMemberId, ProjectsFilters } from '../../state/projects.store';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-project-filter-modal',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './project-filter-modal.html',
})
export class ProjectFilterModalComponent {
  readonly dateFilterOptions: DateFilter[] = ['Proche', 'Lointaine', 'En retard'];
  private _isOpen = false;

  @Input()
  set isOpen(v: boolean) {
    this._isOpen = v;
    if (v) this.syncFromInputs();
  }
  get isOpen() {
    return this._isOpen;
  }

  @Input() filters!: ProjectsFilters;
  @Input() users: { id: ProjectMemberId; label: string }[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() apply = new EventEmitter<ProjectsFilters>();

  // local editable copy (so Cancel works)
  localProgressMin = 0;
  localProgressMax = 100;
  localSelectedPeople: ProjectMemberId[] = [];
  localDateFilters: DateFilter[] = [];

  private syncFromInputs() {
    if (!this.filters) return;
    this.localProgressMin = this.filters.progressMin;
    this.localProgressMax = this.filters.progressMax;
    this.localSelectedPeople = [...this.filters.selectedPeople];
    this.localDateFilters = [...this.filters.dateFilters];
  }

  toggleDateFilter(f: DateFilter) {
    const has = this.localDateFilters.includes(f);
    this.localDateFilters = has
      ? this.localDateFilters.filter(x => x !== f)
      : [...this.localDateFilters, f];
  }

  togglePerson(id: ProjectMemberId) {
    const has = this.localSelectedPeople.includes(id);
    this.localSelectedPeople = has
      ? this.localSelectedPeople.filter(x => x !== id)
      : [...this.localSelectedPeople, id];
  }

  onApply() {
    this.apply.emit({
      progressMin: this.localProgressMin,
      progressMax: this.localProgressMax,
      selectedPeople: this.localSelectedPeople,
      dateFilters: this.localDateFilters,
    });
  }
}
