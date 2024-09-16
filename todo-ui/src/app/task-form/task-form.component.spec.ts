// todo-ui/src/app/task-form/task-form.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TaskFormComponent } from './task-form.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { By } from '@angular/platform-browser';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ButtonModule, InputTextModule, TaskFormComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit addOrUpdateTask event on form submit', () => {
    spyOn(component.addOrUpdateTask, 'emit');
    component.taskName = 'Test Task';
    component.taskDescription = 'Test Description';

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', { preventDefault: () => {} });

    expect(component.addOrUpdateTask.emit).toHaveBeenCalledWith({
      taskName: 'Test Task',
      taskDescription: 'Test Description'
    });
  });

  it('should bind input values to component properties', () => {
    const nameInput = fixture.debugElement.query(By.css('input[name="name"]')).nativeElement;
    const descriptionInput = fixture.debugElement.query(By.css('input[name="description"]')).nativeElement;

    nameInput.value = 'Test Task';
    descriptionInput.value = 'Test Description';
    nameInput.dispatchEvent(new Event('input'));
    descriptionInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.taskName).toBe('Test Task');
    expect(component.taskDescription).toBe('Test Description');
  });

  it('should display "Add Task" button when not in edit mode', () => {
    component.isEditMode = false;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.textContent).toContain('Add Task');
  });

  it('should display "Update Task" button when in edit mode', () => {
    component.isEditMode = true;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.textContent).toContain('Update Task');
  });
});
