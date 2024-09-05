import { CommonModule } from '@angular/common'; 
import { Component } from '@angular/core'; 
import { FormsModule } from '@angular/forms'; 
import { RouterOutlet } from '@angular/router';

@Component({ 
    selector: 'app-root', 
    standalone: true, 
    imports: [RouterOutlet, FormsModule, CommonModule], 
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss' 
}) 
export class AppComponent {
  title = 'Todo App';
  taskName: string = '';
  taskDescription: string = '';
  tasks: { name: string, description: string }[] = [];
  isEditMode: boolean = false;
  editIndex: number | null = null;

  addOrUpdateTask(event: Event): void {
    event.preventDefault();
    if (this.isEditMode && this.editIndex !== null) {
      this.tasks[this.editIndex] = { name: this.taskName, description: this.taskDescription };
      this.isEditMode = false;
      this.editIndex = null;
    } else {
      this.tasks.push({ name: this.taskName, description: this.taskDescription });
    }
    this.taskName = '';
    this.taskDescription = '';
  }

  editTask(index: number): void {
    this.taskName = this.tasks[index].name;
    this.taskDescription = this.tasks[index].description;
    this.isEditMode = true;
    this.editIndex = index;
  }

  deleteTask(index: number): void {
    this.tasks.splice(index, 1);
    if (this.isEditMode && this.editIndex === index) {
      this.isEditMode = false;
      this.editIndex = null;
      this.taskName = '';
      this.taskDescription = '';
    }
  }
}