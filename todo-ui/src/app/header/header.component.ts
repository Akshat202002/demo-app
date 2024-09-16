import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="flex w-full justify-content-center bg-gray-800 p-4 text-white">
      <h1 class="text-center text-3xl font-bold">{{ title }}</h1>
    </header>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  title = 'Todo Application';
}
