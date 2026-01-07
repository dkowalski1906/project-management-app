import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface Comment {
  author: string;
  text: string;
  date: string;
}

@Component({
  selector: 'app-commentary',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './commentary.html',
})
export class CommentaryComponent {
  @Input() comment!: Comment;
}