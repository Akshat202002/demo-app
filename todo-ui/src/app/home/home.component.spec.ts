// todo-ui/src/app/home/home.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TodoService } from '../services/todo.service';
import { of } from 'rxjs';
import { TaskFormComponent } from '../task-form/task-form.component';
import { HeaderComponent } from '../header/header.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let todoService: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    const todoServiceSpy = jasmine.createSpyObj('TodoService', ['getTodos', 'createTodo', 'updateTodo', 'deleteTodo', 'searchTodos', 'createOrUpdateTodo']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterModule.forRoot([]),
        HomeComponent,
        TaskFormComponent,
        HeaderComponent,
        TaskListComponent,
        SearchBarComponent
      ],
      providers: [{ provide: TodoService, useValue: todoServiceSpy }]
    }).compileComponents();

    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    todoService.getTodos.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos on init', () => {
    const todos = [{ id: 1, name: 'Test Todo', description: 'Test Description', completed: false }];
    todoService.getTodos.and.returnValue(of(todos));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.tasks).toEqual(todos);
  });

  it('should add a new todo', () => {
    const newTodo = { id: 1, name: 'New Todo', description: 'New Description', completed: false };
    todoService.createTodo.and.returnValue(of(newTodo));

    component.addOrUpdateTask({ taskName: 'New Todo', taskDescription: 'New Description' });
    fixture.detectChanges();

    expect(component.tasks).toContain(newTodo);
  });

  it('should update an existing todo', () => {
    const existingTodo = { id: 1, name: 'Existing Todo', description: 'Existing Description', completed: false };
    const updatedTodo = { id: 1, name: 'Updated Todo', description: 'Updated Description', completed: false };
    component.tasks = [existingTodo];
    component.isEditMode = true;
    component.editIndex = 0;
    todoService.updateTodo.and.returnValue(of(updatedTodo));

    component.addOrUpdateTask({ taskName: 'Updated Todo', taskDescription: 'Updated Description' });
    fixture.detectChanges();

    expect(component.tasks[0]).toEqual(updatedTodo);
  });

  it('should delete a todo', () => {
    const todoToDelete = { id: 1, name: 'Todo to Delete', description: 'Description', completed: false };
    component.tasks = [todoToDelete];
    todoService.deleteTodo.and.returnValue(of(void 0));

    component.deleteTask(0);
    fixture.detectChanges();

    expect(component.tasks.length).toBe(0);
  });

  it('should reset form after adding or updating a todo', () => {
    component.taskName = 'Test Task';
    component.taskDescription = 'Test Description';
    component.isEditMode = true;
    component.editIndex = 0;

    component.resetForm();

    expect(component.taskName).toBe('');
    expect(component.taskDescription).toBe('');
    expect(component.isEditMode).toBe(false);
    expect(component.editIndex).toBeNull();
  });

  it('should edit a todo', () => {
    const todoToEdit = { id: 1, name: 'Todo to Edit', description: 'Description', completed: false };
    component.tasks = [todoToEdit];

    component.editTask(0);

    expect(component.taskName).toBe('Todo to Edit');
    expect(component.taskDescription).toBe('Description');
    expect(component.isEditMode).toBe(true);
    expect(component.editIndex).toBe(0);
  });

  it('should search todos', () => {
    const searchResult = [{ id: 1, name: 'Search Result', description: 'Description', completed: false }];
    todoService.searchTodos.and.returnValue(of(searchResult));

    component.searchTasks('Search');
    fixture.detectChanges();

    expect(todoService.searchTodos).toHaveBeenCalledWith('Search');
    expect(component.tasks).toEqual(searchResult);
  });

  it('should sort tasks by completion status', () => {
    const task1 = { id: 1, name: 'Task 1', description: 'Description 1', completed: true };
    const task2 = { id: 2, name: 'Task 2', description: 'Description 2', completed: false };
    component.tasks = [task1, task2];

    component.sortTasks();

    expect(component.tasks).toEqual([task2, task1]);
  });

  it('should update task status', () => {
    const task = { id: 1, name: 'Task', description: 'Description', completed: false };
    component.tasks = [task];
    todoService.createOrUpdateTodo.and.returnValue(of(task));

    component.updateTaskStatus(task);

    expect(todoService.createOrUpdateTodo).toHaveBeenCalledWith(task);
  });
});
