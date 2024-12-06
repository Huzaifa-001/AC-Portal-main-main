import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() currentPageIndex: number = 1;
  @Input() pageSize: number = 10;
  @Input() totalCount: number = 1;

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  onPageChange(pageIndex: number): void {
    if (pageIndex >= 1 && pageIndex <= this.totalPages) {
      this.pageChange.emit(pageIndex);
    }
  }

  getTotalPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }
}
