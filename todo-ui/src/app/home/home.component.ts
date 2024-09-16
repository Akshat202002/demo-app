
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { TodoService, Todo } from '../services/todo.service'
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { TaskFormComponent } from '../task-form/task-form.component';
import { HeaderComponent } from '../header/header.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, FormsModule, ButtonModule, RippleModule, InputTextModule, TaskFormComponent, HeaderComponent, TaskListComponent, SearchBarComponent],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title: string = 'Todo App';
  taskName: string = '';
  taskDescription: string = '';
  tasks: Todo[] = [];
  isEditMode: boolean = false;
  editIndex: number | null = null;
  searchKeyword: string = '';
  private searchSubject = new Subject<string>();

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
    this.setupSearch();
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.tasks = todos.sort((a, b) => Number(a.completed) - Number(b.completed));
    });
  }

  addOrUpdateTask(event: { taskName: string, taskDescription: string }): void {
    const todo: Todo = { name: event.taskName, description: event.taskDescription };

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

  searchTasks(keyword: string): void {
    this.searchSubject.next(keyword);
  }

  setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(keyword => {
        if (keyword.trim() === '') {
          return this.todoService.getTodos();
        } else {
          return this.todoService.searchTodos(keyword);
        }
      })
    ).subscribe(tasks => {
      this.tasks = tasks;
    });
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
