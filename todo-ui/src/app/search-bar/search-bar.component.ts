import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, InputTextModule],
  template: `
    <div class="mt-5">
      <input pInputText type="text" placeholder="Search tasks..." [(ngModel)]="searchKeyword" (ngModelChange)="onSearch($event)" class="shadow-2 border-round rounded py-2 px-3 text-gray-700 w-full leading-tight focus:outline-none focus:shadow-outline sm:w-auto">
    </div>
  `,
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  searchKeyword: string = '';
  @Output() searchTasks = new EventEmitter<string>();

  onSearch(keyword: string) {
    this.searchTasks.emit(keyword);
  }
}
