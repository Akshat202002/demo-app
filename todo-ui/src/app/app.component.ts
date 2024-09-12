
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { TodoService, Todo } from './services/todo.service';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, FormsModule, ButtonModule, RippleModule, InputTextModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: string = 'Todo App';
  taskName: string = '';
  taskDescription: string = '';
  tasks: Todo[] = [];
  isEditMode: boolean = false;
  editIndex: number | null = null;
  searchKeyword: string = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.tasks = todos.sort((a, b) => Number(a.completed) - Number(b.completed));
    });
  }

  addOrUpdateTask(event: Event): void {
    event.preventDefault();
    const todo: Todo = { name: this.taskName, description: this.taskDescription };

    if (this.isEditMode && this.editIndex !== null) {
      const id = this.tasks[this.editIndex].id!;
      this.todoService.updateTodo(id, todo).subscribe(updatedTodo => {
        this.tasks[this.editIndex!] = updatedTodo;
        this.resetForm();
      });
    } else {
      this.todoService.createTodo(todo).subscribe(newTodo => {
        this.tasks.push(newTodo);
        this.resetForm();
      });
    }
  }

  editTask(index: number): void {
    this.taskName = this.tasks[index].name;
    this.taskDescription = this.tasks[index].description;
    this.isEditMode = true;
    this.editIndex = index;
  }

  deleteTask(index: number): void {
    const id = this.tasks[index].id!;
    this.todoService.deleteTodo(id).subscribe(() => {
      this.tasks.splice(index, 1);
      this.resetForm();
    });
  }

  resetForm(): void {
    this.taskName = '';
    this.taskDescription = '';
    this.isEditMode = false;
    this.editIndex = null;
  }

  searchTasks() {
    if (this.searchKeyword.trim() === '') {
        this.loadTodos();
    } else {
        this.todoService.searchTodos(this.searchKeyword).subscribe((tasks) => {
            this.tasks = tasks;
        });
    }
  }

  updateTaskStatus(task: Todo) {
    this.todoService.createOrUpdateTodo(task).subscribe(() => {
        this.loadTodos();
    });
  }

  sortTasks(): void {
    this.tasks.sort((a, b) => Number(a.completed) - Number(b.completed));
  }
}
