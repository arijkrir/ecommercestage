import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5102/api/users'; // URL de votre API backend

  constructor(private http: HttpClient) {}
  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, user);
  }
  // Méthode pour récupérer les informations utilisateur par ID
  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Méthode pour mettre à jour les informations utilisateur
  updateUser(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }
  getTopClients(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/top-clients`);
  }

  getTopCity(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/top-city`);
  }

  getTopProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/top-products`);
  }
}
