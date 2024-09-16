import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <ul class="mt-5 space-y-4">
      @for (task of tasks; track task; let i = $index) {
        <li class="border rounded-lg shadow-md p-4 flex flex-column sm:flex-row justify-between items-start sm:items-center bg-white hover:bg-gray-100 transition duration-300">
          <div class="flex-1">
            <h3 class="font-bold text-lg text-gray-800" [class.line-through]="task.completed">{{ task.name }}</h3>
            <p class="text-gray-600" [class.line-through]="task.completed">{{ task.description }}</p>
          </div>
          <div class="flex space-x-2 mt-2 sm:mt-0">
            <input type="checkbox" [(ngModel)]="task.completed" (change)="onUpdateTaskStatus(task)" class="mr-2">
            <button (click)="onEditTask(i)" class="text-yellow-500 hover:text-yellow-700">
              <span class="material-icons">edit</span>
            </button>
            <button (click)="onDeleteTask(i)" class="text-red-500 hover:text-red-700">
              <span class="material-icons">delete</span>
            </button>
          </div>
        </li>
      }
    </ul>
    `,
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  @Input() tasks: any[] = [];
  @Output() updateTaskStatus = new EventEmitter<any>();
  @Output() editTask = new EventEmitter<number>();
  @Output() deleteTask = new EventEmitter<number>();

  onUpdateTaskStatus(task: any) {
    this.updateTaskStatus.emit(task);
  }

  onEditTask(index: number) {
    this.editTask.emit(index);
  }

  onDeleteTask(index: number) {
    this.deleteTask.emit(index);
  }
}
