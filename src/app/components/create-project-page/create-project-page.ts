import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS, NativeDateAdapter, DateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

/**
 * Custom Adapter pour forcer l'ordre des dates
 */
export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return date.toDateString();
  }
}

const MY_DATE_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

@Component({
  selector: 'app-create-project-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDatepickerModule, MatNativeDateModule, MatInputModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: DateAdapter, useClass: CustomDateAdapter }, // On remplace l'adaptateur par le nôtre
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  templateUrl: './create-project-page.html',
  styleUrl: './create-project-page.css',
})
export class CreateProjectPage {
  title = '';
  description = '';
  deadline: Date | null = null;

  createProject() {
    console.log('Date sélectionnée :', this.deadline);
  }

  cancelButton() {
    console.log('Retour');
  }
}