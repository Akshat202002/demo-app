import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  // { path: '', redirectTo: 'todo', pathMatch: 'full' },
  // {path: 'page-not-found', component: PageNotFoundComponent},
  {path: '**', component: PageNotFoundComponent}
];
