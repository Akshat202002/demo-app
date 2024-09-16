import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { TodoService } from '../services/todo.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let todoService: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    const todoServiceSpy = jasmine.createSpyObj('TodoService', ['getTodos', 'createTodo', 'updateTodo', 'deleteTodo', 'searchTodos', 'createOrUpdateTodo']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterOutlet, ButtonModule, RippleModule, InputTextModule, HomeComponent],
      providers: [{ provide: TodoService, useValue: todoServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the title 'Todo App'`, () => {
    expect(component.title).toEqual('Todo App');
  });

  it('should load todos on init', () => {
    const mockTodos = [{ id: 1, name: 'Test Todo', description: 'Test Description', completed: false }];
    todoService.getTodos.and.returnValue(of(mockTodos));

    component.ngOnInit();

    expect(component.tasks).toEqual(mockTodos);
  });

  it('should add a new task', () => {
    const mockTodo = { id: 1, name: 'New Task', description: 'New Description', completed: false };
    todoService.createTodo.and.returnValue(of(mockTodo));

    component.taskName = 'New Task';
    component.taskDescription = 'New Description';
    component.addOrUpdateTask(new Event('submit'));

    expect(component.tasks).toContain(mockTodo);
    expect(component.taskName).toBe('');
    expect(component.taskDescription).toBe('');
  });

  it('should update an existing task', () => {
    const mockTodo = { id: 1, name: 'Updated Task', description: 'Updated Description', completed: false };
    component.tasks = [{ id: 1, name: 'Old Task', description: 'Old Description', completed: false }];
    component.isEditMode = true;
    component.editIndex = 0;
    todoService.updateTodo.and.returnValue(of(mockTodo));

    component.taskName = 'Updated Task';
    component.taskDescription = 'Updated Description';
    component.addOrUpdateTask(new Event('submit'));

    expect(component.tasks[0]).toEqual(mockTodo);
    expect(component.isEditMode).toBe(false);
    expect(component.editIndex).toBeNull();
  });

  it('should delete a task', () => {
    const mockTodo = { id: 1, name: 'Task to Delete', description: 'Description', completed: false };
    component.tasks = [mockTodo];
    todoService.deleteTodo.and.returnValue(of(undefined));

    component.deleteTask(0);

    expect(component.tasks.length).toBe(0);
  });

  it('should search tasks', () => {
    const mockTodos = [{ id: 1, name: 'Search Result', description: 'Description', completed: false }];
    todoService.searchTodos.and.returnValue(of(mockTodos));

    component.searchKeyword = 'Search';
    component.searchTasks('Search');

    expect(component.tasks).toEqual(mockTodos);
  });

  it('should reset the form', () => {
    component.taskName = 'Task';
    component.taskDescription = 'Description';
    component.isEditMode = true;
    component.editIndex = 1;

    component.resetForm();

    expect(component.taskName).toBe('');
    expect(component.taskDescription).toBe('');
    expect(component.isEditMode).toBe(false);
    expect(component.editIndex).toBeNull();
  });

  it('should update task status', () => {
    const mockTodo = { id: 1, name: 'Task', description: 'Description', completed: true };
    todoService.createOrUpdateTodo.and.returnValue(of(mockTodo));
    spyOn(component, 'loadTodos');

    component.updateTaskStatus(mockTodo);

    expect(component.loadTodos).toHaveBeenCalled();
  });

  it('should sort tasks by completion status', () => {
    const mockTodos = [
      { id: 1, name: 'Incomplete Task', description: 'Description', completed: false },
      { id: 2, name: 'Complete Task', description: 'Description', completed: true }
    ];
    component.tasks = mockTodos;

    component.sortTasks();

    expect(component.tasks[0].completed).toBe(false);
    expect(component.tasks[1].completed).toBe(true);
  });
});
