import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule],
  template: `
    <form class="flex flex-wrap justify-content-center items-center gap-2" (submit)="onSubmit($event)">
      <div class="flex flex-column sm:flex-row items-center w-full sm:w-auto gap-2">
        <div class="flex items-center w-full sm:w-auto">
          <label for="name" class="pr-5 hidden" aria-label="Name of the task">Name of the Task: </label>
          <input pInputText type="text" name="name" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full sm:w-auto" id="name" placeholder="Input Task" [(ngModel)]="taskName" required>
        </div>
        <div class="flex items-center w-full sm:w-auto">
          <label for="description" class="pr-5 hidden" aria-label="Description of the task">Description: </label>
          <input pInputText type="text" name="description" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full sm:w-auto" id="description" placeholder="Task Description" [(ngModel)]="taskDescription" required>
        </div>
        <button pButton type="submit" id="add-task-form" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto">{{ isEditMode ? 'Update Task' : 'Add Task' }}</button>
      </div>
    </form>
  `,
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  @Input() taskName: string = '';
  @Input() taskDescription: string = '';
  @Input() isEditMode: boolean = false;
  @Output() addOrUpdateTask = new EventEmitter<{ taskName: string, taskDescription: string }>();

  onSubmit(event: Event) {
    event.preventDefault();
    this.addOrUpdateTask.emit({ taskName: this.taskName, taskDescription: this.taskDescription });
  }
}
