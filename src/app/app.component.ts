import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ImageGalleryComponent],
  template: `
    <main class="min-h-screen bg-gray-50">
      <app-image-gallery></app-image-gallery>
    </main>
  `,
  styles: []
})
export class AppComponent {
  title = 'drap';
} 