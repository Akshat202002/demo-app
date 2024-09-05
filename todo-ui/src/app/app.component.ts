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
    title = 'TODO App'; 
    taskName: string = ''; 
    tasks: string[] = [];

    addTask(event: Event): void { 
        event.preventDefault(); 
        if (this.taskName.trim()) { 
            this.tasks.push(this.taskName); 
            this.taskName = '';
        }
    }
} 