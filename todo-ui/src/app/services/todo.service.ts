import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface Todo {
  id?: number;
  name: string;
  description: string;
}

@Injectable({
 providedIn: 'root'
})
export class TodoService {
 private apiUrl = environment.apiUrl + '/todos';

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  getTodoById(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  createTodo(todo: Todo): Observable<Todo> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Todo>(this.apiUrl, todo, { headers });
  }

  updateTodo(id: number, todo: Todo): Observable<Todo> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo, { headers });
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchTodos(keyword: string): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}/search`, {
      params: { keyword }
    });
  }
}