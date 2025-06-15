import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, CdkDrag, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css']
})
export class ImageGalleryComponent implements OnInit {
  images: string[] = [
    'https://picsum.photos/200/200?random=1',
    'https://picsum.photos/200/200?random=2',
    'https://picsum.photos/200/200?random=3',
    'https://picsum.photos/200/200?random=4',
    'https://picsum.photos/200/200?random=5',
    'https://picsum.photos/200/200?random=6',
    'https://picsum.photos/200/200?random=7',
    'https://picsum.photos/200/200?random=8',
    'https://picsum.photos/200/200?random=9',
  ];

  gridImages: (string | null)[] = Array(9).fill(null);
  placedImages: Set<string> = new Set(); // Track which images are placed in grid
  draggedImage: string | null = null;

  constructor() {}

  ngOnInit(): void {}

  onDragStart(image: string): void {
    this.draggedImage = image;
  }

  onDragEnd(): void {
    // Immediate state reset - no animation delay needed
    this.draggedImage = null;
  }

  // Custom method to handle drag end with proper animation
  onDragEndWithAnimation(): void {
    // Small delay to ensure animation completes
    setTimeout(() => {
      this.draggedImage = null;
    }, 50);
  }

  onGridDrop(event: CdkDragDrop<any>, index: number): void {
    if (event.previousContainer === event.container) {
      // Same container, do nothing
      return;
    }

    if (event.previousContainer.id === 'gallery-list') {
      // Dropping from gallery to grid
      const draggedData = event.item.data;
      
      // Check if the grid cell is empty (null)
      if (this.gridImages[index] === null) {
        // Only allow drop if cell is empty
        this.gridImages[index] = draggedData;
        this.placedImages.add(draggedData);
      }
      // If cell is occupied, do nothing - image will return to original position
      // Don't remove from gallery - keep original array intact
    }
  }

  onGalleryDrop(event: CdkDragDrop<string[]>): void {
    // If dropping from grid back to gallery
    if (event.previousContainer.id.startsWith('grid-')) {
      const draggedData = event.item.data;
      if (this.placedImages.has(draggedData)) {
        this.placedImages.delete(draggedData);
        // Remove from grid
        const gridIndex = this.gridImages.indexOf(draggedData);
        if (gridIndex !== -1) {
          this.gridImages[gridIndex] = null;
        }
      }
      // No animation - just immediate state change
      return;
    }

    // Prevent any reordering within gallery
    if (event.previousContainer === event.container) {
      // Don't allow reordering - keep original positions
      return;
    }
  }

  onSimpleGalleryDrop(event: DragEvent): void {
    event.preventDefault();
    if (this.draggedImage && this.placedImages.has(this.draggedImage)) {
      this.placedImages.delete(this.draggedImage);
      // Remove from grid
      const gridIndex = this.gridImages.indexOf(this.draggedImage);
      if (gridIndex !== -1) {
        this.gridImages[gridIndex] = null;
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onSimpleGridDrop(event: DragEvent, index: number): void {
    event.preventDefault();
    if (this.draggedImage) {
      this.gridImages[index] = this.draggedImage;
      this.placedImages.add(this.draggedImage);
    }
  }

  onGridItemDragStart(image: string): void {
    this.draggedImage = image;
  }

  // Handle immediate state change when dropping from grid to gallery
  onGridToGalleryDrop(draggedImage: string): void {
    if (this.placedImages.has(draggedImage)) {
      this.placedImages.delete(draggedImage);
      // Remove from grid
      const gridIndex = this.gridImages.indexOf(draggedImage);
      if (gridIndex !== -1) {
        this.gridImages[gridIndex] = null;
      }
    }
  }

  isImagePlaced(image: string): boolean {
    return this.placedImages.has(image);
  }

  // Predicate to control what can be dropped where
  canDropToGrid = (drag: CdkDrag, drop: CdkDropList) => {
    return drag.dropContainer.id === 'gallery-list';
  }

  canDropToGallery = (drag: CdkDrag, drop: CdkDropList) => {
    return drag.dropContainer.id.startsWith('grid-');
  }

  // Predicate to check if a grid cell can accept a drop
  canDropToGridCell = (drag: CdkDrag, drop: CdkDropList) => {
    // Only allow drop from gallery
    if (drag.dropContainer.id !== 'gallery-list') {
      return false;
    }
    
    // Get the dragged image data
    const draggedImage = drag.data;
    
    // Check if this image is already placed in any grid cell
    if (this.placedImages.has(draggedImage)) {
      return false; // Image already used, can't drop into another cell
    }
    
    // Get the grid index from the drop list id
    const gridId = drop.id;
    const gridIndex = parseInt(gridId.replace('grid-', ''));
    
    // Only allow drop if the grid cell is empty
    return this.gridImages[gridIndex] === null;
  }

  scrollLeft(container: HTMLElement): void {
    container.scrollBy({ left: -200, behavior: 'smooth' });
  }

  scrollRight(container: HTMLElement): void {
    container.scrollBy({ left: 200, behavior: 'smooth' });
  }
} 